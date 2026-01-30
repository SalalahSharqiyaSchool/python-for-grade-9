
import React, { useState, useEffect } from 'react';
import { LESSONS as INITIAL_LESSONS } from './constants';
import { Lesson, UserRole } from './types';
import CodeEditor from './components/CodeEditor';
import Sidebar from './components/Sidebar';
import VoiceTutor from './components/VoiceTutor';
import LessonContent from './components/LessonContent';
import TeacherPanel from './components/TeacherPanel';

const App: React.FC = () => {
  const [lessons, setLessons] = useState<Lesson[]>(() => {
    const saved = localStorage.getItem('python_lessons');
    return saved ? JSON.parse(saved) : INITIAL_LESSONS;
  });

  const [currentLesson, setCurrentLesson] = useState<Lesson>(lessons[0] || INITIAL_LESSONS[0]);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isTeacherPanelOpen, setIsTeacherPanelOpen] = useState(false);
  
  // Role Management
  const [role, setRole] = useState<UserRole>('student');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [password, setPassword] = useState('');

  useEffect(() => {
    localStorage.setItem('python_lessons', JSON.stringify(lessons));
  }, [lessons]);

  const handleLessonSelect = (lesson: Lesson) => {
    setCurrentLesson(lesson);
    setIsSidebarOpen(false);
  };

  const handleSaveLessons = (updatedLessons: Lesson[]) => {
    setLessons(updatedLessons);
    const stillExists = updatedLessons.find(l => l.id === currentLesson.id);
    if (!stillExists && updatedLessons.length > 0) {
      setCurrentLesson(updatedLessons[0]);
    } else if (stillExists) {
      setCurrentLesson(stillExists);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '1234') { // رمز الدخول الافتراضي
      setRole('teacher');
      setShowLoginModal(false);
      setPassword('');
      alert('مرحباً بك أيها المعلم! تم تفعيل أدوات التحكم.');
    } else {
      alert('رمز الدخول خاطئ!');
    }
  };

  const handleLogout = () => {
    setRole('student');
    setIsTeacherPanelOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-900 overflow-hidden font-sans relative">
      {/* Sidebar */}
      <Sidebar 
        lessons={lessons} 
        currentLessonId={currentLesson.id} 
        onSelect={handleLessonSelect}
        onUpdateLessons={handleSaveLessons}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        role={role}
        onTeacherLogin={() => setShowLoginModal(true)}
        onLogout={handleLogout}
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
          
          <div className="flex items-center gap-2">
            {/* Teacher Toggle - Only visible to teachers */}
            {role === 'teacher' && (
              <button 
                onClick={() => setIsTeacherPanelOpen(true)}
                className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-all border border-amber-500/20"
                title="لوحة المعلم"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            )}

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
          </div>
        </header>

        {/* Content Body */}
        <div className="flex-1 flex flex-col lg:grid lg:grid-cols-2 gap-4 p-4 overflow-hidden overflow-y-auto lg:overflow-hidden">
          <div className="bg-gray-800 rounded-2xl p-5 md:p-8 shadow-xl border border-gray-700 flex flex-col min-h-[45vh] lg:min-h-0 lg:h-full overflow-y-auto">
            <LessonContent lesson={currentLesson} />
          </div>
          <div className="min-h-[45vh] lg:min-h-0 lg:h-full flex flex-col">
            <CodeEditor initialCode={currentLesson.codeSnippet} expectedOutput={currentLesson.expectedOutput} />
          </div>
        </div>
      </main>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setShowLoginModal(false)}></div>
          <div className="relative bg-gray-800 p-8 rounded-3xl border border-amber-500/30 max-w-sm w-full shadow-2xl animate-in zoom-in duration-200">
            <h3 className="text-xl font-bold text-white mb-4 text-center">دخول المعلم 🔐</h3>
            <form onSubmit={handleLogin} className="space-y-4">
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="أدخل رمز الدخول..."
                className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-amber-500 outline-none text-center text-lg tracking-[1em]"
                autoFocus
              />
              <button type="submit" className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-amber-500/20">
                تحقق من الهوية
              </button>
              <button type="button" onClick={() => setShowLoginModal(false)} className="w-full py-2 text-gray-500 hover:text-gray-400 text-sm">
                إلغاء
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Teacher Panel Modal */}
      {isTeacherPanelOpen && (
        <TeacherPanel lessons={lessons} onSave={handleSaveLessons} onClose={() => setIsTeacherPanelOpen(false)} />
      )}

      {/* Voice Tutor Modal */}
      {isVoiceActive && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4 md:p-8 lg:p-12">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setIsVoiceActive(false)}></div>
          <div className="relative w-full h-full max-w-5xl md:h-[90vh] bg-gray-900 md:rounded-3xl shadow-2xl border border-gray-800 overflow-hidden flex flex-col">
            <div className="p-4 bg-gray-800/80 border-b border-gray-700 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" /></svg>
                </div>
                <h3 className="font-bold text-white text-xl">المعلم الذكي</h3>
              </div>
              <button onClick={() => setIsVoiceActive(false)} className="px-4 py-2 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-xl transition-all font-bold">إنهاء المحادثة</button>
            </div>
            <div className="flex-1 overflow-hidden p-4 md:p-8">
              <VoiceTutor active={isVoiceActive} context={`أنت معلم برمجة بايثون لطلاب الصف التاسع. الدرس الحالي هو: ${currentLesson.title}.`} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
