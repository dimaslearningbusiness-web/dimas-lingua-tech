import { HashRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "./lib/supabase";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const testAuth = async () => {
    // ESTE TESTE VAI DIZER-NOS O ERRO REAL NA CONSOLA
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      console.log("DETALHE DO ERRO:", error);
      alert("ERRO SUPABASE: " + error.message);
    } else {
      alert("CONTA CRIADA! Verifica o painel do Supabase.");
    }
  };

  return (
    <div style={{ padding: '50px', backgroundColor: '#ffefef', minHeight: '100vh', textAlign: 'center' }}>
      <h1 style={{ color: 'red' }}>TESTE DE EMERGÊNCIA V3</h1>
      <p>Se vês este fundo rosa, o site atualizou!</p>
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Pass" onChange={e => setPassword(e.target.value)} />
      <button onClick={testAuth}>FORÇAR REGISTO</button>
    </div>
  );
}

export default function Root() {
  return <HashRouter><Routes><Route path="*" element={<App />} /></Routes></HashRouter>;
}
