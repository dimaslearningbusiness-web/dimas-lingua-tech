import { HashRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";

// --- COMPONENTE DE DIAGNÓSTICO ---
const DebugBar = () => {
  const url = import.meta.env.VITE_SUPABASE_URL || "MISSING";
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY || "MISSING";
  
  return (
    <div style={{ backgroundColor: '#000', color: '#fff', padding: '5px', fontSize: '10px', textAlign: 'center' }}>
      DEBUG: URL: {url.substring(0, 15)}... | KEY: {key.substring(0, 10)}... 
      {key === "MISSING" ? " ❌ KEYS NOT LOADED" : " ✅ KEYS LOADED"}
    </div>
  );
};

// --- PÁGINA INICIAL ---
const Index = () => {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <DebugBar />
      <h1 style={{ fontSize: '48px', fontWeight: 'bold', color: '#1a1a1a', marginBottom: '10px' }}>
        Dimas <span style={{ color: '#2563eb' }}>Learning Business</span>
      </h1>
      <p style={{ fontSize: '20px', color: '#4b5563', maxWidth: '600px', marginBottom: '40px', lineHeight: '1.6' }}>
        Master Technical English for the IT Industry.
      </p>
      <button onClick={() => navigate("/auth")} style={{ padding: '15px 30px', fontSize: '18px', fontWeight: 'bold', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
        Student Portal
      </button>
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
    try {
      const { data, error } = type === "login" 
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

      if (error) {
        console.error("Supabase Error Details:", error);
        alert(`Error (${error.status}): ${error.message}`);
      } else {
        alert(type === "login" ? "Welcome back!" : "Account created!");
        navigate("/admin");
      }
    } catch (err) {
      alert("System crash. Check console.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f4f6', fontFamily: 'sans-serif' }}>
      <DebugBar />
      <div style={{ background: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px', marginTop: '20px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Access Portal</h2>
        <input type="email" placeholder="Email" style={{ width: '100%', padding: '12px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '6px' }} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" style={{ width: '100%', padding: '12px', marginBottom: '20px', border: '1px solid #ddd', borderRadius: '6px' }} onChange={(e) => setPassword(e.target.value)} />
        <button onClick={() => handleAuth("login")} disabled={loading} style={{ width: '100%', padding: '12px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', marginBottom: '10px' }}>
          {loading ? "Logging in..." : "Login"}
        </button>
        <button onClick={() => handleAuth("signup")} disabled={loading} style={{ width: '100%', padding: '12px', backgroundColor: '#e5e7eb', color: '#374151', border: 'none', borderRadius: '6px', fontWeight: 'bold' }}>
          Create Account
        </button>
      </div>
    </div>
  );
};

// --- PÁGINA ADMIN ---
const Admin = () => (
  <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
    <h1>Admin Dashboard</h1>
    <p>Welcome!</p>
    <button onClick={() => window.location.hash = '/'} style={{ padding: '10px 20px' }}>Logout</button>
  </div>
);

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
