import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { courses as mockCourses, students as mockStudents, Course } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  GraduationCap, 
  BookOpen, 
  Users,
  DollarSign,
  Plus,
  Pencil,
  Trash2,
  LogOut,
  LayoutDashboard,
  Settings,
  FileText,
  Upload
} from 'lucide-react';
import { toast } from 'sonner';

type TabType = 'dashboard' | 'courses' | 'pricing' | 'students';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  
  // Form state for new/edit course
  const [formData, setFormData] = useState({
    title: '',
    titlePt: '',
    description: '',
    descriptionPt: '',
    level: 'A1' as Course['level'],
    category: 'english' as Course['category'],
    price: 0,
    duration: '',
    lessons: 0,
    instructor: '',
  });
  
  const handleLogout = () => {
    toast.success('Sessão terminada com sucesso');
    navigate('/');
  };
  
  
  const handleAddCourse = () => {
    const newCourse: Course = {
      id: `course-${Date.now()}`,
      ...formData,
      students: 0,
      rating: 0,
      image: '/placeholder.svg',
    };
    setCourses([...courses, newCourse]);
    setIsAddCourseOpen(false);
    resetForm();
    toast.success('Curso adicionado com sucesso!');
  };
  
  const handleEditCourse = () => {
    if (!editingCourse) return;
    setCourses(courses.map(c => 
      c.id === editingCourse.id ? { ...c, ...formData } : c
    ));
    setEditingCourse(null);
    resetForm();
    toast.success('Curso atualizado com sucesso!');
  };
  
  const handleDeleteCourse = (id: string) => {
    setCourses(courses.filter(c => c.id !== id));
    toast.success('Curso eliminado com sucesso!');
  };
  
  const handleUpdatePrice = (id: string, newPrice: number) => {
    setCourses(courses.map(c => 
      c.id === id ? { ...c, price: newPrice } : c
    ));
    toast.success('Preço atualizado com sucesso!');
  };
  
  const resetForm = () => {
    setFormData({
      title: '',
      titlePt: '',
      description: '',
      descriptionPt: '',
      level: 'A1',
      category: 'english',
      price: 0,
      duration: '',
      lessons: 0,
      instructor: '',
    });
  };
  // dentro de AdminDashboard
const { data: pendingEnrollments } = useQuery({
  queryKey: ['pending-enrollments'],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('enrollments')
      .select('id, status, course_id, student_id, courses(title), profiles(email)')
      .eq('status', 'pending')
    if (error) throw error
    return data
  },
})

