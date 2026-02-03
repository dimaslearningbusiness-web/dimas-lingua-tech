// Mock Data for Dimas Learning Platform

export interface Course {
  id: string;
  title: string;
  titlePt: string;
  description: string;
  descriptionPt: string;
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  category: 'english' | 'portuguese' | 'technology';
  price: number;
  originalPrice?: number;
  duration: string;
  lessons: number;
  students: number;
  rating: number;
  image: string;
  instructor: string;
  featured?: boolean;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  enrolledCourses: string[];
  progress: Record<string, number>;
  joinedAt: string;
  avatar?: string;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description: string;
  videoUrl?: string;
  files: { name: string; type: 'pdf' | 'pptx'; url: string }[];
  duration: string;
  order: number;
}

export const courses: Course[] = [
  {
    id: 'eng-beginners',
    title: 'English for Beginners',
    titlePt: 'Inglês para Iniciantes',
    description: 'Start your English journey with fundamental vocabulary, grammar, and pronunciation.',
    descriptionPt: 'Comece a sua jornada no inglês com vocabulário fundamental, gramática e pronúncia.',
    level: 'A1',
    category: 'english',
    price: 49.99,
    originalPrice: 79.99,
    duration: '8 weeks',
    lessons: 24,
    students: 1250,
    rating: 4.8,
    image: '/placeholder.svg',
    instructor: 'Prof. Sarah Mitchell',
    featured: true,
  },
  {
    id: 'eng-intermediate',
    title: 'Intermediate English',
    titlePt: 'Inglês Intermediário',
    description: 'Enhance your fluency with complex grammar and conversation skills.',
    descriptionPt: 'Melhore a sua fluência com gramática complexa e competências de conversação.',
    level: 'B1',
    category: 'english',
    price: 69.99,
    duration: '10 weeks',
    lessons: 30,
    students: 890,
    rating: 4.7,
    image: '/placeholder.svg',
    instructor: 'Prof. James Wilson',
  },
  {
    id: 'eng-business',
    title: 'Business English',
    titlePt: 'Inglês para Negócios',
    description: 'Master professional English for the corporate world.',
    descriptionPt: 'Domine o inglês profissional para o mundo empresarial.',
    level: 'B2',
    category: 'english',
    price: 99.99,
    originalPrice: 149.99,
    duration: '12 weeks',
    lessons: 36,
    students: 650,
    rating: 4.9,
    image: '/placeholder.svg',
    instructor: 'Prof. Emily Chen',
    featured: true,
  },
  {
    id: 'pt-beginners',
    title: 'Portuguese for Beginners',
    titlePt: 'Português para Iniciantes',
    description: 'Learn European Portuguese from scratch with native speakers.',
    descriptionPt: 'Aprenda Português Europeu do zero com falantes nativos.',
    level: 'A1',
    category: 'portuguese',
    price: 49.99,
    duration: '8 weeks',
    lessons: 24,
    students: 780,
    rating: 4.6,
    image: '/placeholder.svg',
    instructor: 'Prof. Ana Santos',
  },
  {
    id: 'pt-advanced',
    title: 'Advanced Portuguese',
    titlePt: 'Português Avançado',
    description: 'Perfect your Portuguese with advanced grammar and cultural nuances.',
    descriptionPt: 'Aperfeiçoe o seu Português com gramática avançada e nuances culturais.',
    level: 'C1',
    category: 'portuguese',
    price: 89.99,
    duration: '14 weeks',
    lessons: 42,
    students: 320,
    rating: 4.8,
    image: '/placeholder.svg',
    instructor: 'Prof. Miguel Costa',
  },
  {
    id: 'tech-webdev',
    title: 'Web Development Fundamentals',
    titlePt: 'Fundamentos de Desenvolvimento Web',
    description: 'Learn HTML, CSS, and JavaScript to build modern websites.',
    descriptionPt: 'Aprenda HTML, CSS e JavaScript para criar websites modernos.',
    level: 'A2',
    category: 'technology',
    price: 79.99,
    originalPrice: 119.99,
    duration: '10 weeks',
    lessons: 40,
    students: 2100,
    rating: 4.9,
    image: '/placeholder.svg',
    instructor: 'Eng. David Park',
    featured: true,
  },
  {
    id: 'tech-react',
    title: 'React.js Masterclass',
    titlePt: 'Masterclass de React.js',
    description: 'Build modern web applications with React and its ecosystem.',
    descriptionPt: 'Construa aplicações web modernas com React e o seu ecossistema.',
    level: 'B2',
    category: 'technology',
    price: 129.99,
    duration: '12 weeks',
    lessons: 48,
    students: 1450,
    rating: 4.8,
    image: '/placeholder.svg',
    instructor: 'Eng. Lisa Wong',
  },
  {
    id: 'tech-python',
    title: 'Python for Data Science',
    titlePt: 'Python para Ciência de Dados',
    description: 'Master Python and data analysis for real-world applications.',
    descriptionPt: 'Domine Python e análise de dados para aplicações reais.',
    level: 'B1',
    category: 'technology',
    price: 99.99,
    duration: '14 weeks',
    lessons: 56,
    students: 1890,
    rating: 4.7,
    image: '/placeholder.svg',
    instructor: 'Dr. Maria Garcia',
  },
];

