
import React from 'react';
import { Lesson } from '../types';

interface SidebarProps {
  lessons: Lesson[];
  currentLessonId: string;
  onSelect: (lesson: Lesson) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ lessons, currentLessonId, onSelect }) => {
  return (
    <aside className="w-64 bg-gray-800 border-l border-gray-700 flex flex-col hidden md:flex">
      <div className="p-6">
        <h2 className="text-xl font-bold text-white mb-6">المنهج الدراسي</h2>
        <nav className="space-y-2">
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
      </div>
      
      <div className="mt-auto p-6">
        <div className="bg-blue-900/30 rounded-xl p-4 border border-blue-800/50">
          <h3 className="text-sm font-bold text-blue-300 mb-1">تقدمك الحالي</h3>
          <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-blue-500 h-full transition-all duration-500" 
              style={{ width: `${((lessons.findIndex(l => l.id === currentLessonId) + 1) / lessons.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
