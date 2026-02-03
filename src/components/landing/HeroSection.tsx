import { Button } from '@/components/ui/button';
import { ArrowRight, Play, Globe, Code, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] hero-gradient overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/50 rounded-full blur-3xl" />
      </div>
      
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />
      
      <div className="container mx-auto px-4 py-20 lg:py-32 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left space-y-8 animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm">
              <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse-soft" />
              Plataforma Bilingue • Português & English
            </div>
            
            {/* Heading */}
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Aprenda{' '}
              <span className="text-gradient">Idiomas</span>
              {' '}&{' '}
              <span className="text-gradient">Tecnologia</span>
              {' '}do Futuro
            </h1>
            
            {/* Subheading */}
            <p className="text-lg md:text-xl text-white/70 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Desenvolva competências linguísticas e técnicas com cursos práticos, 
              ministrados por especialistas, ao seu próprio ritmo.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/courses">
                <Button size="lg" className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90 shadow-accent text-base font-semibold gap-2">
                  Explorar Cursos
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline" 
                className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 hover:text-white text-base font-medium gap-2"
              >
                <Play className="h-5 w-5" />
                Ver Demo
              </Button>
            </div>
            
            {/* Trust Badges */}
            <div className="pt-8 flex flex-wrap items-center gap-6 justify-center lg:justify-start text-white/60 text-sm">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div 
                      key={i} 
                      className="w-8 h-8 rounded-full bg-white/20 border-2 border-primary flex items-center justify-center text-xs font-medium text-white"
                    >
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <span>+5000 alunos</span>
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <svg key={i} className="w-4 h-4 fill-amber-400" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                  </svg>
                ))}
                <span className="ml-1">4.8/5 avaliação</span>
              </div>
            </div>
          </div>
          
          {/* Visual Element */}
          <div className="relative hidden lg:block">
            <div className="relative z-10 animate-float">
              {/* Main Card */}
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
                <div className="space-y-6">
                  {/* Feature Icons */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 rounded-2xl bg-white/5 border border-white/10">
                      <Globe className="h-8 w-8 text-accent mx-auto mb-2" />
                      <span className="text-xs text-white/70">Idiomas</span>
                    </div>
                    <div className="text-center p-4 rounded-2xl bg-white/5 border border-white/10">
                      <Code className="h-8 w-8 text-accent mx-auto mb-2" />
                      <span className="text-xs text-white/70">Tecnologia</span>
                    </div>
                    <div className="text-center p-4 rounded-2xl bg-white/5 border border-white/10">
                      <BookOpen className="h-8 w-8 text-accent mx-auto mb-2" />
                      <span className="text-xs text-white/70">Certificados</span>
                    </div>
                  </div>
                  
                  {/* Progress Example */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm text-white/80">
                      <span>Inglês para Negócios</span>
                      <span>75%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full w-3/4 bg-gradient-to-r from-accent to-lime-400 rounded-full" />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm text-white/80">
                      <span>React.js Masterclass</span>
                      <span>45%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full w-[45%] bg-gradient-to-r from-accent to-lime-400 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Badge */}
              <div className="absolute -top-6 -right-6 bg-accent text-accent-foreground px-4 py-2 rounded-xl font-semibold shadow-accent animate-pulse-glow">
                🎓 Certificado Incluído
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" className="w-full h-auto">
          <path 
            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" 
            className="fill-background"
          />
        </svg>
      </div>
    </section>
  );
}
