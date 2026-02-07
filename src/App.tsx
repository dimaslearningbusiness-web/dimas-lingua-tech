import { HashRouter, Routes, Route, useNavigate, Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"
import {
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Users,
  BookOpen,
  Check,
  Clock,
  Shield,
  FileText,
  Send,
} from "lucide-react"

const supabaseUrl = "https://tockiucmhkoxvauytzfq.supabase.co"
const supabaseAnonKey = "sb_publishable_W7SzJuYMbF9qN71OCH1nqw_YaWGI5WD"
const supabase = createClient(supabaseUrl, supabaseAnonKey)
const ADMIN_EMAIL = "dimaslearningbusiness@gmail.com"

// --------- HOOK DE AUTENTICAÇÃO + PERFIL ---------
const useAuthProfile = () => {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const { data } = await supabase.auth.getUser()
      const authUser = data.user
      setUser(authUser)

      if (authUser) {
        let { data: prof } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", authUser.id)
          .single()

        // criar perfil se não existir
        if (!prof) {
          const isAdmin = authUser.email === ADMIN_EMAIL
          const { data: inserted } = await supabase
            .from("profiles")
            .insert({
              id: authUser.id,
              email: authUser.email,
              role: isAdmin ? "admin" : "guest",
              status: isAdmin ? "active" : "pending", // guests começam pending
            })
            .select()
            .single()
          prof = inserted
        }

        setProfile(prof)
      }

      setLoading(false)
    }

    load()
  }, [])

  return { user, profile, loading }
}

// --------- PÁGINA PÚBLICA (HOME + CURSOS) ---------
const PublicHome = () => {
  const { user, profile } = useAuthProfile()
  const [courses, setCourses] = useState<any[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    const loadCourses = async () => {
      const { data } = await supabase.from("courses").select("*")
      setCourses(data || [])
    }
    loadCourses()
  }, [])

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({ provider: "google" })
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* NAVBAR */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Shield className="text-blue-500" />
          <span className="font-bold text-lg italic">DIMAS TECH</span>
        </div>
        <nav className="flex gap-4 text-sm">
          <a href="#home" className="hover:text-blue-400">
            Home
          </a>
          <a href="#courses" className="hover:text-blue-400">
            Cursos
          </a>
          {user && profile?.status === "active" && (
            <button
              onClick={() => navigate("/dashboard")}
              className="hover:text-blue-400"
            >
              Dashboard
            </button>
          )}
        </nav>
        <div>
          {!user ? (
            <button
              onClick={handleLogin}
              className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold"
            >
              Entrar
            </button>
          ) : (
            <button
              onClick={async () => {
                await supabase.auth.signOut()
                window.location.href = "/"
              }}
              className="text-sm text-red-400 flex items-center gap-1"
            >
              <LogOut size={16} /> Sair
            </button>
          )}
        </div>
      </header>

      {/* HERO */}
      <section
        id="home"
        className="px-8 py-16 flex flex-col md:flex-row items-center gap-10"
      >
        <div className="flex-1 space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Inglês Técnico para IT,{" "}
            <span className="text-blue-400">com acompanhamento 1:1</span>
          </h1>
          <p className="text-slate-300 text-sm md:text-base max-w-xl">
            Dimas Learning é uma plataforma criada especificamente para
            programadores, testers e profissionais de tecnologia que querem
            dominar o inglês técnico usado no dia a dia.
          </p>
          {!user && (
            <button
              onClick={handleLogin}
              className="mt-4 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold flex items-center gap-2"
            >
              <GraduationCap size={18} />
              Começar com Google
            </button>
          )}
          {user && profile?.status === "pending" && (
            <p className="mt-4 text-amber-400 text-sm">
              Conta criada. Aguarda a aprovação do Diretor Dimas para acederes
              ao Dashboard.
            </p>
          )}
        </div>
        <div className="flex-1 max-w-md bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
          <p className="text-sm font-semibold text-blue-400 mb-2">
            Roadmap personalizado
          </p>
          <p className="text-slate-200 text-sm">
            Acompanhamento individual, materiais personalizados e feedback
            direto sobre o teu inglês em contexto de IT.
          </p>
        </div>
      </section>

      {/* LISTA DE CURSOS */}
      <section id="courses" className="px-8 pb-16">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <BookOpen size={20} />
          Catálogo de Cursos
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {courses.map((c) => (
            <div
              key={c.id}
              className="bg-slate-900 border border-slate-800 p-6 rounded-2xl"
            >
              <h3 className="font-semibold text-lg">{c.title}</h3>
              <p className="text-slate-300 text-sm mt-2">
                {c.description || "Curso focado em comunicação técnica real."}
              </p>
            </div>
          ))}
          {courses.length === 0 && (
            <p className="text-slate-400 text-sm">
              Em breve cursos disponíveis. O Diretor está a preparar o conteúdo.
            </p>
          )}
        </div>
      </section>
    </div>
  )
}

