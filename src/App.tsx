import { HashRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "./lib/supabase";

const Index = () => {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
      <h1>Dimas Learning Business</h1>
      <button onClick={() => navigate("/auth")} style={{ padding: '12px 24px', cursor: 'pointer', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '6px' }}>
        Aceder ao Portal
      </button>
    </div>
  );
};

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (type: "login" | "signup") => {
    setLoading(true);
    try {
      const { error } = type === "login" 
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

      if (error) {
        alert("Erro: " + error.message);
      } else {
        alert(type === "login" ? "Bem-vindo!" : "Conta criada! Já podes entrar.");
        if (type === "login") navigate("/admin");
      }
    } catch (e) {
      alert("Erro inesperado no sistema.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h2>Login / Registo</h2>
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} style={{ display: 'block', margin: '10px auto', padding: '10px', width: '250px' }} />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} style={{ display: 'block', margin: '10px auto', padding: '10px', width: '250px' }} />
      <div style={{ marginTop: '20px' }}>
        <button onClick={() => handleAuth("login")} disabled={loading} style={{ marginRight: '10px', padding: '10px' }}>Entrar</button>
        <button onClick={() => handleAuth("signup")} disabled={loading} style={{ padding: '10px' }}>Criar Conta</button>
      </div>
      <p onClick={() => navigate("/")} style={{ marginTop: '20px', cursor: 'pointer', color: 'blue' }}>Voltar</p>
    </div>
  );
};

const Admin = () => (
  <div style={{ padding: '40px', textAlign: 'center' }}>
    <h1 style={{ color: 'green' }}>Dashboard Ativo</h1>
    <button onClick={() => window.location.hash = '/'}>Sair</button>
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
