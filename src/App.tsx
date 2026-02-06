import { HashRouter, Routes, Route, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import { 
  GraduationCap, BookOpen, Clock, Trophy, Play, LogOut, 
  User, ChevronRight, Star, Shield, LayoutDashboard, 
  Users, DollarSign, Plus, Pencil, Trash2 
} from 'lucide-react';

// --- CONFIGURAÇÃO DE CORES E ESTILOS ---
const colors = {
  primary: '#2563eb', // Azul Royal
  accent: '#3b82f6',
  bg: '#f8fafc',
  dark: '#0f172a',
  textGray: '#64748b'
};

const cardStyle = "bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all";

// --- 1. LANDING PAGE (ENGLISH VERSION) ---
const Index = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <nav className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 font-bold text-2xl tracking-tight">
          <div className="bg-blue-600 p-2 rounded-lg"><GraduationCap className="text-white" /></div>
          <span>Dimas<span className="text-blue-600">Learning</span></span>
        </div>
        <div className="flex gap-6 items-center">
          <button onClick={() => navigate("/auth")} className="font-medium hover:text-blue-600 transition">Courses</button>
          <button onClick={() => navigate("/auth")} className="bg-blue-600 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-200">
            Student Portal
          </button>
        </div>
      </nav>

      <header className="max-w-7xl mx-auto px-8 py-20 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <span className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-sm font-bold tracking-wide uppercase">Elite Tech Education</span>
          <h1 className="text-6xl font-extrabold mt-6 leading-[1.1]">
            Master Technical <span className="text-blue-600">English</span> for IT Professionals
          </h1>
          <p className="text-xl text-slate-500 mt-8 leading-relaxed max-w-lg">
            Bridge the gap between your coding skills and global opportunities. Specialized training for Developers, Architects, and Tech Leaders.
          </p>
          <div className="flex gap-4 mt-10">
            <button onClick={() => navigate("/auth")} className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition">Start Learning Now</button>
            <button className="border-2 border-slate-200 px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-50 transition">View Curriculum</button>
          </div>
        </div>
        <div className="hidden lg:block relative">
          <div className="absolute -inset-4 bg-blue-100 rounded-full blur-3xl opacity-30"></div>
          <div className="relative bg-slate-900 aspect-video rounded-2xl shadow-2xl flex items-center justify-center overflow-hidden border-8 border-white">
            <div className="text-white text-center p-8">
              <Play className="w-16 h-16 mx-auto mb-4 fill-blue-500 text-blue-500" />
              <h3 className="text-xl font-bold">Course Preview</h3>
              <p className="text-slate-400">Mastering the Tech Interview in English</p>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

// --- 2. AUTH PAGE (LOGIN & REGISTER) ---
const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (type: "login" | "signup") => {
    setLoading(true);
    const { error } = type === "login" 
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });

    if (error) alert(error.message);
    else navigate("/dashboard");
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-xl border border-slate-100">
        <div className="text-center mb-10">
          <div className="bg-blue-600 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Shield className="text-white" />
          </div>
          <h2 className="text-3xl font-bold">Access Portal</h2>
          <p className="text-slate-400 mt-2">Enter your credentials to continue</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
            <input type="email" placeholder="name@company.com" className="w-full mt-1.5 p-4 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 outline-none transition" onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
            <input type="password" placeholder="••••••••" className="w-full mt-1.5 p-4 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 outline-none transition" onChange={e => setPassword(e.target.value)} />
          </div>
          <button onClick={() => handleAuth("login")} disabled={loading} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition mt-6 shadow-lg shadow-blue-100">
            {loading ? "Authenticating..." : "Login to Portal"}
          </button>
          <button onClick={() => handleAuth("signup")} disabled={loading} className="w-full bg-slate-100 text-slate-600 py-4 rounded-xl font-bold hover:bg-slate-200 transition">
            Create New Account
          </button>
        </div>
      </div>
    </div>
  );
};

