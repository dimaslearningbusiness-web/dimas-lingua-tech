import { HashRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { createClient } from '@supabase/supabase-js';
import { 
  GraduationCap, LayoutDashboard, LogOut, Users, 
  DollarSign, BookOpen, Play, Shield, Plus, Trash2, Mail 
} from 'lucide-react';

const supabaseUrl = 'https://tockiucmhkoxvauytzfq.supabase.co';
const supabaseAnonKey = 'sb_publishable_W7SzJuYMbF9qN71OCH1nqw_YaWGI5WD';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const Index = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <nav className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 font-bold text-2xl text-blue-600">
          <GraduationCap size={32} /> <span>Dimas Learning</span>
        </div>
        <button onClick={() => navigate("/auth")} className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 transition">Portal Login</button>
      </nav>
      <header className="max-w-7xl mx-auto px-8 py-20 text-center lg:text-left grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <span className="bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-bold uppercase">IT English Specialists</span>
          <h1 className="text-6xl font-extrabold leading-tight mt-4">Elevate Your <span className="text-blue-600">Tech Career</span></h1>
          <p className="text-xl text-slate-500 mt-6 italic">Specialized English training for Software Engineers and IT Managers.</p>
          <button onClick={() => navigate("/auth")} className="mt-10 bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-bold">Get Started</button>
        </div>
        <div className="bg-slate-900 aspect-video rounded-3xl shadow-2xl flex items-center justify-center relative">
          <Play size={64} className="text-blue-500 fill-blue-500" />
        </div>
      </header>
    </div>
  );
};

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
      <div className="bg-white p-10 rounded-[2.5rem] shadow-xl w-full max-w-md border">
        <h2 className="text-3xl font-bold text-center mb-8">{isRegister ? "Join Dimas Tech" : "Welcome Back"}</h2>
        <input type="email" placeholder="Email" className="w-full p-4 mb-4 bg-slate-50 border rounded-xl" onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" className="w-full p-4 mb-6 bg-slate-50 border rounded-xl" onChange={e => setPassword(e.target.value)} />
        <button onClick={handleAuth} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold">{isRegister ? "Register" : "Login"}</button>
        <p onClick={() => setIsRegister(!isRegister)} className="text-center mt-4 text-blue-600 cursor-pointer font-bold text-sm">
          {isRegister ? "Switch to Login" : "Need an account? Register"}
        </p>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [view, setView] = useState<'courses' | 'students'>('courses');
  const [newTitle, setNewTitle] = useState("");
  const navigate = useNavigate();
  const ADMIN_EMAIL = "dimaslearningbusiness@gmail.com";

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) navigate("/auth");
      else setUser(data.user);
    });
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    const { data: c } = await supabase.from('courses').select('*');
    if (c) setCourses(c);
    
    // Só tenta buscar alunos se for o admin
    const { data: s } = await supabase.from('profiles').select('*');
    if (s) setStudents(s);
  };

  const createCourse = async () => {
    await supabase.from('courses').insert([{ title: newTitle, price: 99 }]);
    setNewTitle("");
    fetchData();
  };

  if (!user) return null;
  const isAdmin = user.email === ADMIN_EMAIL;

  return (
    <div className="min-h-screen bg-[#fcfdfe] flex">
      <aside className="w-64 bg-slate-900 p-8 text-slate-400 flex flex-col">
        <div className="text-white font-bold mb-10 flex items-center gap-2 text-xl"><Shield className="text-blue-500" /> Admin PRO</div>
        
        <nav className="flex-1 space-y-6">
          <div onClick={() => setView('courses')} className={`flex items-center gap-3 cursor-pointer font-bold ${view === 'courses' ? 'text-blue-400' : ''}`}>
            <BookOpen size={20}/> {isAdmin ? "Manage Courses" : "My Lessons"}
          </div>
          
          {isAdmin && (
            <div onClick={() => setView('students')} className={`flex items-center gap-3 cursor-pointer font-bold ${view === 'students' ? 'text-amber-400' : ''}`}>
              <Users size={20}/> Students List
            </div>
          )}
        </nav>

        <button onClick={() => { supabase.auth.signOut(); navigate("/"); }} className="mt-auto text-red-400 font-bold flex items-center gap-2"><LogOut size={20} /> Logout</button>
      </aside>

      <main className="flex-1 p-12">
        <h1 className="text-3xl font-bold mb-8">
          {view === 'courses' ? "Course Management" : "Active Students"}
        </h1>

        {view === 'courses' ? (
          <div className="space-y-6">
            {isAdmin && (
              <div className="flex gap-4 mb-10">
                <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="New Course Name" className="flex-1 p-4 border rounded-2xl shadow-sm" />
                <button onClick={createCourse} className="bg-blue-600 text-white px-8 rounded-2xl font-bold hover:bg-blue-700">Add Course</button>
              </div>
            )}
            <div className="grid gap-4">
              {courses.map(c => (
                <div key={c.id} className="bg-white p-6 border rounded-[2rem] flex justify-between items-center shadow-sm">
                  <span className="font-bold text-slate-700">{c.title}</span>
                  <div className="flex gap-4 items-center">
                    <span className="text-blue-600 font-bold">€{c.price}</span>
                    {isAdmin && <Trash2 size={18} className="text-slate-300 hover:text-red-500 cursor-pointer" />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-[2rem] border overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="p-6 font-bold text-slate-500">Student Email</th>
                  <th className="p-6 font-bold text-slate-500">Joined At</th>
                  <th className="p-6 font-bold text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map(s => (
                  <tr key={s.id} className="border-b last:border-0">
                    <td className="p-6 font-medium">{s.email}</td>
                    <td className="p-6 text-slate-400">{new Date(s.joined_at).toLocaleDateString()}</td>
                    <td className="p-6"><Mail size={18} className="text-blue-400 cursor-pointer" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

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
