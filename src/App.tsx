import { HashRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import { GraduationCap, LayoutDashboard, LogOut, Users, DollarSign, BookOpen, Play, Trophy } from 'lucide-react';

// --- FRONT PAGE ---
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
          <h1 className="text-6xl font-extrabold leading-tight">Master <span className="text-blue-600">Technical English</span> for IT Professionals</h1>
          <p className="text-xl text-slate-500 mt-6 italic">Advance your global career with specialized language training.</p>
          <button onClick={() => navigate("/auth")} className="mt-10 bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-bold shadow-lg shadow-blue-200">Start Your Journey</button>
        </div>
        <div className="bg-slate-900 aspect-video rounded-3xl shadow-2xl flex items-center justify-center">
          <Play size={64} className="text-blue-500 fill-blue-500" />
        </div>
      </header>
    </div>
  );
};

// --- AUTH ---
const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    else navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 font-sans">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-xl w-full max-w-md border border-slate-100">
        <h2 className="text-3xl font-bold text-center mb-8">Access Portal</h2>
        <input type="email" placeholder="Email" className="w-full p-4 mb-4 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" className="w-full p-4 mb-6 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" onChange={e => setPassword(e.target.value)} />
        <button onClick={handleLogin} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition">Sign In</button>
      </div>
    </div>
  );
};

// --- DASHBOARD (ADMIN & STUDENT) ---
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

  if (!user) return null;
  const isAdmin = user.email === ADMIN_EMAIL;

  return (
    <div className="min-h-screen bg-[#fcfdfe] flex font-sans">
      <aside className="w-64 bg-slate-900 p-8 text-slate-400 flex flex-col">
        <div className="text-white font-bold text-xl mb-10 flex items-center gap-2">
          <LayoutDashboard size={20} className="text-blue-500" /> Dimas Panel
        </div>
        <nav className="flex-1 space-y-4">
          <div className="flex items-center gap-3 text-blue-400 font-bold"><BookOpen size={20}/> Courses</div>
          {isAdmin && (
            <div className="pt-6 mt-6 border-t border-slate-800 space-y-4">
               <div className="flex items-center gap-3 text-emerald-400 font-bold"><DollarSign size={20}/> Revenue</div>
               <div className="flex items-center gap-3 text-amber-400 font-bold"><Users size={20}/> Students</div>
            </div>
          )}
        </nav>
        <button onClick={() => { supabase.auth.signOut(); navigate("/"); }} className="mt-auto flex items-center gap-2 hover:text-red-400 transition font-bold">
          <LogOut size={20} /> Logout
        </button>
      </aside>

      <main className="flex-1 p-12">
        <h1 className="text-3xl font-bold">Welcome, {isAdmin ? "Director Dimas" : "Student"}</h1>
        <p className="text-slate-400 mt-2">{user.email}</p>

        {isAdmin ? (
          <div className="grid grid-cols-2 gap-8 mt-10">
            <div className="bg-white p-8 rounded-3xl border shadow-sm">
              <h3 className="text-slate-500 font-bold">Active Students</h3>
              <p className="text-5xl font-black mt-2">12</p>
            </div>
            <div className="bg-white p-8 rounded-3xl border shadow-sm">
              <h3 className="text-slate-500 font-bold">Total Revenue</h3>
              <p className="text-5xl font-black mt-2">€4,250</p>
            </div>
          </div>
        ) : (
          <div className="mt-10 bg-blue-600 p-10 rounded-[2.5rem] text-white flex justify-between items-center shadow-xl shadow-blue-200">
            <div>
              <h2 className="text-3xl font-bold">Resuming Lesson</h2>
              <p className="mt-2 opacity-80 uppercase tracking-widest font-bold text-sm">Advanced System Design Review</p>
            </div>
            <Play size={48} className="fill-white" />
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
