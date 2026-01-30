
import React from 'react';
import { Lesson } from '../types';

interface LessonContentProps {
  lesson: Lesson;
}

const LessonContent: React.FC<LessonContentProps> = ({ lesson }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold text-white">{lesson.title}</h2>
      <p className="text-gray-300 leading-relaxed text-lg">
        {lesson.content}
      </p>
      
      <div className="bg-blue-900/20 border-r-4 border-blue-500 p-4 rounded-l-lg mt-6">
        <h4 className="text-blue-400 font-bold mb-2">💡 تلميح:</h4>
        <p className="text-sm text-blue-200">
          هل تعلم أن لغة بايثون سُميت بهذا الاسم تيمناً بفرقة "مونتي بايثون" الكوميدية وليس الأفعى؟
        </p>
      </div>
    </div>
  );
};

export default LessonContent;
