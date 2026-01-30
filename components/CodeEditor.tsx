
import React, { useState, useEffect } from 'react';

interface CodeEditorProps {
  initialCode: string;
  expectedOutput: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ initialCode, expectedOutput }) => {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState('');
  const [status, setStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');

  useEffect(() => {
    setCode(initialCode);
    setOutput('');
    setStatus('idle');
  }, [initialCode]);

  const runCode = () => {
    setStatus('running');
    // Simulated execution for the demo
    setTimeout(() => {
      if (code.trim() === initialCode.trim()) {
        setOutput(expectedOutput);
        setStatus('success');
      } else {
        setOutput('خطأ: لم يتم التعرف على الكود المدخل. حاول استخدام الكود المعطى في الدرس.');
        setStatus('error');
      }
    }, 800);
  };

  return (
    <div className="bg-gray-800 rounded-2xl flex-1 flex flex-col shadow-xl border border-gray-700 overflow-hidden">
      <div className="bg-gray-900 px-4 py-3 border-b border-gray-700 flex justify-between items-center">
        <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">محرر الكواد - editor.py</span>
        <button 
          onClick={runCode}
          disabled={status === 'running'}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
          تشغيل الكود
        </button>
      </div>

      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="flex-1 bg-gray-900 text-green-400 font-mono p-4 resize-none focus:outline-none focus:ring-1 focus:ring-blue-500/50 text-sm md:text-base"
        dir="ltr"
        spellCheck={false}
      />

      <div className="bg-gray-900 border-t border-gray-700 p-4 min-h-[120px]">
        <h4 className="text-xs font-bold text-gray-500 mb-2">المخرجات (Terminal)</h4>
        <div className={`font-mono text-sm ${
          status === 'error' ? 'text-red-400' : 'text-gray-300'
        }`}>
          {status === 'running' ? 'جاري التنفيذ...' : (output || 'اضغط على "تشغيل الكود" لرؤية النتيجة هنا.')}
          {status === 'success' && (
            <div className="mt-2 text-green-500 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              أحسنت! إجابة صحيحة.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