export const students: Student[] = [
  {
    id: 'std-1',
    name: 'João Silva',
    email: 'joao.silva@email.com',
    enrolledCourses: ['eng-beginners', 'tech-webdev'],
    progress: { 'eng-beginners': 75, 'tech-webdev': 40 },
    joinedAt: '2024-01-15',
  },
  {
    id: 'std-2',
    name: 'Maria Costa',
    email: 'maria.costa@email.com',
    enrolledCourses: ['eng-business', 'tech-react'],
    progress: { 'eng-business': 50, 'tech-react': 25 },
    joinedAt: '2024-02-20',
  },
  {
    id: 'std-3',
    name: 'Pedro Santos',
    email: 'pedro.santos@email.com',
    enrolledCourses: ['pt-beginners'],
    progress: { 'pt-beginners': 90 },
    joinedAt: '2024-03-10',
  },
  {
    id: 'std-4',
    name: 'Ana Rodrigues',
    email: 'ana.rodrigues@email.com',
    enrolledCourses: ['eng-intermediate', 'tech-python'],
    progress: { 'eng-intermediate': 60, 'tech-python': 35 },
    joinedAt: '2024-01-28',
  },
  {
    id: 'std-5',
    name: 'Carlos Ferreira',
    email: 'carlos.ferreira@email.com',
    enrolledCourses: ['tech-webdev', 'tech-react', 'eng-beginners'],
    progress: { 'tech-webdev': 100, 'tech-react': 80, 'eng-beginners': 45 },
    joinedAt: '2023-11-05',
  },
];

export const lessons: Lesson[] = [
  {
    id: 'les-1',
    courseId: 'eng-beginners',
    title: 'Introduction to English',
    description: 'Welcome to the course! Learn basic greetings and introductions.',
    videoUrl: 'https://example.com/video1',
    files: [
      { name: 'Lesson 1 Slides', type: 'pptx', url: '/files/lesson1.pptx' },
      { name: 'Vocabulary List', type: 'pdf', url: '/files/vocab1.pdf' },
    ],
    duration: '25 min',
    order: 1,
  },
  {
    id: 'les-2',
    courseId: 'eng-beginners',
    title: 'Numbers and Colors',
    description: 'Learn to count and describe colors in English.',
    videoUrl: 'https://example.com/video2',
    files: [
      { name: 'Numbers Practice', type: 'pdf', url: '/files/numbers.pdf' },
    ],
    duration: '30 min',
    order: 2,
  },
];

// Mock API functions
export const mockApi = {
  getCourses: () => Promise.resolve(courses),
  getCourseById: (id: string) => Promise.resolve(courses.find(c => c.id === id)),
  getStudents: () => Promise.resolve(students),
  getStudentById: (id: string) => Promise.resolve(students.find(s => s.id === id)),
  getLessonsByCourse: (courseId: string) => Promise.resolve(lessons.filter(l => l.courseId === courseId)),
  updateCoursePrice: (id: string, price: number) => {
    const course = courses.find(c => c.id === id);
    if (course) course.price = price;
    return Promise.resolve(course);
  },
};
