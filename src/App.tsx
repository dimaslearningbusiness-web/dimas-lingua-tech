import { HashRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { createClient } from '@supabase/supabase-js';
import { 
  GraduationCap, LayoutDashboard, LogOut, Users, 
  DollarSign, BookOpen, Play, Shield, Plus, Trash2, Trophy 
} from 'lucide-react';

// --- LIGAÇÃO SUPABASE ---
const supabaseUrl = 'https://tockiucmhkoxvauytzfq.supabase.co';
const supabaseAnonKey = 'sb_publishable_W7SzJuYMbF9qN71OCH1nqw_YaWGI5WD';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- COMPONENTE: LANDING PAGE ---
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
          <span className="bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-bold uppercase">Global Tech Careers</span>
          <h1 className="text-6xl font-extrabold leading-tight mt-4">Master <span className="text-blue-600">Technical English</span> for IT</h1>
          <p className="text-xl text-slate-500 mt-6 italic">Advance your global career with specialized language training for developers.</p>
          <button onClick={() => navigate("/auth")} className="mt-10 bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-bold shadow-lg shadow-blue-200">Start Your Journey</button>
        </div>
        <div className="bg-slate-900 aspect-video rounded-3xl shadow-2xl flex items-center justify-center relative group overflow-hidden">
          <Play size={64} className="text-blue-500 fill-blue-500 group-hover:scale-110 transition-transform" />
          <div className="absolute bottom-4 left-6 text-white/50 text-sm">Course Preview: Architecture Review</div>
        </div>
      </header>
    </div>
  );
};

// --- COMPONENTE: AUTH (LOGIN & REGISTER) ---
const Auth = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async () => {
    setLoading(true);
    const { error } = isRegister 
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });

    if (error) alert("Error: " + error.message);
    else {
      if (isRegister) alert("Account created! Check your email for confirmation.");
      else navigate("/dashboard");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 font-sans">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-xl w-full max-w-md border">
        <div className="bg-blue-600 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 text-white">
          <Shield />
        </div>
        <h2 className="text-3xl font-bold text-center mb-8">{isRegister ? "Create Account" : "Student Access"}</h2>
        <div className="space-y-4">
          <input type="email" placeholder="Work Email" className="w-full p-4 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" onChange={e => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" className="w-full p-4 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" onChange={e => setPassword(e.target.value)} />
          <button onClick={handleAuth} disabled={loading} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition">
            {loading ? "Processing..." : (isRegister ? "Register Now" : "Sign In")}
          </button>
          <p onClick={() => setIsRegister(!isRegister)} className="text-center mt-4 text-blue-600 cursor-pointer text-sm font-bold hover:underline">
            {isRegister ? "Already have an account? Login" : "Don't have an account? Create one"}
          </p>
        </div>
      </div>
    </div>
  );
};

