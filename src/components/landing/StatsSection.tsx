import { Users, BookOpen, Award, Globe } from 'lucide-react';

const stats = [
  {
    icon: Users,
    value: '5,000+',
    label: 'Alunos Ativos',
    description: 'Comunidade global de estudantes',
  },
  {
    icon: BookOpen,
    value: '50+',
    label: 'Cursos Disponíveis',
    description: 'Idiomas e tecnologia',
  },
  {
    icon: Award,
    value: '98%',
    label: 'Taxa de Conclusão',
    description: 'Satisfação garantida',
  },
  {
    icon: Globe,
    value: '25+',
    label: 'Países',
    description: 'Alcance internacional',
  },
];

export function StatsSection() {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, index) => (
            <div 
              key={stat.label}
              className="text-center p-6 rounded-2xl bg-card border border-border/50 shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent/10 text-accent mb-4">
                <stat.icon className="h-7 w-7" />
              </div>
              <div className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-1">
                {stat.value}
              </div>
              <div className="font-medium text-foreground mb-1">{stat.label}</div>
              <div className="text-sm text-muted-foreground">{stat.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
