
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

  const handleLessonSelect = (lesson: Lesson) => {
    setCurrentLesson(lesson);
  };

  return (
    <div className="flex h-screen bg-gray-900 overflow-hidden font-sans">
      {/* Sidebar - Navigation through lessons */}
      <Sidebar 
        lessons={LESSONS} 
        currentLessonId={currentLesson.id} 
        onSelect={handleLessonSelect} 
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <div className="flex-1 flex flex-col p-4 space-y-4 overflow-y-auto">
          {/* Header */}
          <header className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-2xl font-bold text-blue-400">بيثون الصغير 🐍</h1>
              <p className="text-gray-400">منصة الصف التاسع للبرمجة</p>
            </div>
            
            <button 
              onClick={() => setIsVoiceActive(!isVoiceActive)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                isVoiceActive 
                  ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                  : 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30'
              }`}
            >
              {isVoiceActive ? (
                <>
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                  إيقاف المعلم الصوتي
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 005.93 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                  </svg>
                  تحدث مع المعلم (Live)
                </>
              )}
            </button>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
            {/* Left Column: Lesson Content */}
            <div className="bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-700 flex flex-col">
              <LessonContent lesson={currentLesson} />
              
              {/* Live Voice Assistant UI (Conditional Overlay) */}
              {isVoiceActive && (
                <div className="mt-6 flex-1">
                  <VoiceTutor 
                    active={isVoiceActive} 
                    context={`أنت معلم برمجة بايثون لطلاب الصف التاسع. الدرس الحالي هو: ${currentLesson.title}. ساعد الطالب في فهم هذا الكود: ${currentLesson.codeSnippet}`} 
                  />
                </div>
              )}
            </div>

            {/* Right Column: Code Editor & Execution */}
            <div className="flex flex-col gap-4 overflow-hidden">
              <CodeEditor initialCode={currentLesson.codeSnippet} expectedOutput={currentLesson.expectedOutput} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
