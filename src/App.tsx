import { HashRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "./lib/supabase";

const Index = () => {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
      <h1>Dimas Learning Business</h1>
      <button onClick={() => navigate("/auth")} style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '5px' }}>
        Ir para Login
      </button>
    </div>
  );
};

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleAuth = async (type: "login" | "signup") => {
    const { error } = type === "login" 
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });

    if (error) alert(error.message);
    else {
      alert("Sucesso!");
      navigate("/admin");
    }
  };

  return (
    <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h2>Portal</h2>
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} style={{ display: 'block', margin: '10px auto', padding: '10px' }} />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} style={{ display: 'block', margin: '10px auto', padding: '10px' }} />
      <button onClick={() => handleAuth("login")}>Entrar</button>
      <button onClick={() => handleAuth("signup")}>Criar Conta</button>
    </div>
  );
};

const Admin = () => <h1>Admin Dashboard - Logado com sucesso!</h1>;

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
