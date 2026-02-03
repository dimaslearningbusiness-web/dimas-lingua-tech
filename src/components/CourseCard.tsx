import { Course } from '@/lib/mockData';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Users, Star, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroImage from '@/assets/hero-learning.jpg';

interface CourseCardProps {
  course: Course;
}

const levelBadgeClass: Record<string, string> = {
  A1: 'badge-a1',
  A2: 'badge-a2',
  B1: 'badge-b1',
  B2: 'badge-b2',
  C1: 'badge-c1',
  C2: 'badge-c2',
};

const categoryLabels: Record<string, string> = {
  english: 'Inglês',
  portuguese: 'Português',
  technology: 'Tecnologia',
};

const categoryColors: Record<string, string> = {
  english: 'bg-blue-500/10 text-blue-600 border-blue-200',
  portuguese: 'bg-emerald-500/10 text-emerald-600 border-emerald-200',
  technology: 'bg-accent/10 text-accent border-accent/20',
};

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Card className="group relative overflow-hidden border-border/50 bg-card hover:shadow-large transition-all duration-300 hover:-translate-y-1">
      {/* Featured Badge */}
      {course.featured && (
        <div className="absolute top-3 left-3 z-10">
          <Badge className="bg-accent text-accent-foreground font-medium shadow-accent">
            Destaque
          </Badge>
        </div>
      )}
      
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={heroImage} 
          alt={course.titlePt}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
        
        {/* Level Badge */}
        <div className="absolute bottom-3 left-3">
          <Badge variant="outline" className={`${levelBadgeClass[course.level]} font-semibold`}>
            Nível {course.level}
          </Badge>
        </div>
        
        {/* Category */}
        <div className="absolute bottom-3 right-3">
          <Badge variant="outline" className={categoryColors[course.category]}>
            {categoryLabels[course.category]}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-5">
        {/* Title */}
        <h3 className="font-display font-semibold text-lg text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          {course.titlePt}
        </h3>
        
        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {course.descriptionPt}
        </p>
        
        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="h-3.5 w-3.5" />
            <span>{course.lessons} aulas</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            <span>{course.students}</span>
          </div>
        </div>
        
        {/* Instructor */}
        <p className="text-xs text-muted-foreground mt-3">
          por <span className="font-medium text-foreground">{course.instructor}</span>
        </p>
      </CardContent>
      
      <CardFooter className="p-5 pt-0 flex items-center justify-between">
        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-bold text-foreground">€{course.price.toFixed(2)}</span>
          {course.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              €{course.originalPrice.toFixed(2)}
            </span>
          )}
        </div>
        
        {/* Rating */}
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
          <span className="text-sm font-medium">{course.rating}</span>
        </div>
      </CardFooter>
      
      {/* Hover Overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-foreground/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
        <Link to={`/courses/${course.id}`}>
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-accent">
            Ver Curso
          </Button>
        </Link>
      </div>
    </Card>
  );
}
