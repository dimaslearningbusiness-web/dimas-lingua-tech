import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GraduationCap, Mail, Lock, User, Eye, EyeOff, ArrowLeft, Shield } from 'lucide-react';
import { toast } from 'sonner';

export default function Login() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isRegister = searchParams.get('register') === 'true';
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'student' | 'admin'>('student');
  
  // Form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Mock login - simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (activeTab === 'admin') {
      if (loginEmail === 'admin@dimaslearning.com' && loginPassword === 'admin123') {
        toast.success('Bem-vindo, Administrador!');
        navigate('/admin');
      } else {
        toast.error('Credenciais de administrador inválidas');
      }
    } else {
      // Mock student login - any email/password works
      if (loginEmail && loginPassword) {
        toast.success('Login efetuado com sucesso!');
        navigate('/dashboard');
      } else {
        toast.error('Por favor, preencha todos os campos');
      }
    }
    
    setIsLoading(false);
  };
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Mock registration
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (registerName && registerEmail && registerPassword) {
      toast.success('Conta criada com sucesso! Faça login para continuar.');
      navigate('/login');
    } else {
      toast.error('Por favor, preencha todos os campos');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>
      
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8 group">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary group-hover:bg-primary/90 transition-colors">
            <GraduationCap className="h-7 w-7 text-primary-foreground" />
          </div>
          <span className="font-display text-2xl font-bold text-foreground">
            Dimas<span className="text-accent">Learning</span>
          </span>
        </Link>
        
        <Card className="shadow-large border-border/50">
          <CardHeader className="text-center pb-4">
            <CardTitle className="font-display text-2xl">
              {isRegister ? 'Criar Conta' : 'Bem-vindo de Volta'}
            </CardTitle>
            <CardDescription>
              {isRegister 
                ? 'Crie a sua conta para começar a aprender'
                : 'Entre na sua conta para continuar'
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {isRegister ? (
              // Registration Form
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="O seu nome"
                      className="pl-10"
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      className="pl-10"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Palavra-passe</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="pl-10 pr-10"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                  disabled={isLoading}
                >
                  {isLoading ? 'A criar conta...' : 'Criar Conta'}
                </Button>
                
                <p className="text-center text-sm text-muted-foreground">
                  Já tem uma conta?{' '}
                  <Link to="/login" className="text-accent hover:underline font-medium">
                    Entrar
                  </Link>
                </p>
              </form>
            ) : (
              // Login Form with Tabs
              <>
                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'student' | 'admin')} className="mb-6">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="student" className="gap-2">
                      <User className="h-4 w-4" />
                      Aluno
                    </TabsTrigger>
                    <TabsTrigger value="admin" className="gap-2">
                      <Shield className="h-4 w-4" />
                      Admin
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
                
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder={activeTab === 'admin' ? 'admin@dimaslearning.com' : 'seu@email.com'}
                        className="pl-10"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Palavra-passe</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        className="pl-10 pr-10"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  
                  {activeTab === 'admin' && (
                    <div className="p-3 rounded-lg bg-accent/10 border border-accent/20 text-sm text-muted-foreground">
                      <p className="font-medium text-foreground mb-1">Credenciais de Demo:</p>
                      <p>Email: admin@dimaslearning.com</p>
                      <p>Password: admin123</p>
                    </div>
                  )}
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                    disabled={isLoading}
                  >
                    {isLoading ? 'A entrar...' : 'Entrar'}
                  </Button>
                  
                  <p className="text-center text-sm text-muted-foreground">
                    Não tem uma conta?{' '}
                    <Link to="/login?register=true" className="text-accent hover:underline font-medium">
                      Registar
                    </Link>
                  </p>
                </form>
              </>
            )}
          </CardContent>
        </Card>
        
        {/* Back Link */}
        <Link 
          to="/" 
          className="flex items-center justify-center gap-2 mt-6 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar à página inicial
        </Link>
      </div>
    </div>
  );
}
