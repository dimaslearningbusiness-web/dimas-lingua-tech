import { HashRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";

// --- COMPONENTES DE ESTILO ---
const buttonStyle = {
  padding: '12px 24px',
  borderRadius: '8px',
  border: 'none',
  cursor: 'pointer',
  fontWeight: 'bold',
  transition: '0.3s'
};

// --- 1. FRONT PAGE (ESTILO PROFISSIONAL) ---
const Index = () => {
  const navigate = useNavigate();
  return (
    <div style={{ fontFamily: 'sans-serif', color: '#1a1a1a' }}>
      {/* Navbar */}
      <nav style={{ padding: '20px 50px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', borderBottom: '1px solid #eee' }}>
        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2563eb' }}>Dimas Learning Business</div>
        <button onClick={() => navigate("/auth")} style={{ ...buttonStyle, backgroundColor: '#2563eb', color: 'white' }}>Student Portal</button>
      </nav>

      {/* Hero Section */}
      <header style={{ padding: '100px 50px', textAlign: 'center', background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
        <h1 style={{ fontSize: '56px', marginBottom: '20px', maxWidth: '800px', margin: '0 auto 20px' }}>
          Master Technical English for the <span style={{ color: '#2563eb' }}>IT World</span>
        </h1>
        <p style={{ fontSize: '20px', color: '#64748b', maxWidth: '600px', margin: '0 auto 40px' }}>
          Exclusive training for developers and tech leaders who want to scale their global careers.
        </p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
          <button onClick={() => navigate("/auth")} style={{ ...buttonStyle, backgroundColor: '#2563eb', color: 'white', fontSize: '18px' }}>Get Started</button>
          <button style={{ ...buttonStyle, backgroundColor: 'white', color: '#2563eb', border: '2px solid #2563eb' }}>View Courses</button>
        </div>
      </header>
    </div>
  );
};

// --- 2. AUTH PAGE (LOGIN/REGISTO) ---
const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (type: "login" | "signup") => {
    setLoading(true);
    const { data, error } = type === "login" 
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });

    if (error) {
      alert(error.message);
    } else {
      if (type === "signup") alert("Account created! You can now login.");
      else navigate("/dashboard");
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f1f5f9', fontFamily: 'sans-serif' }}>
      <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Access Portal</h2>
        <input type="email" placeholder="Email" style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #ddd' }} onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" style={{ width: '100%', padding: '12px', marginBottom: '25px', borderRadius: '8px', border: '1px solid #ddd' }} onChange={e => setPassword(e.target.value)} />
        <button onClick={() => handleAuth("login")} disabled={loading} style={{ width: '100%', ...buttonStyle, backgroundColor: '#2563eb', color: 'white', marginBottom: '10px' }}>Login</button>
        <button onClick={() => handleAuth("signup")} disabled={loading} style={{ width: '100%', ...buttonStyle, backgroundColor: '#f8fafc', color: '#475569' }}>Register</button>
        <p onClick={() => navigate("/")} style={{ textAlign: 'center', marginTop: '20px', cursor: 'pointer', color: '#64748b' }}>Back to Home</p>
      </div>
    </div>
  );
};

// --- 3. DASHBOARD INTELIGENTE (ADMIN vs ALUNO) ---
const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const ADMIN_EMAIL = "dimaslearningbusiness@gmail.com";

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) navigate("/auth");
      else setUser(data.user);
    };
    getUser();
  }, [navigate]);

  if (!user) return <div style={{ padding: '50px', textAlign: 'center' }}>Loading...</div>;

  const isAdmin = user.email === ADMIN_EMAIL;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      {/* Sidebar */}
      <div style={{ width: '250px', backgroundColor: '#1e293b', color: 'white', padding: '30px' }}>
        <h3>Dimas App</h3>
        <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '40px' }}>{user.email}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ cursor: 'pointer' }}>My Lessons</div>
          <div style={{ cursor: 'pointer' }}>Schedule</div>
          {isAdmin && <div style={{ color: '#fbbf24', fontWeight: 'bold' }}>ADMIN: Student Management</div>}
          {isAdmin && <div style={{ color: '#fbbf24', fontWeight: 'bold' }}>ADMIN: Revenue</div>}
          <div onClick={async () => { await supabase.auth.signOut(); navigate("/"); }} style={{ marginTop: '50px', color: '#f87171', cursor: 'pointer' }}>Logout</div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '50px', backgroundColor: '#f8fafc' }}>
        <h1>{isAdmin ? "Admin Dashboard" : "Student Area"}</h1>
        <hr style={{ border: '0.5px solid #e2e8f0', margin: '20px 0' }} />
        
        {isAdmin ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <h3>Active Students</h3>
              <p style={{ fontSize: '32px', fontWeight: 'bold' }}>12</p>
            </div>
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <h3>Monthly Revenue</h3>
              <p style={{ fontSize: '32px', fontWeight: 'bold' }}>€1,200</p>
            </div>
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <h3>Pending Tasks</h3>
              <p style={{ fontSize: '32px', fontWeight: 'bold' }}>5</p>
            </div>
          </div>
        ) : (
          <div>
            <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <h3>Welcome to your course!</h3>
              <p>Your next lesson is scheduled for: <b>Monday at 18:00</b></p>
              <button style={{ ...buttonStyle, backgroundColor: '#2563eb', color: 'white', marginTop: '20px' }}>Join Zoom Lesson</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL ---
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
