import { Target, Award, Users, Zap } from 'lucide-react';

const features = [
  {
    icon: Target,
    title: 'Aprendizagem Focada',
    description: 'Currículos estruturados com objetivos claros para maximizar o seu progresso.',
  },
  {
    icon: Award,
    title: 'Certificados Reconhecidos',
    description: 'Certificados digitais verificáveis que valorizam o seu currículo.',
  },
  {
    icon: Users,
    title: 'Instrutores Especializados',
    description: 'Aprenda com profissionais experientes e apaixonados pelo ensino.',
  },
  {
    icon: Zap,
    title: 'Aprendizagem Flexível',
    description: 'Estude ao seu próprio ritmo, em qualquer lugar, a qualquer momento.',
  },
];

export function AboutSection() {
  return (
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div>
              <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
                Sobre Nós
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                Transformando a Educação{' '}
                <span className="text-accent">Bilingue</span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                A Dimas Learning nasceu da paixão por democratizar o acesso à educação de qualidade. 
                Combinamos o ensino de idiomas com competências tecnológicas, preparando os nossos 
                alunos para os desafios do mundo globalizado.
              </p>
            </div>

            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                A nossa missão é capacitar estudantes de todas as idades com ferramentas 
                linguísticas e tecnológicas que abram portas para novas oportunidades. 
                Acreditamos que a educação deve ser acessível, envolvente e transformadora.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Com uma equipa de instrutores dedicados e uma metodologia comprovada, 
                garantimos que cada aluno atinja o seu potencial máximo.
              </p>
            </div>

            {/* Mission Stats */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                <div className="font-display text-2xl font-bold text-primary mb-1">5+</div>
                <div className="text-sm text-muted-foreground">Anos de Experiência</div>
              </div>
              <div className="p-4 rounded-xl bg-accent/5 border border-accent/10">
                <div className="font-display text-2xl font-bold text-accent mb-1">100%</div>
                <div className="text-sm text-muted-foreground">Compromisso</div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <div 
                key={feature.title}
                className="p-6 rounded-2xl bg-card border border-border/50 shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent/10 text-accent mb-4">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="font-display font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