const approveEnrollment = useMutation({
  mutationFn: async (id: string) => {
    const { error } = await supabase
      .from('enrollments')
      .update({ status: 'approved' })
      .eq('id', id)
    if (error) throw error
  },
  onSuccess: () => {
    qc.invalidateQueries({ queryKey: ['pending-enrollments'] })
  },
})

  
  const openEditDialog = (course: Course) => {
    setFormData({
      title: course.title,
      titlePt: course.titlePt,
      description: course.description,
      descriptionPt: course.descriptionPt,
      level: course.level,
      category: course.category,
      price: course.price,
      duration: course.duration,
      lessons: course.lessons,
      instructor: course.instructor,
    });
    setEditingCourse(course);
  };

  const stats = [
    { label: 'Total de Cursos', value: courses.length, icon: BookOpen, color: 'bg-accent/10 text-accent' },
    { label: 'Total de Alunos', value: mockStudents.length, icon: Users, color: 'bg-primary/10 text-primary' },
    { label: 'Receita Mensal', value: '€12,450', icon: DollarSign, color: 'bg-emerald-500/10 text-emerald-500' },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar border-r border-sidebar-border hidden lg:block">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sidebar-primary">
              <GraduationCap className="h-6 w-6 text-sidebar-primary-foreground" />
            </div>
            <span className="font-display text-lg font-bold text-sidebar-foreground">
              Admin
            </span>
          </Link>
          
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'dashboard' 
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50'
              }`}
            >
              <LayoutDashboard className="h-5 w-5" />
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('courses')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'courses' 
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50'
              }`}
            >
              <BookOpen className="h-5 w-5" />
              Cursos
            </button>
            <button
              onClick={() => setActiveTab('pricing')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'pricing' 
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50'
              }`}
            >
              <DollarSign className="h-5 w-5" />
              Preços
            </button>
            <button
              onClick={() => setActiveTab('students')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'students' 
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50'
              }`}
            >
              <Users className="h-5 w-5" />
              Alunos
            </button>
          </nav>
        </div>
        
        <div className="absolute bottom-0 left-0 w-64 p-6 border-t border-sidebar-border">
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-2 text-sidebar-foreground/70 hover:text-sidebar-foreground"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            Terminar Sessão
          </Button>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 z-50 bg-card border-b border-border p-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <GraduationCap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-display font-bold">Admin</span>
            </Link>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Mobile Navigation */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {(['dashboard', 'courses', 'pricing', 'students'] as TabType[]).map((tab) => (
              <Button
                key={tab}
                variant={activeTab === tab ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveTab(tab)}
                className="shrink-0"
              >
                {tab === 'dashboard' && 'Dashboard'}
                {tab === 'courses' && 'Cursos'}
                {tab === 'pricing' && 'Preços'}
                {tab === 'students' && 'Alunos'}
              </Button>
            ))}
          </div>
        </header>
        
        <div className="p-6 lg:p-8">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div>
                <h1 className="font-display text-2xl font-bold text-foreground mb-2">
                  Dashboard
                </h1>
                <p className="text-muted-foreground">
                  Visão geral da plataforma Dimas Learning
                </p>
              </div>
              
              <div className="grid sm:grid-cols-3 gap-4">
                {stats.map((stat) => (
                  <Card key={stat.label} className="border-border/50">
                    <CardContent className="p-5 flex items-center gap-4">
                      <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                        <stat.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {/* Recent Activity */}
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="font-display">Atividade Recente</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockStudents.slice(0, 5).map((student) => (
                      <div key={student.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center text-sm font-medium text-accent">
                            {student.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{student.name}</p>
                            <p className="text-xs text-muted-foreground">{student.email}</p>
                          </div>
                        </div>
                        <Badge variant="outline">{student.enrolledCourses.length} cursos</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          {/* Courses Tab */}
          {activeTab === 'courses' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-display text-2xl font-bold text-foreground mb-2">
                    Gestão de Cursos
                  </h1>
                  <p className="text-muted-foreground">
                    Adicione, edite ou remova cursos da plataforma
                  </p>
                </div>
                
                <Dialog open={isAddCourseOpen} onOpenChange={setIsAddCourseOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90">
                      <Plus className="h-4 w-4" />
                      Novo Curso
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Adicionar Novo Curso</DialogTitle>
                      <DialogDescription>
                        Preencha os detalhes do novo curso
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="title">Título (EN)</Label>
                          <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="titlePt">Título (PT)</Label>
                          <Input
                            id="titlePt"
                            value={formData.titlePt}
                            onChange={(e) => setFormData({ ...formData, titlePt: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="descriptionPt">Descrição (PT)</Label>
                        <Textarea
                          id="descriptionPt"
                          value={formData.descriptionPt}
                          onChange={(e) => setFormData({ ...formData, descriptionPt: e.target.value })}
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Nível</Label>
                          <Select
                            value={formData.level}
                            onValueChange={(v) => setFormData({ ...formData, level: v as Course['level'] })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((level) => (
                                <SelectItem key={level} value={level}>{level}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Categoria</Label>
                          <Select
                            value={formData.category}
                            onValueChange={(v) => setFormData({ ...formData, category: v as Course['category'] })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="english">Inglês</SelectItem>
                              <SelectItem value="portuguese">Português</SelectItem>
                              <SelectItem value="technology">Tecnologia</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="price">Preço (€)</Label>
                          <Input
                            id="price"
                            type="number"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="duration">Duração</Label>
                          <Input
                            id="duration"
                            placeholder="ex: 8 semanas"
                            value={formData.duration}
                            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lessons">Nº Aulas</Label>
                          <Input
                            id="lessons"
                            type="number"
                            value={formData.lessons}
                            onChange={(e) => setFormData({ ...formData, lessons: parseInt(e.target.value) })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="instructor">Instrutor</Label>
                          <Input
                            id="instructor"
                            value={formData.instructor}
                            onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                          />
                        </div>
                      </div>
                      
                      {/* File Upload Section */}
                      <div className="space-y-2">
                        <Label>Materiais do Curso</Label>
                        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                          <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground mb-2">
                            Arraste ficheiros PDF ou PPTX aqui
                          </p>
                          <Button variant="outline" size="sm">
                            Selecionar Ficheiros
                          </Button>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddCourseOpen(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={handleAddCourse} className="bg-accent text-accent-foreground hover:bg-accent/90">
                        Adicionar Curso
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              
              {/* Courses Table */}
              <Card className="border-border/50">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Curso</TableHead>
                        <TableHead>Nível</TableHead>
                        <TableHead>Categoria</TableHead>
                        <TableHead>Preço</TableHead>
                        <TableHead>Alunos</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {courses.map((course) => (
                        <TableRow key={course.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{course.titlePt}</p>
                              <p className="text-xs text-muted-foreground">{course.instructor}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={`badge-${course.level.toLowerCase()}`}>
                              {course.level}
                            </Badge>
                          </TableCell>
                          <TableCell className="capitalize">
                            {course.category === 'english' && 'Inglês'}
                            {course.category === 'portuguese' && 'Português'}
                            {course.category === 'technology' && 'Tecnologia'}
                          </TableCell>
                          <TableCell>€{course.price.toFixed(2)}</TableCell>
                          <TableCell>{course.students}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openEditDialog(course)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:text-destructive"
                                onClick={() => handleDeleteCourse(course.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              
              {/* Edit Course Dialog */}
              <Dialog open={!!editingCourse} onOpenChange={() => setEditingCourse(null)}>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Editar Curso</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Título (PT)</Label>
                        <Input
                          value={formData.titlePt}
                          onChange={(e) => setFormData({ ...formData, titlePt: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Preço (€)</Label>
                        <Input
                          type="number"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Descrição (PT)</Label>
                      <Textarea
                        value={formData.descriptionPt}
                        onChange={(e) => setFormData({ ...formData, descriptionPt: e.target.value })}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setEditingCourse(null)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleEditCourse} className="bg-accent text-accent-foreground hover:bg-accent/90">
                      Guardar Alterações
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          )}
          
          {/* Pricing Tab */}
          {activeTab === 'pricing' && (
            <div className="space-y-6">
              <div>
                <h1 className="font-display text-2xl font-bold text-foreground mb-2">
                  Gestão de Preços
                </h1>
                <p className="text-muted-foreground">
                  Atualize os preços dos cursos em tempo real
                </p>
              </div>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {courses.map((course) => (
                  <Card key={course.id} className="border-border/50">
                    <CardContent className="p-5">
                      <Badge variant="outline" className={`badge-${course.level.toLowerCase()} mb-3`}>
                        {course.level}
                      </Badge>
                      <h3 className="font-display font-semibold text-foreground mb-4">
                        {course.titlePt}
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Label htmlFor={`price-${course.id}`} className="shrink-0">
                            Preço (€):
                          </Label>
                          <Input
                            id={`price-${course.id}`}
                            type="number"
                            defaultValue={course.price}
                            className="w-24"
                            onBlur={(e) => handleUpdatePrice(course.id, parseFloat(e.target.value))}
                          />
                        </div>
                        {course.originalPrice && (
                          <p className="text-sm text-muted-foreground">
                            Preço original: €{course.originalPrice.toFixed(2)}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
          
          {/* Students Tab */}
          {activeTab === 'students' && (
            <div className="space-y-6">
              <div>
                <h1 className="font-display text-2xl font-bold text-foreground mb-2">
                  Lista de Alunos
                </h1>
                <p className="text-muted-foreground">
                  Visualize todos os alunos inscritos na plataforma
                </p>
              </div>
              
              <Card className="border-border/50">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Aluno</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Cursos Inscritos</TableHead>
                        <TableHead>Data de Inscrição</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockStudents.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center text-sm font-medium text-accent">
                                {student.name.charAt(0)}
                              </div>
                              <span className="font-medium">{student.name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {student.email}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {student.enrolledCourses.slice(0, 2).map((courseId) => {
                                const course = courses.find(c => c.id === courseId);
                                return course ? (
                                  <Badge key={courseId} variant="secondary" className="text-xs">
                                    {course.titlePt.substring(0, 20)}...
                                  </Badge>
                                ) : null;
                              })}
                              {student.enrolledCourses.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{student.enrolledCourses.length - 2}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {new Date(student.joinedAt).toLocaleDateString('pt-PT')}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