// --- COMPONENTE: DASHBOARD ---
const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [newCourseTitle, setNewCourseTitle] = useState("");
  const [newCoursePrice, setNewCoursePrice] = useState("");
  const navigate = useNavigate();
  const ADMIN_EMAIL = "dimaslearningbusiness@gmail.com";

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) navigate("/auth");
      else setUser(data.user);
    });
    fetchCourses();
  }, [navigate]);

  const fetchCourses = async () => {
    const { data } = await supabase.from('courses').select('*').order('created_at', { ascending: false });
    if (data) setCourses(data);
  };

  const createCourse = async () => {
    if (!newCourseTitle) return;
    const { error } = await supabase.from('courses').insert([{ 
      title: newCourseTitle, 
      price: parseFloat(newCoursePrice) || 0,
      level: 'B2' 
    }]);
    
    if (error) alert(error.message);
    else {
      setNewCourseTitle("");
      setNewCoursePrice("");
      fetchCourses();
    }
  };

  const deleteCourse = async (id: string) => {
    const { error } = await supabase.from('courses').delete().eq('id', id);
    if (error) alert(error.message);
    else fetchCourses();
  };

  if (!user) return <div className="h-screen flex items-center justify-center font-bold text-blue-600">Authenticating...</div>;
  const isAdmin = user.email === ADMIN_EMAIL;

  return (
    <div className="min-h-screen bg-[#fcfdfe] flex font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-slate-900 p-8 text-slate-400 flex flex-col">
        <div className="text-white font-bold text-xl mb-12 flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-lg"><LayoutDashboard size={20} /></div>
          <span>Dimas Panel</span>
        </div>
        
        <nav className="flex-1 space-y-4 font-bold">
          <div className="text-blue-400 flex items-center gap-3 cursor-pointer"><BookOpen size={20}/> My Courses</div>
          <div className="hover:text-white flex items-center gap-3 cursor-pointer transition"><Trophy size={20}/> Certificates</div>
          
          {isAdmin && (
            <div className="pt-8 mt-8 border-t border-slate-800 space-y-4">
              <p className="text-[10px] uppercase tracking-widest text-slate-600">Administration</p>
              <div className="text-emerald-400 flex items-center gap-3 cursor-pointer"><DollarSign size={20}/> Revenue</div>
              <div className="text-amber-400 flex items-center gap-3 cursor-pointer"><Users size={20}/> Students</div>
            </div>
          )}
        </nav>

        <button onClick={() => { supabase.auth.signOut(); navigate("/"); }} className="mt-auto flex items-center gap-2 text-red-400 font-bold hover:text-red-300 transition">
          <LogOut size={20} /> Sign Out
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-12 overflow-y-auto">
        <header className="mb-12">
          <h1 className="text-3xl font-extrabold text-slate-900">Welcome, {isAdmin ? "Director Dimas" : "Student"}! 👋</h1>
          <p className="text-slate-500 mt-1">Logged in as: <span className="font-bold">{user.email}</span></p>
        </header>

        {/* Section: Admin Tools */}
        {isAdmin && (
          <div className="mb-10 bg-white p-8 rounded-[2rem] border shadow-sm border-blue-100">
            <h3 className="text-blue-600 font-bold mb-4 flex items-center gap-2"><Plus size={18}/> Management: Add New Course</h3>
            <div className="flex gap-4">
              <input value={newCourseTitle} onChange={e => setNewCourseTitle(e.target.value)} placeholder="Course Title (e.g. English for DevOps)" className="flex-1 p-4 bg-slate-50 border rounded-xl" />
              <input value={newCoursePrice} onChange={e => setNewCoursePrice(e.target.value)} placeholder="Price €" className="w-32 p-4 bg-slate-50 border rounded-xl" />
              <button onClick={createCourse} className="bg-blue-600 text-white px-8 rounded-xl font-bold hover:bg-blue-700 transition">Create</button>
            </div>
          </div>
        )}

        {/* Section: Courses List */}
        <h3 className="text-xl font-bold text-slate-900 mb-6">{isAdmin ? "Current Catalog" : "My Learning Path"}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.length > 0 ? courses.map((course) => (
            <div key={course.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition flex justify-between items-center">
              <div>
                <h4 className="font-bold text-lg text-slate-800">{course.title}</h4>
                <p className="text-slate-400 text-sm">Level: {course.level || 'B2'}</p>
              </div>
              <div className="flex items-center gap-6">
                <span className="text-blue-600 font-black text-xl">€{course.price}</span>
                {isAdmin ? (
                  <button onClick={() => deleteCourse(course.id)} className="text-slate-300 hover:text-red-500 transition">
                    <Trash2 size={20} />
                  </button>
                ) : (
                  <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold">Start</button>
                )}
              </div>
            </div>
          )) : (
            <div className="col-span-2 py-20 text-center text-slate-400 bg-white rounded-3xl border border-dashed">
              No courses found. {isAdmin && "Add your first course above!"}
            </div>
          )}
        </div>
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
