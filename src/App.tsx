import { HashRouter, Routes, Route, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { createClient } from '@supabase/supabase-js';
import { 
  GraduationCap, LayoutDashboard, LogOut, Users, BookOpen, 
  Plus, Trash2, Check, Clock, Calendar, Euro, Shield, FileText, Send 
} from 'lucide-react';

const supabaseUrl = 'https://tockiucmhkoxvauytzfq.supabase.co';
const supabaseAnonKey = 'sb_publishable_W7SzJuYMbF9qN71OCH1nqw_YaWGI5WD';
const supabase = createClient(supabaseUrl, supabaseAnonKey);
const ADMIN_EMAIL = "dimaslearningbusiness@gmail.com";

// --- DASHBOARD PRINCIPAL ---
const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);
  const [view, setView] = useState<'overview' | 'students' | 'requests' | 'courses'>('overview');
  
  const [newCourse, setNewCourse] = useState({ title: '', desc: '', dates: '', price: '' });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return navigate("/auth");
      setUser(user);

      // Buscar Perfil Real
      const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      setProfile(prof);

      // Buscar Dados (Cursos, Alunos, etc)
      const { data: c } = await supabase.from('courses').select('*');
      setCourses(c || []);
      
      if (user.email === ADMIN_EMAIL) {
        const { data: s } = await supabase.from('profiles').select('*');
        setStudents(s || []);
        const { data: e } = await supabase.from('enrollments').select('*, courses(title), profiles(email)');
        setEnrollments(e || []);
      } else {
        const { data: m } = await supabase.from('student_materials').select('*').eq('student_id', user.id);
        setMaterials(m || []);
      }
      setLoading(false);
    };
    loadData();
  }, []);

  const isAdmin = user?.email === ADMIN_EMAIL;

  if (loading) return <div className="p-20 text-center font-bold">A ligar à base de dados real...</div>;

  // Se o aluno não tiver perfil ou estiver pendente
  if (!isAdmin && (!profile || profile.status === 'pending')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-10 text-center">
        <div className="max-w-md bg-white p-10 rounded-3xl shadow-xl">
          <Clock size={48} className="mx-auto text-amber-500 mb-4" />
          <h2 className="text-2xl font-bold">Conta em Verificação</h2>
          <p className="text-slate-500 mt-2">O Diretor Dimas recebeu o teu registo. Aguarda a ativação para acederes aos cursos.</p>
          <button onClick={() => supabase.auth.signOut().then(() => navigate("/"))} className="mt-6 text-blue-600 font-bold">Sair</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans">
      <aside className="w-64 bg-slate-900 p-6 text-slate-400 flex flex-col">
        <div className="text-white font-bold text-xl mb-10 flex items-center gap-2 italic"><Shield className="text-blue-500"/> DIMAS TECH</div>
        <nav className="space-y-2 flex-1">
          <button onClick={() => setView('overview')} className={`w-full text-left p-3 rounded-xl flex items-center gap-2 ${view === 'overview' ? 'bg-blue-600 text-white' : ''}`}><LayoutDashboard size={18}/> Overview</button>
          <button onClick={() => setView('courses')} className={`w-full text-left p-3 rounded-xl flex items-center gap-2 ${view === 'courses' ? 'bg-blue-600 text-white' : ''}`}><BookOpen size={18}/> Cursos</button>
          {isAdmin && (
            <>
              <button onClick={() => setView('students')} className={`w-full text-left p-3 rounded-xl flex items-center gap-2 ${view === 'students' ? 'bg-blue-600 text-white' : ''}`}><Users size={18}/> Alunos</button>
              <button onClick={() => setView('requests')} className={`w-full text-left p-3 rounded-xl flex items-center gap-2 ${view === 'requests' ? 'bg-blue-600 text-white' : ''}`}><Check size={18}/> Pedidos</button>
            </>
          )}
        </nav>
        <button onClick={() => supabase.auth.signOut().then(() => navigate("/"))} className="text-red-400 p-3 flex items-center gap-2 font-bold"><LogOut size={18}/> Sair</button>
      </aside>

      <main className="flex-1 p-10">
        {view === 'overview' && (
          <div>
            <h1 className="text-3xl font-bold mb-8">Bem-vindo, {user.email}</h1>
            {!isAdmin && profile && (
              <div className="bg-white p-8 rounded-3xl border shadow-sm max-w-2xl">
                <div className="flex justify-between mb-2 font-bold">
                  <span>Progresso do Curso</span>
                  <span className="text-blue-600">{profile.lessons_completed} / {profile.total_lessons} aulas</span>
                </div>
                <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full" style={{ width: `${(profile.lessons_completed/profile.total_lessons)*100}%` }}></div>
                </div>
                <h3 className="font-bold mt-8 mb-4">Os Meus Materiais</h3>
                {materials.length === 0 ? <p className="text-slate-400 text-sm italic">Nenhum material enviado ainda.</p> : (
                  materials.map(m => <a key={m.id} href={m.file_url} target="_blank" className="block p-3 bg-slate-50 rounded-lg mb-2 text-blue-600 underline">{m.file_label}</a>)
                )}
              </div>
            )}
            {isAdmin && <div className="p-10 border-2 border-dashed rounded-3xl text-slate-400 text-center">Painel de Controlo Ativo. Seleciona uma opção no menu lateral.</div>}
          </div>
        )}

        {view === 'courses' && (
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Catálogo de Cursos</h2>
              {isAdmin && (
                <div className="bg-white p-4 rounded-xl border flex gap-2">
                  <input placeholder="Título" className="border p-2 rounded" value={newCourse.title} onChange={e => setNewCourse({...newCourse, title: e.target.value})} />
                  <button onClick={async () => {
                    await supabase.from('courses').insert([{ title: newCourse.title }]);
                    window.location.reload();
                  }} className="bg-blue-600 text-white px-4 rounded">Criar</button>
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {courses.map(c => (
                <div key={c.id} className="bg-white p-6 rounded-2xl border shadow-sm">
                  <h3 className="font-bold text-lg">{c.title}</h3>
                  <p className="text-slate-400 text-sm mt-2">{c.description || 'Sem descrição.'}</p>
                  {!isAdmin && <button className="mt-4 w-full bg-slate-900 text-white py-2 rounded-lg">Solicitar Inscrição</button>}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

// ... (Páginas Index e Auth mantêm-se iguais) ...

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} /> {/* Direto para o Dashboard para testares */}
        <Route path="/auth" element={<AuthComponent />} /> 
      </Routes>
    </HashRouter>
  );
}

const AuthComponent = () => <div>Página de Login (Usa o código anterior para esta parte)</div>;
