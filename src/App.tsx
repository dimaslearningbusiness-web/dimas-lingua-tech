import { HashRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "./lib/supabase";

// --- PÁGINA INICIAL (LANDING PAGE EM INGLÊS) ---
const Index = () => {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '48px', fontWeight: 'bold', color: '#1a1a1a', marginBottom: '10px' }}>
        Dimas <span style={{ color: '#2563eb' }}>Learning Business</span>
      </h1>
      <p style={{ fontSize: '20px', color: '#4b5563', maxWidth: '600px', marginBottom: '40px', lineHeight: '1.6' }}>
        Master Technical English for the IT Industry. Professional training for developers and global tech leaders.
      </p>
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button onClick={() => navigate("/auth")} style={{ padding: '15px 30px', fontSize: '18px', fontWeight: 'bold', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
          Student Portal
        </button>
        <button onClick={() => navigate("/auth")} style={{ padding: '15px 30px', fontSize: '18px', fontWeight: 'bold', backgroundColor: 'transparent', color: '#4b5563', border: '2px solid #d1d5db', borderRadius: '8px', cursor: 'pointer' }}>
          Admin Access
        </button>
      </div>
    </div>
  );
};

// --- PÁGINA DE LOGIN (AUTH) ---
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

    if (error) {
      alert("Error: " + error.message);
    } else {
      alert(type === "login" ? "Welcome back!" : "Account created!");
      navigate("/admin");
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f4f6', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ background: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>Access Portal</h2>
        <input type="email" placeholder="Email" style={{ width: '100%', padding: '12px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box' }} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" style={{ width: '100%', padding: '12px', marginBottom: '20px', border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box' }} onChange={(e) => setPassword(e.target.value)} />
        <button onClick={() => handleAuth("login")} disabled={loading} style={{ width: '100%', padding: '12px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '10px' }}>
          {loading ? "Loading..." : "Login"}
        </button>
        <button onClick={() => handleAuth("signup")} disabled={loading} style={{ width: '100%', padding: '12px', backgroundColor: '#e5e7eb', color: '#374151', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
          Create Account
        </button>
        <p onClick={() => navigate("/")} style={{ textAlign: 'center', marginTop: '20px', color: '#6b7280', cursor: 'pointer', textDecoration: 'underline' }}>Back to home</p>
      </div>
    </div>
  );
};

// --- PÁGINA ADMIN (DASHBOARD) ---
const Admin = () => (
  <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
    <h1>Admin Dashboard</h1>
    <p>Welcome to the management area.</p>
    <button onClick={() => window.location.hash = '/'} style={{ padding: '10px 20px', cursor: 'pointer' }}>Logout</button>
  </div>
);

// --- COMPONENTE PRINCIPAL (APP) ---
function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