// --------- DASHBOARD (ADMIN / ALUNO) ---------
const Dashboard = () => {
  const { user, profile, loading } = useAuthProfile()
  const [courses, setCourses] = useState<any[]>([])
  const [students, setStudents] = useState<any[]>([])
  const [enrollments, setEnrollments] = useState<any[]>([])
  const [materials, setMaterials] = useState<any[]>([])
  const [view, setView] = useState<"overview" | "students" | "requests" | "courses" | "materials">(
    "overview",
  )
  const [newCourse, setNewCourse] = useState({ title: "" })
  const [selectedStudentId, setSelectedStudentId] = useState<string>("")
  const [materialUrl, setMaterialUrl] = useState("")
  const [materialDesc, setMaterialDesc] = useState("")

  const navigate = useNavigate()
  const isAdmin = user?.email === ADMIN_EMAIL

  useEffect(() => {
    const loadData = async () => {
      if (!user) {
        navigate("/")
        return
      }

      // cursos (todos veem)
      const { data: c } = await supabase.from("courses").select("*")
      setCourses(c || [])

      if (isAdmin) {
        const { data: s } = await supabase.from("profiles").select("*")
        setStudents(s || [])

        const { data: e } = await supabase
          .from("enrollments")
          .select("*, courses(title), profiles(email)")
        setEnrollments(e || [])
      } else if (profile) {
        const { data: m } = await supabase
          .from("student_materials")
          .select("*")
          .eq("student_id", profile.id)
          .order("created_at", { ascending: false })
        setMaterials(m || [])
      }
    }

    if (!loading && user) {
      loadData()
    }
  }, [user, loading, isAdmin, profile, navigate])

  if (loading) {
    return (
      <div className="p-20 text-center font-bold">
        A ligar à base de dados real...
      </div>
    )
  }

  if (!user) {
    return <div className="p-10">Não autenticado.</div>
  }

  // Estado pending para guests
  if (!isAdmin && (!profile || profile.status === "pending")) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-10 text-center">
        <div className="max-w-md bg-white p-10 rounded-3xl shadow-xl">
          <Clock size={48} className="mx-auto text-amber-500 mb-4" />
          <h2 className="text-2xl font-bold">Conta em Verificação</h2>
          <p className="text-slate-500 mt-2">
            O Diretor Dimas recebeu o teu registo. Aguarda a ativação para
            acederes aos cursos.
          </p>
          <button
            onClick={() => supabase.auth.signOut().then(() => navigate("/"))}
            className="mt-6 text-blue-600 font-bold"
          >
            Sair
          </button>
        </div>
      </div>
    )
  }

  // funções admin
  const handleCreateCourse = async () => {
    if (!newCourse.title.trim()) return
    await supabase.from("courses").insert([{ title: newCourse.title }])
    setNewCourse({ title: "" })
    const { data: c } = await supabase.from("courses").select("*")
    setCourses(c || [])
  }

  const handleApproveProfile = async (id: string) => {
    await supabase
      .from("profiles")
      .update({ role: "student", status: "active" })
      .eq("id", id)
    const { data: s } = await supabase.from("profiles").select("*")
    setStudents(s || [])
  }

  const handleApproveEnrollment = async (id: string) => {
    await supabase
      .from("enrollments")
      .update({ status: "approved" })
      .eq("id", id)
    const { data: e } = await supabase
      .from("enrollments")
      .select("*, courses(title), profiles(email)")
    setEnrollments(e || [])
  }

  const handleSendMaterial = async () => {
    if (!selectedStudentId || !materialUrl.trim() || !materialDesc.trim()) return
    await supabase.from("student_materials").insert([
      {
        student_id: selectedStudentId,
        file_url: materialUrl,
        description: materialDesc,
      },
    ])
    setMaterialUrl("")
    setMaterialDesc("")
  }

  const studentPending = students.filter(
    (s) => s.role === "guest" && s.status === "pending",
  )
  const enrollmentPending = enrollments.filter((e) => e.status === "pending")

  // progresso simples por agora (podes ligar à tabela enrollments)
  const lessonsCompleted = profile?.lessons_completed || 0
  const totalLessons = profile?.total_lessons || 1
  const progress = Math.round((lessonsCompleted / totalLessons) * 100)

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans">
      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 p-6 text-slate-400 flex flex-col">
        <div className="text-white font-bold text-xl mb-10 flex items-center gap-2 italic">
          <Shield className="text-blue-500" /> DIMAS TECH
        </div>
        <nav className="space-y-2 flex-1">
          <button
            onClick={() => setView("overview")}
            className={`w-full text-left p-3 rounded-xl flex items-center gap-2 ${
              view === "overview" ? "bg-blue-600 text-white" : ""
            }`}
          >
            <LayoutDashboard size={18} /> Overview
          </button>
          <button
            onClick={() => setView("courses")}
            className={`w-full text-left p-3 rounded-xl flex items-center gap-2 ${
              view === "courses" ? "bg-blue-600 text-white" : ""
            }`}
          >
            <BookOpen size={18} /> Cursos
          </button>
          {isAdmin && (
            <>
              <button
                onClick={() => setView("students")}
                className={`w-full text-left p-3 rounded-xl flex items-center gap-2 ${
                  view === "students" ? "bg-blue-600 text-white" : ""
                }`}
              >
                <Users size={18} /> Alunos
              </button>
              <button
                onClick={() => setView("requests")}
                className={`w-full text-left p-3 rounded-xl flex items-center gap-2 ${
                  view === "requests" ? "bg-blue-600 text-white" : ""
                }`}
              >
                <Check size={18} /> Pedidos
              </button>
              <button
                onClick={() => setView("materials")}
                className={`w-full text-left p-3 rounded-xl flex items-center gap-2 ${
                  view === "materials" ? "bg-blue-600 text-white" : ""
                }`}
              >
                <FileText size={18} /> Materiais
              </button>
            </>
          )}
        </nav>
        <button
          onClick={() => supabase.auth.signOut().then(() => navigate("/"))}
          className="text-red-400 p-3 flex items-center gap-2 font-bold"
        >
          <LogOut size={18} /> Sair
        </button>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 p-10">
        {view === "overview" && (
          <div>
            <h1 className="text-3xl font-bold mb-8">Bem-vindo, {user.email}</h1>
            {!isAdmin && profile && (
              <div className="bg-white p-8 rounded-3xl border shadow-sm max-w-2xl">
                <div className="flex justify-between mb-2 font-bold">
                  <span>Progresso do Curso</span>
                  <span className="text-blue-600">
                    {lessonsCompleted} / {totalLessons} aulas
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 h-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="mt-4 text-sm text-slate-500">
                  Nível atual de inglês: {profile.english_level || "Por definir"}
                </p>

                <h3 className="font-bold mt-8 mb-4">Os Meus Materiais</h3>
                {materials.length === 0 ? (
                  <p className="text-slate-400 text-sm italic">
                    Nenhum material enviado ainda.
                  </p>
                ) : (
                  materials.map((m) => (
                    <a
                      key={m.id}
                      href={m.file_url}
                      target="_blank"
                      rel="noreferrer"
                      className="block p-3 bg-slate-50 rounded-lg mb-2 text-blue-600 underline text-sm"
                    >
                      {m.description}
                    </a>
                  ))
                )}
              </div>
            )}
            {isAdmin && (
              <div className="p-10 border-2 border-dashed rounded-3xl text-slate-400 text-center">
                Painel de Controlo Ativo. Seleciona uma opção no menu lateral.
              </div>
            )}
          </div>
        )}

        {view === "courses" && (
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Catálogo de Cursos</h2>
              {isAdmin && (
                <div className="bg-white p-4 rounded-xl border flex gap-2">
                  <input
                    placeholder="Título"
                    className="border p-2 rounded text-sm"
                    value={newCourse.title}
                    onChange={(e) =>
                      setNewCourse({ ...newCourse, title: e.target.value })
                    }
                  />
                  <button
                    onClick={handleCreateCourse}
                    className="bg-blue-600 text-white px-4 rounded text-sm"
                  >
                    Criar
                  </button>
                </div>
              )}
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {courses.map((c) => (
                <div
                  key={c.id}
                  className="bg-white p-6 rounded-2xl border shadow-sm"
                >
                  <h3 className="font-bold text-lg">{c.title}</h3>
                  <p className="text-slate-400 text-sm mt-2">
                    {c.description || "Sem descrição."}
                  </p>
                  {!isAdmin && (
                    <button className="mt-4 w-full bg-slate-900 text-white py-2 rounded-lg text-sm">
                      Solicitar Inscrição
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {isAdmin && view === "students" && (
          <section>
            <h2 className="text-2xl font-bold mb-4">Alunos</h2>
            <div className="bg-white rounded-3xl border shadow-sm p-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-400 border-b">
                    <th className="py-2">Email</th>
                    <th>Cargo</th>
                    <th>Status</th>
                    <th>Nível</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s) => (
                    <tr key={s.id} className="border-b last:border-0">
                      <td className="py-2">{s.email}</td>
                      <td>{s.role}</td>
                      <td>{s.status}</td>
                      <td>{s.english_level || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {isAdmin && view === "requests" && (
          <section className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">
                Pedidos de Admissão (Guests)
              </h2>
              <div className="bg-white rounded-3xl border shadow-sm p-6 space-y-2">
                {studentPending.length === 0 && (
                  <p className="text-sm text-slate-500">
                    Sem pedidos de admissão pendentes.
                  </p>
                )}
                {studentPending.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span>
                      {s.email}{" "}
                      <span className="text-slate-400">(guest)</span>
                    </span>
                    <button
                      onClick={() => handleApproveProfile(s.id)}
                      className="text-xs bg-emerald-500 text-white px-3 py-1 rounded-full flex items-center gap-1"
                    >
                      <Check size={14} /> Aprovar como Aluno
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">
                Pedidos de Inscrição em Cursos
              </h2>
              <div className="bg-white rounded-3xl border shadow-sm p-6 space-y-2">
                {enrollmentPending.length === 0 && (
                  <p className="text-sm text-slate-500">
                    Sem pedidos de inscrição pendentes.
                  </p>
                )}
                {enrollmentPending.map((e) => (
                  <div
                    key={e.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span>
                      {e.profiles?.email} pediu acesso a{" "}
                      <span className="font-semibold">
                        {e.courses?.title}
                      </span>
                    </span>
                    <button
                      onClick={() => handleApproveEnrollment(e.id)}
                      className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full flex items-center gap-1"
                    >
                      <Check size={14} /> Aprovar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {isAdmin && view === "materials" && (
          <section className="space-y-6">
            <h2 className="text-2xl font-bold mb-4">Gestão de Materiais</h2>
            <div className="bg-white rounded-3xl border shadow-sm p-6 space-y-4 max-w-xl">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold">Selecionar aluno</label>
                <select
                  className="border rounded p-2 text-sm"
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                >
                  <option value="">Escolhe um aluno</option>
                  {students
                    .filter((s) => s.role === "student" && s.status === "active")
                    .map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.email}
                      </option>
                    ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold">Link do ficheiro</label>
                <input
                  className="border rounded p-2 text-sm"
                  placeholder="URL do PDF / Vídeo / etc."
                  value={materialUrl}
                  onChange={(e) => setMaterialUrl(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold">
                  Descrição do material
                </label>
                <textarea
                  className="border rounded p-2 text-sm"
                  rows={3}
                  placeholder="Ex.: Exercícios de listening – Sprint 1"
                  value={materialDesc}
                  onChange={(e) => setMaterialDesc(e.target.value)}
                />
              </div>

              <button
                onClick={handleSendMaterial}
                className="mt-2 inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded text-sm"
              >
                <Send size={16} /> Enviar para o aluno
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

// --------- AUTENTICAÇÃO SIMPLES (PLACEHOLDER) ---------
const AuthComponent = () => {
  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({ provider: "google" })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-50">
      <div className="bg-slate-900 p-10 rounded-3xl max-w-md w-full border border-slate-800">
        <h1 className="text-2xl font-bold mb-4">Entrar na Dimas Learning</h1>
        <p className="text-sm text-slate-300 mb-6">
          Usa o teu email Google para aceder aos cursos personalizados de Inglês
          Técnico para IT.
        </p>
        <button
          onClick={handleLogin}
          className="w-full rounded-xl bg-blue-600 py-2 text-sm font-semibold flex items-center justify-center gap-2"
        >
          <GraduationCap size={18} />
          Entrar com Google
        </button>
      </div>
    </div>
  )
}

// --------- APP ROOT ---------
export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<PublicHome />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/auth" element={<AuthComponent />} />
      </Routes>
    </HashRouter>
  )
}
