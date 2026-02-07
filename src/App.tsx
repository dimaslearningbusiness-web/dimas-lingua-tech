import { HashRouter, Routes, Route, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { createClient } from '@supabase/supabase-js';
import { 
  GraduationCap, LayoutDashboard, LogOut, Users, BookOpen, 
  Plus, Trash2, Check, Clock, Calendar, Euro, Shield, Play, FileText, Send, Star
} from 'lucide-react';

const supabaseUrl = 'https://tockiucmhkoxvauytzfq.supabase.co';
const supabaseAnonKey = 'sb_publishable_W7SzJuYMbF9qN71OCH1nqw_YaWGI5WD';
const supabase = createClient(supabaseUrl, supabaseAnonKey);
const ADMIN_EMAIL = "dimaslearningbusiness@gmail.com";

// --- COMPONENTE: NAVBAR PÚBLICA ---
const Navbar = ({ user, isAdmin }: any) => {
  const navigate = useNavigate();
  return (
    <nav className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto border-b">
      <div className="flex items-center gap-2 font-bold text-2xl text-blue-600 cursor-pointer" onClick={() => navigate("/")}>
        <GraduationCap size={32} /> <span>Dimas Learning</span>
      </div>
      <div className="flex gap-6 items-center font-medium">
        <Link to="/" className="hover:text-blue-600">Home</Link>
        <Link to="/courses-public" className="hover:text-blue-600">Courses</Link>
        {user ? (
          <button onClick={() => navigate("/dashboard")} className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold">
            Dashboard {isAdmin ? '(Admin)' : ''}
          </button>
        ) : (
          <button onClick={() => navigate("/auth")} className="bg-slate-900 text-white px-6 py-2 rounded-xl font-bold">Login</button>
        )}
      </div>
    </nav>
  );
};

// --- PÁGINA: HOME ---
const Index = ({ user, isAdmin }: any) => (
  <div className="min-h-screen bg-white">
    <Navbar user={user} isAdmin={isAdmin} />
    <header className="max-w-7xl mx-auto px-8 py-20 grid lg:grid-cols-2 gap-12 items-center">
      <div>
        <h1 className="text-6xl font-extrabold leading-tight text-slate-900">Elevate your English to a <span className="text-blue-600">Global Scale</span>.</h1>
        <p className="text-xl text-slate-500 mt-6">Technical English mentorship for IT professionals who want to lead.</p>
      </div>
      <div className="bg-slate-100 aspect-video rounded-3xl flex items-center justify-center shadow-inner">
        <Play size={48} className="text-blue-600 fill-blue-600" />
      </div>
    </header>
  </div>
);

// --- DASHBOARD: LÓGICA UNIFICADA ---
const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);
  const [view, setView] = useState<'overview' | 'students' | 'requests' | 'materials'>('overview');
  
  // States para envio de ficheiros (Admin)
  const [selectedStudent, setSelectedStudent] = useState("");
  const [fileLabel, setFileLabel] = useState("");
  const [fileUrl, setFileUrl] = useState("");

  const navigate = useNavigate();
  const isAdmin = user?.email === ADMIN_EMAIL;

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) navigate("/auth");
      else {
        setUser(data.user);
        fetchProfile(data.user.id);
        fetchData(data.user.id, data.user.email === ADMIN_EMAIL);
      }
    });
  }, [navigate]);

  const fetchProfile = async (id: string) => {
    const { data } = await supabase.from('profiles').select('*').eq('id', id).single();
    setProfile(data || { status: 'pending' });
  };

  const fetchData = async (uid: string, adminStatus: boolean) => {
    const { data: c } = await supabase.from('courses').select('*');
    setCourses(c || []);
    
    if (adminStatus) {
      const { data: s } = await supabase.from('profiles').select('*');
      setStudents(s || []);
      const { data: e } = await supabase.from('enrollments').select('*, courses(title), profiles(email)');
      setEnrollments(e || []);
      const { data: m } = await supabase.from('student_materials').select('*, profiles(email)');
      setMaterials(m || []);
    } else {
      const { data: m } = await supabase.from('student_materials').select('*').eq('student_id', uid);
      setMaterials(m || []);
    }
  };

  const sendFile = async () => {
    if (!selectedStudent || !fileUrl) return;
    await supabase.from('student_materials').insert([{
      student_id: selectedStudent,
      file_label: fileLabel,
      file_url: fileUrl
    }]);
    alert("Ficheiro enviado!");
    setFileLabel(""); setFileUrl("");
    fetchData(user.id, true);
  };

  if (!user || !profile) return <div className="p-20 text-center">Loading Secure Dashboard...</div>;

  // ESTADO GUEST (PENDENTE)
  if (!isAdmin && profile.status === 'pending') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
        <Clock size={64} className="text-amber-500 animate-pulse mb-4" />
        <h2 className="text-3xl font-bold">Acesso Pendente</h2>
        <p className="text-slate-500 mt-2">O Diretor Dimas está a validar o teu perfil. Volta mais tarde!</p>
        <button onClick={() => supabase.auth.signOut().then(() => navigate("/"))} className="mt-8 text-blue-600 underline">Sair</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      <aside className="w-64 bg-slate-900 p-6 text-slate-400 flex flex-col">
        <h2 className="text-white font-bold text-xl mb-10 flex items-center gap-2"><Shield className="text-blue-500"/> {isAdmin ? 'Admin' : 'Student'}</h2>
        <nav className="space-y-2 flex-1 text-sm">
          <button onClick={() => setView('overview')} className={`w-full text-left p-3 rounded-xl flex items-center gap-2 ${view === 'overview' ? 'bg-blue-600 text-white' : ''}`}><LayoutDashboard size={18}/> Overview</button>
          {isAdmin && (
            <>
              <button onClick={() => setView('students')} className={`w-full text-left p-3 rounded-xl flex items-center gap-2 ${view === 'students' ? 'bg-blue-600 text-white' : ''}`}><Users size={18}/> Students</button>
              <button onClick={() => setView('requests')} className={`w-full text-left p-3 rounded-xl flex items-center gap-2 ${view === 'requests' ? 'bg-blue-600 text-white' : ''}`}><Check size={18}/> Enrollments</button>
              <button onClick={() => setView('materials')} className={`w-full text-left p-3 rounded-xl flex items-center gap-2 ${view === 'materials' ? 'bg-blue-600 text-white' : ''}`}><FileText size={18}/> Send Materials</button>
            </>
          )}
        </nav>
        <button onClick={() => supabase.auth.signOut().then(() => navigate("/"))} className="text-red-400 font-bold p-3 flex items-center gap-2"><LogOut size={18}/> Exit</button>
      </aside>

      <main className="flex-1 p-10 overflow-y-auto">
        {view === 'overview' && (
          <div className="space-y-8">
            <h1 className="text-3xl font-bold">Hello, {user.email}</h1>
            
            {/* PROGRESSO DO ALUNO (Visual) */}
            {!isAdmin && (
              <div className="bg-white p-8 rounded-3xl shadow-sm border">
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <span className="text-xs font-black bg-blue-100 text-blue-600 px-3 py-1 rounded-full uppercase">Level: {profile.english_level}</span>
                    <h3 className="text-xl font-bold mt-2">Class Progress</h3>
                  </div>
                  <span className="font-bold text-blue-600">{profile.lessons_completed} / {profile.total_lessons} lessons</span>
                </div>
                <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full transition-all" style={{ width: `${(profile.lessons_completed / profile.total_lessons) * 100}%` }}></div>
                </div>
                
                <h3 className="font-bold mt-10 mb-4 flex items-center gap-2"><FileText size={18}/> My Materials</h3>
                <div className="grid gap-2">
                  {materials.map(m => (
                    <a key={m.id} href={m.file_url} target="_blank" className="p-4 bg-slate-50 rounded-xl border flex justify-between hover:bg-blue-50 transition">
                      <span className="font-medium text-slate-700">{m.file_label}</span>
                      <Send size={16} className="text-blue-400"/>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {isAdmin && <div className="text-slate-500 italic">Welcome back, Dimas. Use the sidebar to manage your school.</div>}
          </div>
        )}

        {view === 'materials' && isAdmin && (
          <section className="max-w-2xl bg-white p-8 rounded-3xl border shadow-sm">
            <h2 className="text-2xl font-bold mb-6">Send Class Materials</h2>
            <div className="space-y-4">
              <select className="w-full p-3 border rounded-xl" onChange={e => setSelectedStudent(e.target.value)}>
                <option value="">Select Student...</option>
                {students.map(s => <option key={s.id} value={s.id}>{s.email}</option>)}
              </select>
              <input placeholder="File Description (e.g. Grammar PDF)" className="w-full p-3 border rounded-xl" onChange={e => setFileLabel(e.target.value)} />
              <input placeholder="URL Link (Google Drive / Dropbox)" className="w-full p-3 border rounded-xl" onChange={e => setFileUrl(e.target.value)} />
              <button onClick={sendFile} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold">Send to Student</button>
            </div>

            <h3 className="font-bold mt-10 mb-4">Recent Shares</h3>
            <div className="text-sm space-y-2">
              {materials.slice(0, 5).map(m => (
                <div className="p-3 bg-slate-50 border rounded-lg flex justify-between">
                  <span><b>{m.profiles?.email}</b>: {m.file_label}</span>
                  <span className="text-slate-400 text-xs">{new Date(m.sent_at).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          </section>
        )}
        
        {/* ... (Secções de 'requests' e 'students' iguais às anteriores) ... */}
      </main>
    </div>
  );
};

// --- AUTH, ROUTER E EXPORT ---
const Auth = () => { /* Mantém lógica anterior */ return <div className="p-20 text-center">Auth Component (As previous)</div> };

export default function App() {
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Index user={user} isAdmin={user?.email === ADMIN_EMAIL} />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Adicionar rota pública de cursos aqui */}
      </Routes>
    </HashRouter>
  );
}
