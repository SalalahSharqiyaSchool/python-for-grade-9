
import React from 'react';
import { Lesson } from '../types';

interface SidebarProps {
  lessons: Lesson[];
  currentLessonId: string;
  onSelect: (lesson: Lesson) => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ lessons, currentLessonId, onSelect, isOpen, onClose }) => {
  return (
    <>
      {/* Overlay for mobile when sidebar is open */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
          onClick={onClose}
        ></div>
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
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-400 hover:bg-gray-700 hover:text-gray-200'
                }`}
              >
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-900/50 flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </span>
                <span className="truncate">{lesson.title}</span>
              </button>
            ))}
          </nav>

          <div className="mt-6 pt-6 border-t border-gray-700">
            <div className="bg-blue-900/30 rounded-xl p-4 border border-blue-800/50">
              <h3 className="text-xs font-bold text-blue-300 mb-2 uppercase tracking-wider">تقدمك</h3>
              <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-500 h-full transition-all duration-500" 
                  style={{ width: `${((lessons.findIndex(l => l.id === currentLessonId) + 1) / lessons.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
