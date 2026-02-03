import { Link } from 'react-router-dom';
import { GraduationCap, Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Youtube } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent">
                <GraduationCap className="h-6 w-6 text-accent-foreground" />
              </div>
              <span className="font-display text-xl font-bold">
                Dimas<span className="text-accent">Learning</span>
              </span>
            </Link>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              Plataforma de ensino bilingue focada em capacitar estudantes com competências linguísticas e tecnológicas para o futuro.
            </p>
            <div className="flex gap-3">
              <a href="#" className="p-2 rounded-lg bg-primary-foreground/10 hover:bg-accent hover:text-accent-foreground transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-primary-foreground/10 hover:bg-accent hover:text-accent-foreground transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-primary-foreground/10 hover:bg-accent hover:text-accent-foreground transition-colors">
                <Linkedin className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-primary-foreground/10 hover:bg-accent hover:text-accent-foreground transition-colors">
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold mb-4">Links Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/courses" className="text-sm text-primary-foreground/70 hover:text-accent transition-colors">
                  Todos os Cursos
                </Link>
              </li>
              <li>
                <a href="#about" className="text-sm text-primary-foreground/70 hover:text-accent transition-colors">
                  Sobre Nós
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-primary-foreground/70 hover:text-accent transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <Link to="/login" className="text-sm text-primary-foreground/70 hover:text-accent transition-colors">
                  Área do Aluno
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-display font-semibold mb-4">Categorias</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/courses?category=english" className="text-sm text-primary-foreground/70 hover:text-accent transition-colors">
                  Inglês
                </Link>
              </li>
              <li>
                <Link to="/courses?category=portuguese" className="text-sm text-primary-foreground/70 hover:text-accent transition-colors">
                  Português
                </Link>
              </li>
              <li>
                <Link to="/courses?category=technology" className="text-sm text-primary-foreground/70 hover:text-accent transition-colors">
                  Tecnologia
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold mb-4">Contacto</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-primary-foreground/70">
                <Mail className="h-4 w-4 text-accent" />
                info@dimaslearning.com
              </li>
              <li className="flex items-center gap-2 text-sm text-primary-foreground/70">
                <Phone className="h-4 w-4 text-accent" />
                +351 123 456 789
              </li>
              <li className="flex items-start gap-2 text-sm text-primary-foreground/70">
                <MapPin className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                Lisboa, Portugal
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-primary-foreground/50">
              © {new Date().getFullYear()} Dimas Learning. Todos os direitos reservados.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-sm text-primary-foreground/50 hover:text-accent transition-colors">
                Termos de Serviço
              </a>
              <a href="#" className="text-sm text-primary-foreground/50 hover:text-accent transition-colors">
                Política de Privacidade
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
