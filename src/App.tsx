// ... (manteém os imports anteriores)

const Auth = () => {
  const [isRegister, setIsRegister] = useState(false); // Alternar entre Login e Registo
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleAuth = async () => {
    const { error } = isRegister 
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });

    if (error) alert("Error: " + error.message);
    else {
      alert(isRegister ? "Account created! Check your email." : "Welcome back!");
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-xl w-full max-w-md border">
        <h2 className="text-3xl font-bold text-center mb-8">{isRegister ? "Create Account" : "Access Portal"}</h2>
        <input type="email" placeholder="Email" className="w-full p-4 mb-4 bg-slate-50 border rounded-xl" onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" className="w-full p-4 mb-6 bg-slate-50 border rounded-xl" onChange={e => setPassword(e.target.value)} />
        <button onClick={handleAuth} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold">
          {isRegister ? "Register Now" : "Sign In"}
        </button>
        <p onClick={() => setIsRegister(!isRegister)} className="text-center mt-4 text-blue-600 cursor-pointer text-sm font-bold">
          {isRegister ? "Already have an account? Login" : "Don't have an account? Create one"}
        </p>
      </div>
    </div>
  );
};

const Dashboard = () => {
  // ... (código anterior do user e admin check)
  const [courses, setCourses] = useState<any[]>([]);
  const [newCourseTitle, setNewCourseTitle] = useState("");

  // Função para Admin criar curso
  const createCourse = async () => {
    const { data, error } = await supabase
      .from('courses')
      .insert([{ title: newCourseTitle, level: 'B2', price: 99 }])
      .select();
    
    if (error) alert(error.message);
    else {
      alert("Course created successfully!");
      setNewCourseTitle("");
      fetchCourses(); // Atualiza a lista
    }
  };

  const fetchCourses = async () => {
    const { data } = await supabase.from('courses').select('*');
    if (data) setCourses(data);
  };

  useEffect(() => { fetchCourses(); }, []);

  return (
    // ... (Estrutura do Dashboard)
    <main className="flex-1 p-12">
      {isAdmin && (
        <div className="mb-10 p-8 bg-white border rounded-[2rem] shadow-sm">
          <h3 className="font-bold mb-4 italic text-blue-600 underline">Admin: Add New Course</h3>
          <div className="flex gap-4">
            <input 
              value={newCourseTitle} 
              onChange={e => setNewCourseTitle(e.target.value)}
              placeholder="Course Name (e.g. English for DevOps)" 
              className="flex-1 p-3 border rounded-xl"
            />
            <button onClick={createCourse} className="bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-600">
              Create Course
            </button>
          </div>
        </div>
      )}
      
      {/* Listagem de Cursos */}
      <div className="grid grid-cols-1 gap-4">
        {courses.map(c => (
          <div key={c.id} className="p-6 bg-white border rounded-2xl flex justify-between items-center">
            <span className="font-bold text-slate-700">{c.title}</span>
            <span className="text-blue-600 font-mono">€{c.price}</span>
          </div>
        ))}
      </div>
    </main>
  );
};
