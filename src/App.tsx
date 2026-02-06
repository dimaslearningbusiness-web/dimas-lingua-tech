import { HashRouter, Routes, Route, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import { 
  GraduationCap, BookOpen, Clock, Trophy, Play, LogOut, 
  User, ChevronRight, Star, Shield, LayoutDashboard, 
  Users, DollarSign, Plus, Pencil, Trash2, CheckCircle2
} from 'lucide-react';

// --- SHARED UI COMPONENTS ---
const Button = ({ children, className = "", variant = "primary", ...props }: any) => {
  const base = "px-6 py-2.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 active:scale-95";
  const variants: any = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200",
    outline: "border-2 border-slate-200 text-slate-600 hover:bg-slate-50",
    ghost: "text-slate-500 hover:bg-slate-100",
    accent: "bg-blue-50 text-blue-600 hover:bg-blue-100"
  };
  return <button className={`${base} ${variants[variant]} ${className}`} {...props}>{children}</button>;
};

// --- 1. LANDING PAGE (TECH ENGLISH THEME) ---
const Index = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <nav className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 font-bold text-2xl tracking-tight">
          <div className="bg-blue-600 p-2 rounded-lg"><GraduationCap className="text-white" /></div>
          <span>Dimas<span className="text-blue-600">Learning</span></span>
        </div>
        <div className="flex gap-4">
          <Button variant="ghost" onClick={() => navigate("/auth")}>Courses</Button>
          <Button onClick={() => navigate("/auth")}>Student Portal</Button>
        </div>
      </nav>

      <header className="max-w-7xl mx-auto px-8 py-20 grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <span className="bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-bold tracking-wide uppercase">Global Tech Careers</span>
          <h1 className="text-6xl font-extrabold mt-6 leading-[1.1] text-slate-900">
            Master Technical <span className="text-blue-600 italic">English</span> for Global IT
          </h1>
          <p className="text-xl text-slate-500 mt-8 leading-relaxed">
            Stop losing opportunities due to language barriers. Learn to communicate complex architectures, lead sprints, and ace interviews in English.
          </p>
          <div className="flex gap-4 mt-10">
            <Button className="py-4 px-10 text-lg" onClick={() => navigate("/auth")}>Get Started</Button>
            <Button variant="outline" className="py-4 px-10 text-lg">Curriculum</Button>
          </div>
          <div className="mt-12 flex gap-8 items-center text-slate-400">
            <div className="flex items-center gap-2"><CheckCircle2 size={18} className="text-blue-500"/> Developer Focused</div>
            <div className="flex items-center gap-2"><CheckCircle2 size={18} className="text-blue-500"/> Native Mentors</div>
          </div>
        </div>
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
          <div className="relative bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-800">
             <div className="aspect-video flex items-center justify-center bg-slate-800/50">
                <Play className="w-16 h-16 text-blue-500 fill-blue-500 animate-pulse" />
             </div>
             <div className="p-6 bg-slate-900/90 backdrop-blur border-t border-slate-800">
                <p className="text-white font-bold">Course Preview: "Architecture Review in English"</p>
             </div>
          </div>
        </div>
      </header>
    </div>
  );
};

// --- 2. AUTH PAGE ---
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
      <div className="w-full max-w-md bg-white p-10 rounded-[2rem] shadow-xl border border-slate-100">
        <div className="text-center mb-8">
          <div className="bg-blue-600 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
            <Shield className="text-white" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900">Access Portal</h2>
          <p className="text-slate-400 mt-2">Professional Learning Environment</p>
        </div>
        
        <div className="space-y-4">
          <input type="email" placeholder="Work Email" className="w-full p-4 rounded-xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-blue-500 outline-none transition" onChange={e => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" className="w-full p-4 rounded-xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-blue-500 outline-none transition" onChange={e => setPassword(e.target.value)} />
          <Button className="w-full py-4 mt-4" onClick={() => handleAuth("login")} disabled={loading}>
            {loading ? "Verifying..." : "Sign In"}
          </Button>
          <button onClick={() => handleAuth("signup")} className="w-full text-slate-400 text-sm font-medium hover:text-blue-600 transition">Don't have an account? Sign up</button>
        </div>
      </div>
    </div>
  );
};

