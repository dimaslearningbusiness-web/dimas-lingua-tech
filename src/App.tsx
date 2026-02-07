import { HashRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { createClient } from '@supabase/supabase-js';
import { 
  GraduationCap, LayoutDashboard, LogOut, Users, BookOpen, 
  Plus, Trash2, Check, Clock, Calendar, Euro, Shield, Play 
} from 'lucide-react';

const supabaseUrl = 'https://tockiucmhkoxvauytzfq.supabase.co';
const supabaseAnonKey = 'sb_publishable_W7SzJuYMbF9qN71OCH1nqw_YaWGI5WD';
const supabase = createClient(supabaseUrl, supabaseAnonKey);
const ADMIN_EMAIL = "dimaslearningbusiness@gmail.com";

// --- LANDING PAGE ---
const Index = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white font-sans">
      <nav className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 font-bold text-2xl text-blue-600">
          <GraduationCap size={32} /> <span>Dimas Learning</span>
        </div>
        <button onClick={() => navigate("/auth")} className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold">Portal Login</button>
      </nav>
      <header className="max-w-7xl mx-auto px-8 py-20 grid lg:grid-cols-2 gap-12 items-center text-center lg:text-left">
        <div>
          <h1 className="text-6xl font-extrabold leading-tight">Master <span className="text-blue-600">IT English</span></h1>
          <p className="text-xl text-slate-500 mt-6">Exclusive training for Global Tech Professionals.</p>
          <button onClick={() => navigate("/auth")} className="mt-10 bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-bold">Start Now</button>
        </div>
        <div className="bg-slate-900 aspect-video rounded-3xl flex items-center justify-center shadow-2xl">
          <Play size={64} className="text-blue-500 fill-blue-500" />
        </div>
      </header>
    </div>
  );
};

// --- AUTH (LOGIN/REGISTER) ---
const Auth = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleAuth = async () => {
    const { error } = isRegister 
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });

    if (error) alert(error.message);
    else navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-8">{isRegister ? "Join Us" : "Welcome Back"}</h2>
        <input type="email" placeholder="Email" className="w-full p-4 mb-4 bg-slate-50 border rounded-xl" onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" className="w-full p-4 mb-6 bg-slate-50 border rounded-xl" onChange={e => setPassword(e.target.value)} />
        <button onClick={handleAuth} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold">
          {isRegister ? "Register" : "Login"}
        </button>
        <p onClick={() => setIsRegister(!isRegister)} className="text-center mt-4 text-blue-600 cursor-pointer font-bold">
          {isRegister ? "Already a student? Login" : "New? Create account"}
        </p>
      </div>
    </div>
  );
};

