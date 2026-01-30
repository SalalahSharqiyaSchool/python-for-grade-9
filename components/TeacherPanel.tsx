
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
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportCode, setExportCode] = useState('');

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

  const handleExport = () => {
    const code = btoa(unescape(encodeURIComponent(JSON.stringify(localLessons))));
    setExportCode(code);
    setShowExportModal(true);
  };

  const copyExportCode = () => {
    navigator.clipboard.writeText(exportCode);
    alert('تم نسخ كود المنهج! أرسله لطلابك الآن.');
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
            <h2 className="text-xl font-bold text-white">لوحة تحكم المعلم</h2>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleExport}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              تصدير المنهج
            </button>
            <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-full text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          {/* Lessons List */}
          <div className="w-full md:w-1/3 bg-gray-800/50 border-l border-gray-700 p-4 overflow-y-auto">
            <button 
              onClick={handleAdd}
              className="w-full mb-4 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2"
            >
              إضافة درس جديد
            </button>
            
            <div className="space-y-2">
              {localLessons.map((lesson, idx) => (
                <div 
                  key={lesson.id}
                  className={`p-3 rounded-xl border group transition-all cursor-pointer ${
                    editingLesson?.id === lesson.id ? 'bg-amber-500/10 border-amber-500' : 'bg-gray-800 border-gray-700'
                  }`}
                  onClick={() => handleEdit(lesson)}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-xs text-gray-500 font-bold">الدرس {idx + 1}</span>
                    <button onClick={(e) => { e.stopPropagation(); handleDelete(lesson.id); }} className="text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7" />
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
              <div className="space-y-6">
                <input 
                  type="text" 
                  value={editingLesson.title}
                  onChange={(e) => setEditingLesson({...editingLesson, title: e.target.value})}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                  placeholder="عنوان الدرس..."
                />
                <textarea 
                  rows={4}
                  value={editingLesson.content}
                  onChange={(e) => setEditingLesson({...editingLesson, content: e.target.value})}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                  placeholder="شرح الدرس..."
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <textarea rows={6} value={editingLesson.codeSnippet} onChange={(e) => setEditingLesson({...editingLesson, codeSnippet: e.target.value})} className="bg-gray-950 p-3 font-mono text-green-400 border border-gray-700 rounded-xl" placeholder="كود بايثون..." dir="ltr" />
                   <textarea rows={6} value={editingLesson.expectedOutput} onChange={(e) => setEditingLesson({...editingLesson, expectedOutput: e.target.value})} className="bg-gray-950 p-3 font-mono text-gray-300 border border-gray-700 rounded-xl" placeholder="النتيجة المتوقعة..." dir="ltr" />
                </div>
                <div className="flex gap-4">
                  <button onClick={handleSaveEdit} className="flex-1 py-3 bg-green-600 text-white rounded-xl font-bold">حفظ</button>
                  <button onClick={() => setEditingLesson(null)} className="px-6 py-3 bg-gray-700 text-white rounded-xl font-bold">إلغاء</button>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-600">اختر درساً للبدء</div>
            )}
          </div>
        </div>
      </div>

      {/* Export Modal Overlay */}
      {showExportModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setShowExportModal(false)}></div>
          <div className="relative bg-gray-800 p-8 rounded-3xl border border-blue-500/30 max-w-lg w-full shadow-2xl animate-in fade-in zoom-in duration-300">
            <h3 className="text-2xl font-bold text-white mb-4">كود مشاركة المنهج</h3>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              قم بنسخ هذا الكود وإرساله لطلابك. سيقوم الطلاب بلصق هذا الكود في تطبيقهم لتظهر لهم الدروس الجديدة التي أضفتها فوراً.
            </p>
            <div className="bg-gray-950 p-4 rounded-xl border border-gray-700 mb-6 relative">
              <p className="text-blue-400 font-mono text-[10px] break-all max-h-40 overflow-y-auto">
                {exportCode}
              </p>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={copyExportCode}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20"
              >
                نسخ الكود
              </button>
              <button 
                onClick={() => setShowExportModal(false)}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-bold transition-all"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherPanel;
