
import React, { useEffect, useRef, useState } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Blob } from '@google/genai';

interface VoiceTutorProps {
  active: boolean;
  context: string;
}

const VoiceTutor: React.FC<VoiceTutorProps> = ({ active, context }) => {
  const [transcription, setTranscription] = useState<string>('');
  const [isReady, setIsReady] = useState(false);
  
  const audioContextInRef = useRef<AudioContext | null>(null);
  const audioContextOutRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionRef = useRef<any>(null);

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

  useEffect(() => {
    if (!active) {
      if (sessionRef.current) {
        // Assume session cleanup
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
              // Transcription handling
              if (message.serverContent?.outputTranscription) {
                setTranscription(prev => prev + message.serverContent?.outputTranscription?.text);
              }
              if (message.serverContent?.turnComplete) {
                setTranscription(''); // Reset for next turn if desired
              }

              // Audio output handling
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
            systemInstruction: `أنت مساعد تعليمي ودود لطلاب الصف التاسع. ساعدهم في تعلم بايثون بالعربية. السياق الحالي: ${context}. كن مشجعاً وواضحاً.`,
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
      // Cleanup
      if (audioContextInRef.current) audioContextInRef.current.close();
      if (audioContextOutRef.current) audioContextOutRef.current.close();
      sourcesRef.current.forEach(s => s.stop());
    };
  }, [active, context]);

  return (
    <div className="bg-gray-900/50 rounded-xl p-6 border border-blue-500/30 h-full flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        <div className={`w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center z-10 relative ${isReady ? 'animate-pulse' : 'opacity-50'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        </div>
        {isReady && (
          <>
            <div className="absolute top-0 left-0 w-20 h-20 bg-blue-500 rounded-full animate-ping opacity-25"></div>
            <div className="absolute top-0 left-0 w-20 h-20 bg-blue-400 rounded-full animate-ping opacity-10 delay-150"></div>
          </>
        )}
      </div>
      
      <div className="text-center">
        <h3 className="text-blue-300 font-bold mb-1">
          {isReady ? 'المعلم يسمعك الآن...' : 'جاري الاتصال بالمعلم...'}
        </h3>
        <p className="text-sm text-gray-400">
          تحدث بالعربية واسأل عن أي شيء في الدرس
        </p>
      </div>

      {transcription && (
        <div className="w-full bg-gray-800/80 p-4 rounded-lg border border-gray-700 mt-4 max-h-32 overflow-y-auto">
          <p className="text-sm text-gray-200 leading-relaxed italic">
            "{transcription}"
          </p>
        </div>
      )}
    </div>
  );
};

export default VoiceTutor;
