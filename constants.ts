
import { Lesson } from './types';

export const LESSONS: Lesson[] = [
  {
    id: 'intro',
    title: 'مقدمة في بايثون',
    content: 'بايثون هي لغة برمجة قوية وسهلة التعلم. لنبدأ بأول أمر برمجي وهو طباعة نص على الشاشة.',
    codeSnippet: 'print("مرحباً بك في عالم البرمجة!")',
    expectedOutput: 'مرحباً بك في عالم البرمجة!'
  },
  {
    id: 'variables',
    title: 'المتغيرات والحساب',
    content: 'المتغيرات هي مخازن للمعلومات. يمكننا تخزين الأرقام أو النصوص بداخلها.',
    codeSnippet: 'name = "أحمد"\nage = 15\nprint(name + " عمره " + str(age))',
    expectedOutput: 'أحمد عمره 15'
  },
  {
    id: 'if-statements',
    title: 'الجمل الشرطية (If)',
    content: 'الشرط يسمح للبرنامج باتخاذ قرارات. مثل: هل الطالب ناجح أم لا؟',
    codeSnippet: 'grade = 85\nif grade >= 50:\n    print("ناجح")\nelse:\n    print("راسب")',
    expectedOutput: 'ناجح'
  },
  {
    id: 'loops',
    title: 'التكرار (Loops)',
    content: 'الحلقات التكرارية تساعدنا على تنفيذ نفس الكود عدة مرات بسهولة.',
    codeSnippet: 'for i in range(5):\n    print("رقم الخطوة:", i)',
    expectedOutput: 'رقم الخطوة: 0\nرقم الخطوة: 1\nرقم الخطوة: 2\nرقم الخطوة: 3\nرقم الخطوة: 4'
  }
];
