
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
  const [isEditorModalOpen, setIsEditorModalOpen] = useState(false);

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
        <div className="flex-1 flex flex-col p-4 space-y-4 overflow-y-auto pb-24 lg:pb-4">
          {/* Header */}
          <header className="flex items-center justify-between mb-2 gap-4">
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
                <h1 className="text-xl md:text-2xl font-bold text-blue-400">بيثون الصغير 🐍</h1>
                <p className="text-xs md:text-sm text-gray-400 hidden sm:block">منصة الصف التاسع للبرمجة</p>
              </div>
            </div>
            
            <button 
              onClick={() => setIsVoiceActive(!isVoiceActive)}
              className={`flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 rounded-full transition-all text-sm md:text-base ${
                isVoiceActive 
                  ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                  : 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30'
              }`}
            >
              {isVoiceActive ? (
                <>
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                  إيقاف
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 005.93 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                  </svg>
                  <span className="hidden xs:inline">المعلم الصوتي</span>
                  <span className="xs:hidden">تحدث</span>
                </>
              )}
            </button>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-0">
            {/* Left Column: Lesson Content */}
            <div className="bg-gray-800 rounded-2xl p-4 md:p-6 shadow-xl border border-gray-700 flex flex-col overflow-y-auto h-full">
              <LessonContent lesson={currentLesson} />
              
              {isVoiceActive && (
                <div className="mt-6 flex-1 min-h-[300px]">
                  <VoiceTutor 
                    active={isVoiceActive} 
                    context={`أنت معلم برمجة بايثون لطلاب الصف التاسع. الدرس الحالي هو: ${currentLesson.title}. ساعد الطالب في فهم هذا الكود: ${currentLesson.codeSnippet}`} 
                  />
                </div>
              )}
            </div>

            {/* Right Column: Code Editor (Desktop Only) */}
            <div className="hidden lg:flex flex-col h-full overflow-hidden">
              <CodeEditor initialCode={currentLesson.codeSnippet} expectedOutput={currentLesson.expectedOutput} />
            </div>
          </div>
        </div>
      </main>

      {/* Floating Button for Mobile Editor (Bottom Left) */}
      {!isEditorModalOpen && (
        <button
          onClick={() => setIsEditorModalOpen(true)}
          className="lg:hidden fixed bottom-6 left-6 z-30 bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-2xl transition-transform active:scale-90 flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
          <span className="mr-2 font-bold ml-1">جرب الكود</span>
        </button>
      )}

      {/* Mobile Editor Modal */}
      {isEditorModalOpen && (
        <div className="lg:hidden fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => setIsEditorModalOpen(false)}
          ></div>
          <div className="relative w-full max-w-lg h-[80vh] bg-gray-800 rounded-3xl shadow-2xl border border-gray-700 overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
            <div className="p-4 bg-gray-900 border-b border-gray-700 flex justify-between items-center">
              <h3 className="font-bold text-blue-400">تطبيق عملي: {currentLesson.title}</h3>
              <button 
                onClick={() => setIsEditorModalOpen(false)}
                className="p-2 hover:bg-gray-800 rounded-full text-gray-400"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-hidden flex flex-col">
              <CodeEditor initialCode={currentLesson.codeSnippet} expectedOutput={currentLesson.expectedOutput} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
