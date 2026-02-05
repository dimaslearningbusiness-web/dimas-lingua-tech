function App() {
  return (
    <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: 'blue' }}>Dimas Learning Business</h1>
      <p>Se estás a ver isto, o ecrã branco foi resolvido!</p>
      <hr />
      <div style={{ marginTop: '20px' }}>
        <button onClick={() => window.location.hash = '/auth'} style={{ padding: '10px 20px', cursor: 'pointer' }}>
          Testar Link Login
        </button>
      </div>
    </div>
  );
}

export default App;