// --- 3. DASHBOARD (DYNAMIC ADMIN/STUDENT) ---
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
    <div className="min-h-screen bg-[#fcfdfe] flex">
      {/* Sidebar */}
      <aside className="w-72 bg-slate-900 p-8 flex flex-col text-slate-400">
        <div className="flex items-center gap-3 text-white font-bold text-xl mb-12">
          <div className="bg-blue-600 p-1.5 rounded-lg"><LayoutDashboard size={20} /></div>
          <span>Dimas<span className="text-blue-500">Panel</span></span>
        </div>
        
        <nav className="flex-1 space-y-2">
          <div className="bg-blue-600/10 text-blue-400 p-3 rounded-xl flex items-center gap-3 font-semibold cursor-pointer">
            <BookOpen size={20} /> My Learning
          </div>
          <div className="p-3 hover:bg-slate-800 rounded-xl flex items-center gap-3 transition cursor-pointer">
            <Clock size={20} /> Schedule
          </div>
          <div className="p-3 hover:bg-slate-800 rounded-xl flex items-center gap-3 transition cursor-pointer">
            <Trophy size={20} /> Certificates
          </div>

          {isAdmin && (
            <div className="mt-8 pt-8 border-t border-slate-800 space-y-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3">Management</span>
              <div className="p-3 text-blue-400 hover:bg-slate-800 rounded-xl flex items-center gap-3 transition cursor-pointer font-bold">
                <Users size={20} /> Students
              </div>
              <div className="p-3 text-emerald-400 hover:bg-slate-800 rounded-xl flex items-center gap-3 transition cursor-pointer font-bold">
                <DollarSign size={20} /> Revenue
              </div>
            </div>
          )}
        </nav>

        <button onClick={() => { supabase.auth.signOut(); navigate("/"); }} className="mt-auto p-4 flex items-center gap-3 text-slate-500 hover:text-red-400 transition font-bold">
          <LogOut size={20} /> Log Out
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-12 overflow-y-auto">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Welcome back, {isAdmin ? "Dimas" : "Student"}! 👋</h1>
            <p className="text-slate-500 mt-1">Today is a great day to master a new tech concept.</p>
          </div>
          <div className="flex items-center gap-4 bg-white p-2 pr-6 rounded-full shadow-sm border border-slate-100">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
              {user.email[0].toUpperCase()}
            </div>
            <div className="text-sm">
               <p className="font-bold text-slate-900">Active Profile</p>
               <p className="text-slate-400 text-xs">{user.email}</p>
            </div>
          </div>
        </header>

        {isAdmin ? (
          /* --- ADMIN DASHBOARD --- */
          <div className="space-y-8">
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                <Users className="text-blue-600 mb-4" size={32} />
                <h3 className="text-slate-500 font-medium">Total Students</h3>
                <p className="text-4xl font-black mt-2 text-slate-900">1,284</p>
              </div>
              <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                <DollarSign className="text-emerald-500 mb-4" size={32} />
                <h3 className="text-slate-500 font-medium">Monthly Revenue</h3>
                <p className="text-4xl font-black mt-2 text-slate-900">€14,250.00</p>
              </div>
              <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                <Star className="text-amber-500 mb-4" size={32} />
                <h3 className="text-slate-500 font-medium">Avg. Satisfaction</h3>
                <p className="text-4xl font-black mt-2 text-slate-900">4.9/5</p>
              </div>
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
               <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                  <h3 className="font-bold text-xl">Active Courses & Pricing</h3>
                  <Button className="text-sm"><Plus size={16}/> Create Course</Button>
               </div>
               <table className="w-full text-left">
                  <thead className="bg-white text-slate-400 text-xs uppercase font-bold">
                    <tr>
                      <th className="p-6">Course Name</th>
                      <th className="p-6">Students</th>
                      <th className="p-6">Pricing</th>
                      <th className="p-6 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {[
                      { name: "English for Backend Devs", students: 450, price: "€89.00" },
                      { name: "Architecture Review Masterclass", students: 120, price: "€149.00" },
                      { name: "Global Tech Interview Prep", students: 890, price: "€59.00" }
                    ].map((c, i) => (
                      <tr key={i} className="hover:bg-slate-50 transition">
                        <td className="p-6 font-bold text-slate-700">{c.name}</td>
                        <td className="p-6 text-slate-500">{c.students} active</td>
                        <td className="p-6 font-mono text-blue-600 font-bold">{c.price}</td>
                        <td className="p-6 text-right"><span className="text-emerald-500 font-bold text-sm">● Active</span></td>
                      </tr>
                    ))}
                  </tbody>
               </table>
            </div>
          </div>
        ) : (
          /* --- STUDENT DASHBOARD --- */
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
               <div className="bg-gradient-to-br from-blue-700 to-blue-500 p-10 rounded-[2.5rem] text-white relative overflow-hidden shadow-2xl shadow-blue-200">
                  <div className="relative z-10">
                    <h2 className="text-3xl font-bold">Level Up Your Career</h2>
                    <p className="mt-2 opacity-90 max-w-sm">You are 80% through the "Tech Interview Prep" course. Finish it this week!</p>
                    <Button variant="accent" className="mt-8 py-3 px-8 text-blue-700 bg-white hover:bg-slate-50">
                      <Play size={18} fill="currentColor" /> Resume Course
                    </Button>
                  </div>
                  <GraduationCap className="absolute right-[-20px] bottom-[-20px] w-64 h-64 text-white/10 -rotate-12" />
               </div>

               <h3 className="text-2xl font-bold text-slate-900">Current Progress</h3>
               <div className="grid sm:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[10px] font-black bg-blue-50 text-blue-600 px-2 py-1 rounded tracking-tighter uppercase">B2 Intermediate</span>
                      <span className="font-bold text-blue-600">85%</span>
                    </div>
                    <h4 className="font-bold text-lg mb-4">English for System Design</h4>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 w-[85%] rounded-full shadow-lg shadow-blue-200"></div>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[10px] font-black bg-emerald-50 text-emerald-600 px-2 py-1 rounded tracking-tighter uppercase">C1 Advanced</span>
                      <span className="font-bold text-emerald-600">12%</span>
                    </div>
                    <h4 className="font-bold text-lg mb-4">Leading Agile Sprints</h4>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 w-[12%] rounded-full"></div>
                    </div>
                  </div>
               </div>
            </div>

            <div className="space-y-6">
               <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                  <h3 className="font-bold text-lg mb-6 flex items-center gap-2"><Trophy className="text-amber-500" size={20}/> Achievement Unlocked</h3>
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center font-bold text-slate-400">#1</div>
                      <div><p className="font-bold text-sm">Sprint Leader</p><p className="text-xs text-slate-400">Led 5 mock rituals</p></div>
                    </div>
                    <div className="flex items-center gap-4 opacity-40">
                      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center font-bold text-slate-400">#2</div>
                      <div><p className="font-bold text-sm">Native Speaker</p><p className="text-xs text-slate-400">Unlock at level 10</p></div>
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

// --- ROUTER CONFIG ---
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
