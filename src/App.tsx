import { HashRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "./lib/supabase";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    // Tentamos logar com o utilizador que criaste manualmente
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      console.error("ERRO DETALHADO:", error);
      alert("Erro no Login: " + error.message);
    } else {
      alert("SUCESSO! Entraste na conta.");
      navigate("/admin");
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '50px', backgroundColor: '#e0f2fe', minHeight: '100vh', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#0369a1' }}>Teste de Login - Dimas Tech</h1>
      <p>Tenta entrar com o email que criaste manualmente no Supabase</p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px', margin: '0 auto' }}>
        <input 
          placeholder="Email" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          style={{ padding: '10px' }}
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          style={{ padding: '10px' }}
        />
        <button 
          onClick={handleLogin} 
          disabled={loading}
          style={{ padding: '10px', backgroundColor: '#0369a1', color: 'white', border: 'none', cursor: 'pointer' }}
        >
          {loading ? "A verificar..." : "ENTRAR AGORA"}
        </button>
      </div>
    </div>
  );
}

const Admin = () => (
  <div style={{ padding: '50px', textAlign: 'center' }}>
    <h1 style={{ color: 'green' }}>CONSEGUISTE!</h1>
    <p>Estás dentro do Dashboard.</p>
    <button onClick={() => window.location.reload()}>Sair</button>
  </div>
);

export default function Root() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </HashRouter>
  );
}
