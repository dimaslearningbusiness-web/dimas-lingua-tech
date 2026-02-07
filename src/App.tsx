import { HashRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { createClient } from '@supabase/supabase-js';
import { 
  GraduationCap, LayoutDashboard, LogOut, Users, BookOpen, 
  Plus, Trash2, Check, X, Clock, Calendar, Euro
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
  const [view, setView] = useState<'courses' | 'students' | 'requests'>('courses');
  
  // States para novo curso
  const [newCourse, setNewCourse] = useState({ title: '', desc: '', dates: '', price: '' });
  
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) navigate("/auth");
      else {
        setUser(data.user);
        fetchProfile(data.user.id);
      }
    });
    fetchData();
  }, [navigate]);

  const fetchProfile = async (id: string) => {
    const { data } = await supabase.from('profiles').select('*').eq('id', id).single();
    setProfile(data);
  };

  const fetchData = async () => {
    const { data: c } = await supabase.from('courses').select('*');
    setCourses(c || []);
    const { data: s } = await supabase.from('profiles').select('*');
    setStudents(s || []);
    const { data: e } = await supabase.from('enrollments').select('*, courses(title), profiles(email)');
    setEnrollments(e || []);
  };

  // Funções Admin
  const approveStudent = async (id: string) => {
    await supabase.from('profiles').update({ status: 'approved' }).eq('id', id);
    fetchData();
  };

  const approveEnrollment = async (id: string) => {
    await supabase.from('enrollments').update({ status: 'approved' }).eq('id', id);
    fetchData();
  };

  const handleCreateCourse = async () => {
    await supabase.from('courses').insert([{ 
      title: newCourse.title, 
      description: newCourse.desc, 
      dates: newCourse.dates, 
      price: parseFloat(newCourse.price) 
    }]);
    setNewCourse({ title: '', desc: '', dates: '', price: '' });
    fetchData();
  };

  // Função Aluno
  const requestEnrollment = async (courseId: string) => {
    await supabase.from('enrollments').insert([{ student_id: user.id, course_id: courseId }]);
    alert("Pedido enviado! Aguarde aprovação do Diretor Dimas.");
    fetchData();
  };

  if (!user || !profile) return <div className="p-10">Carregando...</div>;

  // Bloqueio se o aluno não estiver aprovado
  if (profile.status === 'pending' && user.email !== ADMIN_EMAIL) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 text-center">
        <div className="max-w-md bg-white p-10 rounded-3xl shadow-xl">
          <Clock size={60} className="mx-auto text-amber-500 mb-4 animate-pulse" />
          <h2 className="text-2xl font-bold mb-2">Conta em Análise</h2>
          <p className="text-slate-500">Olá! O Diretor Dimas recebeu o teu registo. Assim que a tua conta for validada, terás acesso aos cursos.</p>
          <button onClick={() => supabase.auth.signOut().then(() => navigate("/"))} className="mt-6 text-blue-600 font-bold">Voltar</button>
        </div>
      </div>
    );
  }

  const isAdmin = user.email === ADMIN_EMAIL;

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 p-6 text-slate-400 flex flex-col">
        <h1 className="text-white font-black text-xl mb-10 flex items-center gap-2"><GraduationCap className="text-blue-500"/> Dimas Admin</h1>
        <nav className="space-y-4 flex-1">
          <button onClick={() => setView('courses')} className={`w-full text-left flex items-center gap-2 p-3 rounded-xl ${view === 'courses' ? 'bg-blue-600 text-white' : ''}`}><BookOpen size={18}/> Cursos</button>
          {isAdmin && (
            <>
              <button onClick={() => setView('students')} className={`w-full text-left flex items-center gap-2 p-3 rounded-xl ${view === 'students' ? 'bg-blue-600 text-white' : ''}`}><Users size={18}/> Alunos</button>
              <button onClick={() => setView('requests')} className={`w-full text-left flex items-center gap-2 p-3 rounded-xl ${view === 'requests' ? 'bg-blue-600 text-white' : ''}`}><Check size={18}/> Pedidos</button>
            </>
          )}
        </nav>
        <button onClick={() => supabase.auth.signOut().then(() => navigate("/"))} className="text-red-400 p-3 flex items-center gap-2 font-bold"><LogOut size={18}/> Sair</button>
      </aside>

      {/* Main */}
      <main className="flex-1 p-10 overflow-y-auto">
        {view === 'courses' && (
          <section>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold">Catálogo de Cursos</h2>
              {isAdmin && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border flex flex-col gap-3 w-96">
                  <h3 className="font-bold text-blue-600">Novo Curso</h3>
                  <input placeholder="Nome" className="border p-2 rounded-lg" value={newCourse.title} onChange={e => setNewCourse({...newCourse, title: e.target.value})} />
                  <textarea placeholder="Descrição" className="border p-2 rounded-lg" value={newCourse.desc} onChange={e => setNewCourse({...newCourse, desc: e.target.value})} />
                  <input placeholder="Datas (ex: Segundas às 19h)" className="border p-2 rounded-lg" value={newCourse.dates} onChange={e => setNewCourse({...newCourse, dates: e.target.value})} />
                  <input placeholder="Preço €" type="number" className="border p-2 rounded-lg" value={newCourse.price} onChange={e => setNewCourse({...newCourse, price: e.target.value})} />
                  <button onClick={handleCreateCourse} className="bg-blue-600 text-white p-2 rounded-lg font-bold">Publicar Curso</button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courses.map(c => (
                <div key={c.id} className="bg-white p-8 rounded-3xl border shadow-sm flex flex-col h-full">
                  <h3 className="text-xl font-bold mb-2">{c.title}</h3>
                  <p className="text-slate-500 mb-4 flex-1">{c.description}</p>
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-sm text-slate-400"><Calendar size={14}/> {c.dates}</div>
                    <div className="flex items-center gap-2 text-lg font-bold text-blue-600"><Euro size={18}/> {c.price}€</div>
                  </div>
                  {!isAdmin && (
                    <button 
                      onClick={() => requestEnrollment(c.id)}
                      className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-blue-600 transition"
                    >
                      Solicitar Acesso
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {view === 'students' && isAdmin && (
          <section className="bg-white rounded-3xl border shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b text-slate-400 text-xs uppercase tracking-widest">
                <tr><th className="p-6">Email</th><th className="p-6">Status</th><th className="p-6">Ação</th></tr>
              </thead>
              <tbody>
                {students.map(s => (
                  <tr key={s.id} className="border-b last:border-0">
                    <td className="p-6 font-bold">{s.email}</td>
                    <td className="p-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${s.status === 'approved' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                        {s.status === 'approved' ? 'Ativo' : 'Pendente'}
                      </span>
                    </td>
                    <td className="p-6">
                      {s.status === 'pending' && <button onClick={() => approveStudent(s.id)} className="text-blue-600 font-bold flex items-center gap-1"><Check size={16}/> Aceitar Aluno</button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {view === 'requests' && isAdmin && (
          <section className="space-y-4">
            <h2 className="text-2xl font-bold mb-6">Pedidos de Inscrição em Cursos</h2>
            {enrollments.filter(e => e.status === 'pending').map(e => (
              <div key={e.id} className="bg-white p-6 rounded-2xl border shadow-sm flex justify-between items-center">
                <div>
                  <p className="font-bold text-slate-800">{e.profiles?.email}</p>
                  <p className="text-sm text-blue-600 font-medium italic">Quer entrar em: {e.courses?.title}</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => approveEnrollment(e.id)} className="bg-emerald-500 text-white p-3 rounded-xl shadow-lg shadow-emerald-100 hover:scale-105 transition"><Check size={20}/></button>
                  <button className="bg-red-50 text-red-500 p-3 rounded-xl hover:bg-red-500 hover:text-white transition"><X size={20}/></button>
                </div>
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  );
};

// ... Manter os componentes Auth e App (Router) iguais ao anterior ...
