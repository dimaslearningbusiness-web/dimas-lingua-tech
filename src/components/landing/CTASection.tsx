import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export function CTASection() {
  return (
    <section id="contact" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl hero-gradient p-8 md:p-12 lg:p-16">
          {/* Background Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/10 rounded-full blur-3xl" />
          
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm mb-6">
              <Sparkles className="h-4 w-4 text-accent" />
              Comece a sua jornada hoje
            </div>
            
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Pronto para Transformar o Seu Futuro?
            </h2>
            
            <p className="text-lg md:text-xl text-white/70 mb-8 max-w-2xl mx-auto">
              Junte-se a milhares de alunos que já estão a construir o seu futuro 
              com competências bilingues e tecnológicas.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login?register=true">
                <Button size="lg" className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90 shadow-accent text-base font-semibold gap-2">
                  Criar Conta Grátis
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/courses">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 hover:text-white text-base font-medium"
                >
                  Ver Cursos
                </Button>
              </Link>
            </div>
            
            {/* Trust Element */}
            <p className="mt-8 text-sm text-white/50">
              ✓ Sem cartão de crédito • ✓ Acesso imediato • ✓ Cancele a qualquer momento
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
