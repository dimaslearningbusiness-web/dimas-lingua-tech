import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { courses, students as mockStudents } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  GraduationCap, 
  BookOpen, 
  Clock, 
  Trophy,
  Play,
  LogOut,
  User,
  ChevronRight,
  Star
} from 'lucide-react';
import { toast } from 'sonner';

// Mock current student
const currentStudent = mockStudents[0];

export default function StudentDashboard() {
  const navigate = useNavigate();
  
  const enrolledCourses = courses.filter(c => 
    currentStudent.enrolledCourses.includes(c.id)
  );
  
  const handleLogout = () => {
    toast.success('Sessão terminada com sucesso');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-card/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                <GraduationCap className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="font-display text-xl font-bold text-foreground">
                Dimas<span className="text-accent">Learning</span>
              </span>
            </Link>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center">
                  <User className="h-4 w-4 text-accent" />
                </div>
                <span className="text-sm font-medium hidden sm:inline">{currentStudent.name}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sair</span>
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Olá, {currentStudent.name.split(' ')[0]}! 👋
          </h1>
          <p className="text-muted-foreground">
            Continue a sua jornada de aprendizagem. Está a ir muito bem!
          </p>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border-border/50">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{enrolledCourses.length}</p>
                <p className="text-sm text-muted-foreground">Cursos Ativos</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-border/50">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">12h</p>
                <p className="text-sm text-muted-foreground">Tempo de Estudo</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-border/50">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Trophy className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">3</p>
                <p className="text-sm text-muted-foreground">Certificados</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-border/50">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <Star className="h-6 w-6 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">850</p>
                <p className="text-sm text-muted-foreground">Pontos XP</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Continue Learning */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-bold text-foreground">
              Continuar a Aprender
            </h2>
            <Link to="/courses">
              <Button variant="ghost" size="sm" className="gap-1 text-accent">
                Ver todos
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {enrolledCourses.map((course) => {
              const progress = currentStudent.progress[course.id] || 0;
              return (
                <Card key={course.id} className="group border-border/50 hover:shadow-medium transition-all duration-300">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <Badge variant="outline" className={`badge-${course.level.toLowerCase()}`}>
                        {course.level}
                      </Badge>
                      <span className="text-sm font-medium text-accent">{progress}%</span>
                    </div>
                    
                    <h3 className="font-display font-semibold text-foreground mb-2 line-clamp-2">
                      {course.titlePt}
                    </h3>
                    
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {course.descriptionPt}
                    </p>
                    
                    <Progress value={progress} className="h-2 mb-4" />
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {Math.round(course.lessons * progress / 100)} de {course.lessons} aulas
                      </span>
                      <Button size="sm" className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90">
                        <Play className="h-3 w-3" />
                        Continuar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
        
        {/* Recommended Courses */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-bold text-foreground">
              Cursos Recomendados
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses
              .filter(c => !currentStudent.enrolledCourses.includes(c.id))
              .slice(0, 3)
              .map((course) => (
                <Card key={course.id} className="border-border/50 hover:shadow-medium transition-all duration-300">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <Badge variant="outline" className={`badge-${course.level.toLowerCase()}`}>
                        {course.level}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        <span className="text-sm font-medium">{course.rating}</span>
                      </div>
                    </div>
                    
                    <h3 className="font-display font-semibold text-foreground mb-2 line-clamp-2">
                      {course.titlePt}
                    </h3>
                    
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {course.descriptionPt}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-foreground">€{course.price}</span>
                      <Button variant="outline" size="sm">
                        Ver Detalhes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </section>
      </main>
    </div>
  );
}
