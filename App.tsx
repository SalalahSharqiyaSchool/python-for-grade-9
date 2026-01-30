
import React, { useState } from 'react';
import { LESSONS } from './constants';
import { Lesson } from './types';
import CodeEditor from './components/CodeEditor';
import Sidebar from './components/Sidebar';
import VoiceTutor from './components/VoiceTutor';
import LessonContent from './components/LessonContent';

const App: React.FC = () => {
  const [currentLesson, setCurrentLesson] = useState<Lesson>(LESSONS[0]);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLessonSelect = (lesson: Lesson) => {
    setCurrentLesson(lesson);
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-900 overflow-hidden font-sans relative">
      {/* Sidebar */}
      <Sidebar 
        lessons={LESSONS} 
        currentLessonId={currentLesson.id} 
        onSelect={handleLessonSelect}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between p-4 bg-gray-900 border-b border-gray-800 shrink-0">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 bg-gray-800 rounded-lg text-blue-400"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-blue-400 leading-tight">بيثون الصغير 🐍</h1>
              <p className="text-[10px] md:text-xs text-gray-500 hidden xs:block uppercase tracking-widest font-bold">Grade 9 Programming Platform</p>
            </div>
          </div>
          
          <button 
            onClick={() => setIsVoiceActive(true)}
            className="flex items-center gap-2 px-3 py-2 md:px-5 md:py-2.5 rounded-xl transition-all text-sm md:text-base bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20 font-bold active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 005.93 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
            </svg>
            <span className="hidden sm:inline">تحدث مع المعلم</span>
            <span className="sm:hidden">تحدث</span>
          </button>
        </header>

        {/* Content Body: Divided into two equal parts on mobile, two columns on desktop */}
        <div className="flex-1 flex flex-col lg:grid lg:grid-cols-2 gap-4 p-4 overflow-hidden overflow-y-auto lg:overflow-hidden">
          
          {/* Section 1: Lesson Content */}
          <div className="bg-gray-800 rounded-2xl p-5 md:p-8 shadow-xl border border-gray-700 flex flex-col min-h-[45vh] lg:min-h-0 lg:h-full overflow-y-auto">
            <LessonContent lesson={currentLesson} />
            <div className="mt-auto pt-6">
              <div className="p-4 bg-gray-900/50 rounded-xl border border-dashed border-gray-700">
                <p className="text-sm text-gray-400 text-center italic">
                  نصيحة: طبّق الكود الذي قرأته في الأسفل لرؤية النتيجة مباشرة!
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Code Editor */}
          <div className="min-h-[45vh] lg:min-h-0 lg:h-full flex flex-col">
            <CodeEditor initialCode={currentLesson.codeSnippet} expectedOutput={currentLesson.expectedOutput} />
          </div>

        </div>
      </main>

      {/* Voice Tutor Modal (Independent Dedicated Window) */}
      {isVoiceActive && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4 md:p-8 lg:p-12 animate-in fade-in duration-200">
          <div 
            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
            onClick={() => setIsVoiceActive(false)}
          ></div>
          
          <div className="relative w-full h-full max-w-5xl md:h-[90vh] bg-gray-900 md:rounded-3xl shadow-2xl border border-gray-800 overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-300">
            {/* Modal Header */}
            <div className="p-4 bg-gray-800/80 border-b border-gray-700 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-white text-xl">المعلم الذكي</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <p className="text-xs text-blue-400 font-medium uppercase tracking-wider">متصل الآن - مساعد البرمجة</p>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsVoiceActive(false)}
                className="group flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-xl transition-all font-bold border border-red-500/20"
              >
                <span className="hidden sm:inline">إنهاء المحادثة</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-hidden p-4 md:p-8 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
              <VoiceTutor 
                active={isVoiceActive} 
                context={`أنت معلم برمجة بايثون لطلاب الصف التاسع. الدرس الحالي هو: ${currentLesson.title}. محتوى الدرس: ${currentLesson.content}. الكود المقترح: ${currentLesson.codeSnippet}`} 
              />
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-gray-900 border-t border-gray-800 text-center shrink-0">
              <p className="text-[10px] md:text-xs text-gray-600 font-bold uppercase tracking-widest">Powered by Gemini AI Live Technology</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
