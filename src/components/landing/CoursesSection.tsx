import { useState } from 'react';
import { courses } from '@/lib/mockData';
import { CourseCard } from '@/components/CourseCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

const categories = [
  { id: 'all', label: 'Todos' },
  { id: 'english', label: 'Inglês' },
  { id: 'portuguese', label: 'Português' },
  { id: 'technology', label: 'Tecnologia' },
];

const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export function CoursesSection() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCourses = courses.filter((course) => {
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    const matchesLevel = !selectedLevel || course.level === selectedLevel;
    const matchesSearch = 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.titlePt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.descriptionPt.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesLevel && matchesSearch;
  });

  const featuredCourses = filteredCourses.slice(0, 6);

  return (
    <section id="courses" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            Nossos Cursos
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Explore Nossa Coleção de Cursos
          </h2>
          <p className="text-muted-foreground text-lg">
            Cursos práticos desenvolvidos por especialistas para ajudá-lo a dominar 
            novas competências ao seu próprio ritmo.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar cursos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={
                  selectedCategory === category.id
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-primary/10'
                }
              >
                {category.label}
              </Button>
            ))}
          </div>

          {/* Level Filters */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-muted-foreground"
            >
              <Filter className="h-4 w-4" />
              Nível:
            </Button>
            {levels.map((level) => (
              <Button
                key={level}
                variant={selectedLevel === level ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSelectedLevel(selectedLevel === level ? null : level)}
                className={
                  selectedLevel === level
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }
              >
                {level}
              </Button>
            ))}
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCourses.map((course, index) => (
            <div 
              key={course.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CourseCard course={course} />
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              Nenhum curso encontrado. Tente ajustar os filtros.
            </p>
          </div>
        )}

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link to="/courses">
            <Button size="lg" variant="outline" className="gap-2">
              Ver Todos os Cursos
              <span className="px-2 py-0.5 rounded-full bg-accent/10 text-accent text-sm">
                {courses.length}
              </span>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