// --- DASHBOARD ---
const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [view, setView] = useState<'courses' | 'students' | 'requests'>('courses');
  const [newCourse, setNewCourse] = useState({ title: '', desc: '', dates: '', price: '' });
  
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) navigate("/auth");
      else {
        setUser(data.user);
        fetchProfile(data.user.id);
        fetchData();
      }
    });
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

  if (!user || !profile) return <div className="p-10">Loading Dashboard...</div>;

  // Bloqueio de Segurança para Alunos Pendentes
  if (profile.status === 'pending' && user.email !== ADMIN_EMAIL) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 text-center">
        <div className="max-w-md bg-white p-10 rounded-3xl shadow-xl">
          <Clock size={60} className="mx-auto text-amber-500 mb-4 animate-bounce" />
          <h2 className="text-2xl font-bold mb-2">Registration Pending</h2>
          <p className="text-slate-500 italic font-medium">Director Dimas is reviewing your account. Access will be granted shortly.</p>
          <button onClick={() => supabase.auth.signOut().then(() => navigate("/"))} className="mt-6 text-blue-600 font-bold underline">Logout</button>
        </div>
      </div>
    );
  }

  const isAdmin = user.email === ADMIN_EMAIL;

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      <aside className="w-64 bg-slate-900 p-6 text-slate-400 flex flex-col">
        <h1 className="text-white font-black text-xl mb-10 flex items-center gap-2"><Shield className="text-blue-500"/> Dimas Admin</h1>
        <nav className="space-y-4 flex-1">
          <button onClick={() => setView('courses')} className={`w-full text-left flex items-center gap-2 p-3 rounded-xl transition ${view === 'courses' ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-slate-800'}`}><BookOpen size={18}/> Courses</button>
          {isAdmin && (
            <>
              <button onClick={() => setView('students')} className={`w-full text-left flex items-center gap-2 p-3 rounded-xl transition ${view === 'students' ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-slate-800'}`}><Users size={18}/> Students</button>
              <button onClick={() => setView('requests')} className={`w-full text-left flex items-center gap-2 p-3 rounded-xl transition ${view === 'requests' ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-slate-800'}`}><Check size={18}/> Approvals</button>
            </>
          )}
        </nav>
        <button onClick={() => supabase.auth.signOut().then(() => navigate("/"))} className="text-red-400 p-3 flex items-center gap-2 font-bold hover:bg-red-500/10 rounded-xl transition"><LogOut size={18}/> Sign Out</button>
      </aside>

      <main className="flex-1 p-10 overflow-y-auto">
        {view === 'courses' && (
          <section>
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-4xl font-black text-slate-800">Catalog</h2>
              {isAdmin && (
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-blue-50 w-full max-w-md">
                  <h3 className="font-bold text-blue-600 mb-4 underline">Create New Course</h3>
                  <div className="space-y-3">
                    <input placeholder="Course Name" className="w-full border p-3 rounded-xl" value={newCourse.title} onChange={e => setNewCourse({...newCourse, title: e.target.value})} />
                    <textarea placeholder="Full Description" className="w-full border p-3 rounded-xl h-24" value={newCourse.desc} onChange={e => setNewCourse({...newCourse, desc: e.target.value})} />
                    <input placeholder="Schedule (e.g. Mon/Wed 19h)" className="w-full border p-3 rounded-xl" value={newCourse.dates} onChange={e => setNewCourse({...newCourse, dates: e.target.value})} />
                    <input placeholder="Price €" type="number" className="w-full border p-3 rounded-xl" value={newCourse.price} onChange={e => setNewCourse({...newCourse, price: e.target.value})} />
                    <button onClick={handleCreateCourse} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition">Publish Course</button>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {courses.map(c => (
                <div key={c.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col h-full hover:shadow-md transition">
                  <h3 className="text-2xl font-bold mb-3">{c.title}</h3>
                  <p className="text-slate-500 mb-6 flex-1 text-sm leading-relaxed">{c.description}</p>
                  <div className="bg-slate-50 p-4 rounded-2xl mb-6">
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-400 mb-2"><Calendar size={14}/> {c.dates}</div>
                    <div className="flex items-center gap-2 text-2xl font-black text-blue-600"><Euro size={20}/> {c.price}€</div>
                  </div>
                  {!isAdmin && (
                    <button 
                      onClick={async () => {
                        await supabase.from('enrollments').insert([{ student_id: user.id, course_id: c.id }]);
                        alert("Request Sent! Wait for approval.");
                      }}
                      className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-blue-600 transition"
                    >
                      Request Access
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {view === 'students' && isAdmin && (
          <section className="bg-white rounded-3xl border shadow-sm overflow-hidden">
             <div className="p-8 border-b bg-slate-50/50"><h3 className="font-bold text-xl">User Management</h3></div>
             <table className="w-full text-left">
              <thead><tr className="text-slate-400 text-xs uppercase"><th className="p-6">Email</th><th className="p-6">Status</th><th className="p-6 text-right">Action</th></tr></thead>
              <tbody>
                {students.map(s => (
                  <tr key={s.id} className="border-t hover:bg-slate-50 transition">
                    <td className="p-6 font-bold">{s.email}</td>
                    <td className="p-6">
                      <span className={`px-4 py-1 rounded-full text-xs font-black uppercase ${s.status === 'approved' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="p-6 text-right">
                      {s.status === 'pending' && <button onClick={() => approveStudent(s.id)} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold">Approve</button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {view === 'requests' && isAdmin && (
          <section className="space-y-6">
            <h2 className="text-3xl font-black text-slate-800 mb-8 tracking-tight">Course Requests</h2>
            {enrollments.filter(e => e.status === 'pending').map(e => (
              <div key={e.id} className="bg-white p-8 rounded-3xl border border-blue-100 shadow-sm flex justify-between items-center animate-fade-in">
                <div>
                  <p className="font-black text-slate-800 text-lg">{e.profiles?.email}</p>
                  <p className="text-blue-600 font-bold italic flex items-center gap-2 mt-1"><BookOpen size={16}/> Applied for: {e.courses?.title}</p>
                </div>
                <button onClick={() => approveEnrollment(e.id)} className="bg-emerald-500 text-white p-4 rounded-2xl shadow-lg shadow-emerald-100 hover:scale-105 transition active:scale-95"><Check size={24}/></button>
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  );
};

// EXPORTAÇÃO DEFAULT OBRIGATÓRIA
export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </HashRouter>
  );
}
