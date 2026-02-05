import { HashRouter, Routes, Route, Link } from "react-router-dom";

// Páginas simples para teste
const Home = () => (
  <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'sans-serif' }}>
    <h1>Dimas Learning Business</h1>
    <p>English for Tech Professionals</p>
    <nav>
      <Link to="/auth" style={{ margin: '10px' }}>Login</Link>
      <Link to="/admin" style={{ margin: '10px' }}>Admin</Link>
    </nav>
  </div>
);

const Auth = () => (
  <div style={{ textAlign: 'center', marginTop: '50px' }}>
    <h2>Login Page</h2>
    <p>Área de Acesso</p>
    <Link to="/">Voltar</Link>
  </div>
);

const Admin = () => (
  <div style={{ textAlign: 'center', marginTop: '50px' }}>
    <h2>Admin Dashboard</h2>
    <Link to="/">Sair</Link>
  </div>
);

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
