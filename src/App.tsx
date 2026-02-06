import { HashRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { createClient } from '@supabase/supabase-js'; // Importação direta
import { GraduationCap, LayoutDashboard, LogOut, Users, DollarSign, BookOpen, Play, Shield } from 'lucide-react';

// --- LIGAÇÃO SUPABASE (DIRECTA NO APP) ---
const supabaseUrl = 'https://TEU-ID.supabase.co'; // <--- MUDA ISTO
const supabaseAnonKey = 'TUA-CHAVE-ANON';        // <--- MUDA ISTO
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- COMPONENTES ---

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
          <h1 className="text-6xl font-extrabold leading-tight">Master <span className="text-blue-600">Technical English</span> for IT</h1>
          <p className="text-xl text-slate-500 mt-6 italic">Advance your global career with specialized language training.</p>
          <button onClick={() => navigate("/auth")} className="mt-10 bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-bold">Start Your Journey</button>
        </div>
        <div className="bg-slate-900 aspect-video rounded-3xl shadow-2xl flex items-center justify-center">
          <Play size={64} className="text-blue-500 fill-blue-500" />
        </div>
      </header>
    </div>
  );
};

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert("Erro: " + error.message);
    else navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-xl w-full max-w-md border">
        <div className="bg-blue-600 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"><Shield className="text-white" /></div>
        <h2 className="text-3xl font-bold text-center mb-8">Access Portal</h2>
        <input type="email" placeholder="Email" className="w-full p-4 mb-4 bg-slate-50 border rounded-xl" onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" className="w-full p-4 mb-6 bg-slate-50 border rounded-xl" onChange={e => setPassword(e.target.value)} />
        <button onClick={handleLogin} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold">Sign In</button>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const ADMIN_EMAIL = "dimaslearningbusiness@gmail.com";

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) navigate("/auth");
      else setUser(data.user);
    });
  }, [navigate]);

  if (!user) return <div className="p-10 text-center">Loading...</div>;
  const isAdmin = user.email === ADMIN_EMAIL;

  return (
    <div className="min-h-screen bg-[#fcfdfe] flex">
      <aside className="w-64 bg-slate-900 p-8 text-slate-400 flex flex-col">
        <div className="text-white font-bold mb-10 flex items-center gap-2"><LayoutDashboard className="text-blue-500" /> Panel</div>
        <nav className="flex-1 space-y-4 font-bold">
          <div className="text-blue-400 cursor-pointer flex items-center gap-2"><BookOpen size={18}/> My Learning</div>
          {isAdmin && (
            <>
              <div className="text-emerald-400 cursor-pointer flex items-center gap-2 pt-4 border-t border-slate-800"><DollarSign size={18}/> Revenue</div>
              <div className="text-amber-400 cursor-pointer flex items-center gap-2"><Users size={18}/> Students</div>
            </>
          )}
        </nav>
        <button onClick={() => { supabase.auth.signOut(); navigate("/"); }} className="mt-auto flex items-center gap-2 text-red-400 font-bold">Logout</button>
      </aside>
      <main className="flex-1 p-12">
        <h1 className="text-3xl font-bold">Welcome, {isAdmin ? "Director" : "Student"}</h1>
        <p className="text-slate-500">{user.email}</p>
        <div className="mt-10 p-10 bg-white border rounded-[2rem] shadow-sm">
           {isAdmin ? "Estatísticas de Vendas Ativas" : "Próxima Aula: Technical Interview Prep"}
        </div>
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
