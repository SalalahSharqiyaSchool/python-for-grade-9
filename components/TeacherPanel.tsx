
import React, { useState } from 'react';
import { Lesson } from '../types';

interface TeacherPanelProps {
  lessons: Lesson[];
  onSave: (lessons: Lesson[]) => void;
  onClose: () => void;
}

const TeacherPanel: React.FC<TeacherPanelProps> = ({ lessons, onSave, onClose }) => {
  const [editingLesson, setEditingLesson] = useState<Partial<Lesson> | null>(null);
  const [localLessons, setLocalLessons] = useState<Lesson[]>(lessons);

  const handleAdd = () => {
    setEditingLesson({
      id: Math.random().toString(36).substr(2, 9),
      title: '',
      content: '',
      codeSnippet: '',
      expectedOutput: ''
    });
  };

  const handleEdit = (lesson: Lesson) => {
    setEditingLesson(lesson);
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الدرس؟')) {
      const updated = localLessons.filter(l => l.id !== id);
      setLocalLessons(updated);
      onSave(updated);
    }
  };

  const handleSaveEdit = () => {
    if (!editingLesson?.title || !editingLesson?.content) {
      alert('يرجى إكمال العنوان والمحتوى على الأقل');
      return;
    }

    let updated: Lesson[];
    const exists = localLessons.find(l => l.id === editingLesson.id);

    if (exists) {
      updated = localLessons.map(l => l.id === editingLesson.id ? (editingLesson as Lesson) : l);
    } else {
      updated = [...localLessons, editingLesson as Lesson];
    }

    setLocalLessons(updated);
    onSave(updated);
    setEditingLesson(null);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose}></div>
      
      <div className="relative w-full max-w-4xl h-[85vh] bg-gray-900 rounded-3xl shadow-2xl border border-amber-500/30 overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="p-6 bg-gray-800 border-b border-gray-700 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 rounded-lg text-amber-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white">لوحة تحكم المعلم - إدارة المنهج</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-full text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          {/* Lessons List */}
          <div className="w-full md:w-1/3 bg-gray-800/50 border-l border-gray-700 p-4 overflow-y-auto">
            <button 
              onClick={handleAdd}
              className="w-full mb-4 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              إضافة درس جديد
            </button>
            
            <div className="space-y-2">
              {localLessons.map((lesson, idx) => (
                <div 
                  key={lesson.id}
                  className={`p-3 rounded-xl border group transition-all cursor-pointer ${
                    editingLesson?.id === lesson.id ? 'bg-amber-500/10 border-amber-500' : 'bg-gray-800 border-gray-700 hover:border-gray-500'
                  }`}
                  onClick={() => handleEdit(lesson)}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-xs text-gray-500 font-bold">الدرس {idx + 1}</span>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDelete(lesson.id); }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:bg-red-400/10 rounded transition-all"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  <h4 className="text-sm font-bold text-gray-200 mt-1 truncate">{lesson.title}</h4>
                </div>
              ))}
            </div>
          </div>

          {/* Edit Form */}
          <div className="flex-1 p-6 overflow-y-auto">
            {editingLesson ? (
              <div className="space-y-6 animate-in slide-in-from-left duration-200">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">عنوان الدرس</label>
                    <input 
                      type="text" 
                      value={editingLesson.title}
                      onChange={(e) => setEditingLesson({...editingLesson, title: e.target.value})}
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                      placeholder="مثال: مقدمة في المتغيرات"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">شرح الدرس (نصي)</label>
                    <textarea 
                      rows={4}
                      value={editingLesson.content}
                      onChange={(e) => setEditingLesson({...editingLesson, content: e.target.value})}
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-amber-500 outline-none transition-all resize-none"
                      placeholder="اشرح المفهوم البرمجي للطالب بأسلوب سهل..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">الكود البرمجي (بايثون)</label>
                      <textarea 
                        rows={6}
                        value={editingLesson.codeSnippet}
                        onChange={(e) => setEditingLesson({...editingLesson, codeSnippet: e.target.value})}
                        className="w-full bg-gray-950 font-mono text-green-400 border border-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500 outline-none transition-all resize-none"
                        dir="ltr"
                        placeholder="print('Hello World')"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">النتيجة المتوقعة</label>
                      <textarea 
                        rows={6}
                        value={editingLesson.expectedOutput}
                        onChange={(e) => setEditingLesson({...editingLesson, expectedOutput: e.target.value})}
                        className="w-full bg-gray-950 font-mono text-gray-300 border border-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500 outline-none transition-all resize-none"
                        dir="ltr"
                        placeholder="Hello World"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    onClick={handleSaveEdit}
                    className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold shadow-lg transition-all"
                  >
                    حفظ التغييرات
                  </button>
                  <button 
                    onClick={() => setEditingLesson(null)}
                    className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-bold transition-all"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 opacity-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5s3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <p className="text-lg font-medium">اختر درساً لتعديله أو اضغط على "إضافة درس جديد"</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherPanel;
