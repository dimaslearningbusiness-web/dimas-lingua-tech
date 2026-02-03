import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CourseCard } from '@/components/CourseCard';
import { courses } from '@/lib/mockData';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const categories = [
  { id: 'all', label: 'Todas as Categorias' },
  { id: 'english', label: 'Inglês' },
  { id: 'portuguese', label: 'Português' },
  { id: 'technology', label: 'Tecnologia' },
];

const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

const sortOptions = [
  { id: 'popular', label: 'Mais Populares' },
  { id: 'price-low', label: 'Preço: Menor para Maior' },
  { id: 'price-high', label: 'Preço: Maior para Menor' },
  { id: 'rating', label: 'Melhor Avaliação' },
];

export default function Courses() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [sortBy, setSortBy] = useState('popular');

  const filteredCourses = courses
    .filter((course) => {
      const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
      const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;
      const matchesSearch = 
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.titlePt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.descriptionPt.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesCategory && matchesLevel && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        default:
          return b.students - a.students;
      }
    });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-background">
        {/* Hero */}
        <section className="hero-gradient py-16 lg:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">
              Explore Nossos Cursos
            </h1>
            <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto mb-8">
              Descubra cursos de idiomas e tecnologia desenvolvidos para impulsionar a sua carreira
            </p>
            
            {/* Search Bar */}
            <div className="max-w-xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Pesquisar cursos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 bg-card text-foreground text-base"
              />
            </div>
          </div>
        </section>
        
        {/* Filters & Results */}
        <section className="py-8 lg:py-12">
          <div className="container mx-auto px-4">
            {/* Filter Bar */}
            <div className="flex flex-col lg:flex-row gap-4 mb-8 p-4 bg-card rounded-xl border border-border/50">
              <div className="flex flex-wrap gap-2 flex-1">
                {/* Category Filter */}
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {/* Level Filter */}
                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Nível" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Níveis</SelectItem>
                    {levels.map((level) => (
                      <SelectItem key={level} value={level}>
                        Nível {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {/* Level Quick Filters */}
                <div className="hidden md:flex gap-1 ml-2">
                  {levels.map((level) => (
                    <Button
                      key={level}
                      variant={selectedLevel === level ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setSelectedLevel(selectedLevel === level ? 'all' : level)}
                      className={selectedLevel === level ? 'bg-accent text-accent-foreground' : ''}
                    >
                      {level}
                    </Button>
                  ))}
                </div>
              </div>
              
              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[200px]">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Results Count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted-foreground">
                <span className="font-semibold text-foreground">{filteredCourses.length}</span> cursos encontrados
              </p>
              
              {(selectedCategory !== 'all' || selectedLevel !== 'all' || searchQuery) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedLevel('all');
                    setSearchQuery('');
                  }}
                  className="text-accent hover:text-accent"
                >
                  Limpar filtros
                </Button>
              )}
            </div>
            
            {/* Course Grid */}
            {filteredCourses.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredCourses.map((course, index) => (
                  <div 
                    key={course.id}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <CourseCard course={course} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                  Nenhum curso encontrado
                </h3>
                <p className="text-muted-foreground mb-4">
                  Tente ajustar os filtros ou pesquisar por outro termo
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedLevel('all');
                    setSearchQuery('');
                  }}
                >
                  Ver todos os cursos
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
