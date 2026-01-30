
import React, { useState } from 'react';
import { Lesson, UserRole } from '../types';

interface SidebarProps {
  lessons: Lesson[];
  currentLessonId: string;
  onSelect: (lesson: Lesson) => void;
  isOpen: boolean;
  onClose: () => void;
  onUpdateLessons?: (newLessons: Lesson[]) => void;
  role: UserRole;
  onTeacherLogin: () => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  lessons, 
  currentLessonId, 
  onSelect, 
  isOpen, 
  onClose, 
  onUpdateLessons,
  role,
  onTeacherLogin,
  onLogout
}) => {
  const [showImportModal, setShowImportModal] = useState(false);
  const [importCode, setImportCode] = useState('');

  const handleImport = () => {
    try {
      const decodedData = decodeURIComponent(escape(atob(importCode)));
      const newLessons = JSON.parse(decodedData) as Lesson[];
      if (Array.isArray(newLessons) && newLessons.length > 0) {
        onUpdateLessons?.(newLessons);
        setShowImportModal(false);
        setImportCode('');
        alert('تم تحديث المنهج بنجاح! ستظهر الدروس الجديدة الآن.');
      } else {
        throw new Error('Invalid format');
      }
    } catch (e) {
      alert('الكود المدخل غير صحيح. يرجى التأكد من الكود الذي أرسله المعلم.');
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm" onClick={onClose}></div>
      )}

      <aside className={`
        fixed inset-y-0 right-0 z-50 w-72 bg-gray-800 border-l border-gray-700 flex flex-col transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0 md:z-auto md:w-64
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="p-6 flex flex-col h-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">المنهج الدراسي</h2>
            <button onClick={onClose} className="md:hidden text-gray-400 hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <nav className="space-y-2 overflow-y-auto flex-1 pr-1">
            {lessons.map((lesson, index) => (
              <button
                key={lesson.id}
                onClick={() => onSelect(lesson)}
                className={`w-full text-right px-4 py-3 rounded-xl transition-all flex items-center gap-3 ${
                  currentLessonId === lesson.id
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                    : 'text-gray-400 hover:bg-gray-700 hover:text-gray-200'
                }`}
              >
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-900/50 flex items-center justify-center text-xs font-bold font-mono">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="truncate text-sm font-bold">{lesson.title}</span>
              </button>
            ))}
          </nav>

          <div className="mt-6 pt-6 border-t border-gray-700 space-y-4">
            <button 
              onClick={() => setShowImportModal(true)}
              className="w-full py-3 bg-gray-700 hover:bg-gray-600 text-blue-400 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 border border-gray-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              تحديث المنهج من المعلم
            </button>

            {role === 'student' ? (
              <button 
                onClick={onTeacherLogin}
                className="w-full py-2 text-[10px] text-gray-600 hover:text-gray-400 transition-colors uppercase tracking-widest font-bold"
              >
                دخول المعلم
              </button>
            ) : (
              <button 
                onClick={onLogout}
                className="w-full py-2 bg-red-500/10 text-red-400 text-xs font-bold rounded-xl hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
              >
                خروج (وضع الطالب)
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowImportModal(false)}></div>
          <div className="relative bg-gray-900 p-8 rounded-3xl border border-blue-500/30 max-w-lg w-full shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-4">تحديث الدروس</h3>
            <textarea 
              value={importCode}
              onChange={(e) => setImportCode(e.target.value)}
              className="w-full h-32 bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 text-blue-400 font-mono text-xs mb-6"
              placeholder="الصق الكود هنا..."
            />
            <div className="flex gap-4">
              <button onClick={handleImport} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold">تحديث الآن</button>
              <button onClick={() => setShowImportModal(false)} className="px-6 py-3 bg-gray-700 text-white rounded-xl font-bold">إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
