import './index.css';

function App() {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column',
      fontFamily: 'sans-serif'
    }}>
      <h1>Dimas Learning Business</h1>
      <p>O site está a carregar corretamente!</p>
      <button onClick={() => window.location.href += 'admin'}>Ir para Admin</button>
    </div>
  );
}

export default App;
