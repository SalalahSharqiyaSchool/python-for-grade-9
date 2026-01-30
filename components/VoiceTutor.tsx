
import React, { useEffect, useRef, useState } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Blob } from '@google/genai';

interface VoiceTutorProps {
  active: boolean;
  context: string;
}

interface SharedSnippet {
  id: string;
  code: string;
  timestamp: Date;
}

const VoiceTutor: React.FC<VoiceTutorProps> = ({ active, context }) => {
  const [transcription, setTranscription] = useState<string>('');
  const [snippets, setSnippets] = useState<SharedSnippet[]>([]);
  const [isReady, setIsReady] = useState(false);
  
  const audioContextInRef = useRef<AudioContext | null>(null);
  const audioContextOutRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionRef = useRef<any>(null);
  const accumulatedTranscriptionRef = useRef<string>('');

  // Manual implementation of encode/decode for base64
  const encode = (bytes: Uint8Array) => {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  const decodeAudioData = async (
    data: Uint8Array,
    ctx: AudioContext,
    sampleRate: number,
    numChannels: number,
  ): Promise<AudioBuffer> => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  };

  const createBlob = (data: Float32Array): Blob => {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
      int16[i] = data[i] * 32768;
    }
    return {
      data: encode(new Uint8Array(int16.buffer)),
      mimeType: 'audio/pcm;rate=16000',
    };
  };

  const extractCodeBlocks = (text: string) => {
    const regex = /```(?:python)?\n?([\s\S]*?)```/g;
    let match;
    const found: string[] = [];
    while ((match = regex.exec(text)) !== null) {
      if (match[1]) found.push(match[1].trim());
    }
    return found;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('تم نسخ الكود!');
  };

  const deleteSnippet = (id: string) => {
    setSnippets(prev => prev.filter(s => s.id !== id));
  };

  useEffect(() => {
    if (!active) {
      if (sessionRef.current) {
        sessionRef.current = null;
      }
      return;
    }

    const startSession = async () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        audioContextInRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
        audioContextOutRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        const sessionPromise = ai.live.connect({
          model: 'gemini-2.5-flash-native-audio-preview-12-2025',
          callbacks: {
            onopen: () => {
              setIsReady(true);
              const source = audioContextInRef.current!.createMediaStreamSource(stream);
              const scriptProcessor = audioContextInRef.current!.createScriptProcessor(4096, 1, 1);
              
              scriptProcessor.onaudioprocess = (e) => {
                const inputData = e.inputBuffer.getChannelData(0);
                const pcmBlob = createBlob(inputData);
                sessionPromise.then((session) => {
                  session.sendRealtimeInput({ media: pcmBlob });
                });
              };
              
              source.connect(scriptProcessor);
              scriptProcessor.connect(audioContextInRef.current!.destination);
            },
            onmessage: async (message: LiveServerMessage) => {
              if (message.serverContent?.outputTranscription) {
                const text = message.serverContent.outputTranscription.text;
                accumulatedTranscriptionRef.current += text;
                setTranscription(accumulatedTranscriptionRef.current);
                
                // Try to extract code blocks as they appear
                const blocks = extractCodeBlocks(accumulatedTranscriptionRef.current);
                if (blocks.length > 0) {
                  setSnippets(prev => {
                    const existingCodes = prev.map(s => s.code);
                    const newBlocks = blocks.filter(b => !existingCodes.includes(b));
                    if (newBlocks.length === 0) return prev;
                    
                    const newSnippets = newBlocks.map(b => ({
                      id: Math.random().toString(36).substr(2, 9),
                      code: b,
                      timestamp: new Date()
                    }));
                    return [...prev, ...newSnippets];
                  });
                }
              }
              
              if (message.serverContent?.turnComplete) {
                accumulatedTranscriptionRef.current = '';
                setTranscription('');
              }

              const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
              if (base64Audio && audioContextOutRef.current) {
                const ctx = audioContextOutRef.current;
                nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
                
                const audioBuffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
                const source = ctx.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(ctx.destination);
                
                source.addEventListener('ended', () => {
                  sourcesRef.current.delete(source);
                });
                
                source.start(nextStartTimeRef.current);
                nextStartTimeRef.current += audioBuffer.duration;
                sourcesRef.current.add(source);
              }

              if (message.serverContent?.interrupted) {
                sourcesRef.current.forEach(s => s.stop());
                sourcesRef.current.clear();
                nextStartTimeRef.current = 0;
              }
            },
            onerror: (e) => console.error("Live API Error:", e),
            onclose: () => setIsReady(false),
          },
          config: {
            responseModalities: [Modality.AUDIO],
            outputAudioTranscription: {},
            systemInstruction: `أنت مساعد تعليمي ودود لطلاب الصف التاسع. ساعدهم في تعلم بايثون بالعربية. السياق الحالي: ${context}. كن مشجعاً وواضحاً. هام جداً: عندما تشرح كوداً برمجياً، قم بكتابته بوضوح داخل علامات الثلاث نقاط (markdown code blocks) مثل \`\`\`python ... \`\`\` لكي يتمكن الطالب من رؤيته ونسخه.`,
            speechConfig: {
              voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
            }
          }
        });

        sessionRef.current = sessionPromise;

      } catch (err) {
        console.error("Failed to start Live session", err);
      }
    };

    startSession();

    return () => {
      if (audioContextInRef.current) audioContextInRef.current.close();
      if (audioContextOutRef.current) audioContextOutRef.current.close();
      sourcesRef.current.forEach(s => s.stop());
    };
  }, [active, context]);

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="bg-gray-900/50 rounded-xl p-4 border border-blue-500/30 flex flex-col items-center justify-center space-y-4">
        <div className="relative">
          <div className={`w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center z-10 relative ${isReady ? 'animate-pulse' : 'opacity-50'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </div>
          {isReady && (
            <div className="absolute top-0 left-0 w-16 h-16 bg-blue-500 rounded-full animate-ping opacity-20"></div>
          )}
        </div>
        
        <div className="text-center">
          <h3 className="text-blue-300 font-bold text-sm">
            {isReady ? 'المعلم يسمعك...' : 'جاري الاتصال...'}
          </h3>
        </div>

        {transcription && (
          <div className="w-full bg-gray-800/80 p-3 rounded-lg border border-gray-700 max-h-24 overflow-y-auto transition-all">
            <p className="text-xs text-gray-300 leading-relaxed italic">
              "{transcription}"
            </p>
          </div>
        )}
      </div>

      {/* Code Snippets Section */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        <h4 className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          الأكواد المقترحة
        </h4>
        
        {snippets.length === 0 ? (
          <div className="text-center py-6 border-2 border-dashed border-gray-800 rounded-xl">
            <p className="text-xs text-gray-600">سيظهر أي كود يذكره المعلم هنا تلقائياً</p>
          </div>
        ) : (
          snippets.map((snippet) => (
            <div key={snippet.id} className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden group shadow-lg">
              <div className="bg-gray-900 px-3 py-1.5 flex justify-between items-center border-b border-gray-700">
                <span className="text-[10px] text-blue-400 font-mono">python_snippet.py</span>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => copyToClipboard(snippet.code)}
                    className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-white transition-colors"
                    title="نسخ الكود"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => deleteSnippet(snippet.id)}
                    className="p-1 hover:bg-red-900/30 rounded text-gray-400 hover:text-red-400 transition-colors"
                    title="حذف"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              <pre className="p-3 text-xs font-mono text-green-400 bg-gray-900/80 overflow-x-auto select-all" dir="ltr">
                {snippet.code}
              </pre>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default VoiceTutor;