// --- 3. SMART DASHBOARD (ALIGNED WITH YOUR MOCKUPS) ---
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

  if (!user) return <div className="h-screen flex items-center justify-center font-bold text-blue-600">Loading Secure Environment...</div>;

  const isAdmin = user.email === ADMIN_EMAIL;

  return (
    <div className="min-h-screen bg-[#fcfdfe] flex">
      {/* Sidebar */}
      <aside className="w-72 bg-slate-900 p-8 flex flex-col text-slate-300">
        <div className="flex items-center gap-3 text-white font-bold text-xl mb-12">
          <div className="bg-blue-500 p-1.5 rounded-md"><LayoutDashboard size={20} /></div>
          <span>Dimas Panel</span>
        </div>
        
        <nav className="flex-1 space-y-2">
          <div className="bg-blue-600/10 text-blue-400 p-3 rounded-xl flex items-center gap-3 font-medium cursor-pointer">
            <BookOpen size={20} /> My Learning
          </div>
          <div className="p-3 hover:bg-slate-800 rounded-xl flex items-center gap-3 transition cursor-pointer">
            <Clock size={20} /> Schedule
          </div>
          {isAdmin && (
            <div className="mt-8 pt-8 border-t border-slate-800 space-y-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3">Management</span>
              <div className="p-3 text-amber-400 hover:bg-slate-800 rounded-xl flex items-center gap-3 transition cursor-pointer font-bold">
                <Users size={20} /> Students List
              </div>
              <div className="p-3 text-emerald-400 hover:bg-slate-800 rounded-xl flex items-center gap-3 transition cursor-pointer font-bold">
                <DollarSign size={20} /> Revenue / Pricing
              </div>
            </div>
          )}
        </nav>

        <button onClick={() => { supabase.auth.signOut(); navigate("/"); }} className="mt-auto p-4 flex items-center gap-3 text-slate-500 hover:text-red-400 transition font-bold">
          <LogOut size={20} /> Sign Out
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-12 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {isAdmin ? "Director" : "Student"}! 👋</h1>
            <p className="text-slate-400 mt-1">Everything looks good for your progress today.</p>
          </div>
          <div className="flex items-center gap-4 bg-white p-2 pr-6 rounded-full shadow-sm border border-slate-100">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
              {user.email[0].toUpperCase()}
            </div>
            <span className="text-sm font-bold text-slate-600">{user.email}</span>
          </div>
        </header>

        {isAdmin ? (
          // --- ADMIN VIEW (REAL DATA MOCKED) ---
          <div className="space-y-8">
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <div className="bg-blue-50 w-12 h-12 rounded-2xl flex items-center justify-center text-blue-600 mb-4"><Users /></div>
                <h3 className="text-slate-500 font-medium">Active Students</h3>
                <p className="text-4xl font-black mt-2">124</p>
              </div>
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <div className="bg-emerald-50 w-12 h-12 rounded-2xl flex items-center justify-center text-emerald-600 mb-4"><DollarSign /></div>
                <h3 className="text-slate-500 font-medium">Monthly Revenue</h3>
                <p className="text-4xl font-black mt-2">€4,850.00</p>
              </div>
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <div className="bg-amber-50 w-12 h-12 rounded-2xl flex items-center justify-center text-amber-600 mb-4"><Trophy /></div>
                <h3 className="text-slate-500 font-medium">Graduation Rate</h3>
                <p className="text-4xl font-black mt-2">92%</p>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                <h3 className="font-bold">Course Inventory & Pricing</h3>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2"><Plus size={16}/> New Course</button>
              </div>
              <table className="w-full text-left">
                <thead className="text-xs uppercase text-slate-400 bg-white">
                  <tr>
                    <th className="p-6">Course Name</th>
                    <th className="p-6">Level</th>
                    <th className="p-6">Price</th>
                    <th className="p-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {[
                    {name: "English for Developers", level: "B1/B2", price: "€49.99"},
                    {name: "Technical Presentation Mastery", level: "C1", price: "€79.00"},
                    {name: "IT Management English", level: "C2", price: "€120.00"}
                  ].map((c, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition">
                      <td className="p-6 font-bold text-slate-700">{c.name}</td>
                      <td className="p-6"><span className="bg-slate-100 px-3 py-1 rounded-md text-xs font-bold text-slate-500">{c.level}</span></td>
                      <td className="p-6 font-mono font-bold text-blue-600">{c.price}</td>
                      <td className="p-6 text-right space-x-2">
                        <button className="text-slate-400 hover:text-blue-600"><Pencil size={18}/></button>
                        <button className="text-slate-400 hover:text-red-500"><Trash2 size={18}/></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          // --- STUDENT VIEW (CLEAN DASHBOARD) ---
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-10 rounded-3xl text-white relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold">Ready to continue?</h3>
                  <p className="opacity-80 mt-2 max-w-xs">You have "Advanced Architecture Terminology" pending today.</p>
                  <button className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold mt-6 flex items-center gap-2 hover:bg-slate-50 transition">
                    <Play size={18} /> Continue Lesson
                  </button>
                </div>
                <BookOpen className="absolute right-[-20px] bottom-[-20px] w-48 h-48 text-white/10 rotate-12" />
              </div>

              <h3 className="text-xl font-bold mt-10">My Courses</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className={cardStyle}>
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-blue-50 text-blue-600 text-[10px] font-black px-2 py-1 rounded">B2 INTERMEDIATE</span>
                    <span className="text-blue-600 font-bold">75%</span>
                  </div>
                  <h4 className="font-bold text-lg leading-tight">Professional English for Engineers</h4>
                  <div className="w-full bg-slate-100 h-2 rounded-full mt-4 overflow-hidden">
                    <div className="bg-blue-600 h-full w-3/4"></div>
                  </div>
                </div>
                <div className={cardStyle}>
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-2 py-1 rounded">C1 ADVANCED</span>
                    <span className="text-emerald-600 font-bold">12%</span>
                  </div>
                  <h4 className="font-bold text-lg leading-tight">Mastering Tech Interviews</h4>
                  <div className="w-full bg-slate-100 h-2 rounded-full mt-4 overflow-hidden">
                    <div className="bg-emerald-500 h-full w-[12%]"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <h3 className="font-bold mb-4 flex items-center gap-2"><Trophy size={18} className="text-amber-500"/> Accomplishments</h3>
                <div className="space-y-4">
                  <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center font-bold text-slate-400">#1</div>
                    <div><p className="font-bold text-sm">Pronunciation Badge</p><p className="text-xs text-slate-400">Completed 10 voice exercises</p></div>
                  </div>
                  <div className="flex gap-4 items-center opacity-40">
                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center font-bold text-slate-400">#2</div>
                    <div><p className="font-bold text-sm">Grammar Ninja</p><p className="text-xs text-slate-400">Unlock at level 10</p></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// --- APP ROUTER ---
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
