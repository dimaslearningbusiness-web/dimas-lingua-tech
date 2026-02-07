import { HashRouter, Routes, Route, useNavigate } from "react-router-dom"
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

// IMPORTANT: adjust this later to your GitHub Pages URL
const REDIRECT_URL = window.location.origin + window.location.pathname

// --------- AUTH + PROFILE HOOK ---------
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

        if (!prof) {
          const isAdmin = authUser.email === ADMIN_EMAIL
          const { data: inserted } = await supabase
            .from("profiles")
            .insert({
              id: authUser.id,
              email: authUser.email,
              role: isAdmin ? "admin" : "guest",
              status: isAdmin ? "active" : "pending",
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

// --------- PUBLIC HOME (HOME + COURSES) ---------
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
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: REDIRECT_URL },
    })
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
            Courses
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
              Sign in
            </button>
          ) : (
            <button
              onClick={async () => {
                await supabase.auth.signOut()
                window.location.href = "/"
              }}
              className="text-sm text-red-400 flex items-center gap-1"
            >
              <LogOut size={16} /> Sign out
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
            Technical English for IT,{" "}
            <span className="text-blue-400">with 1:1 mentoring</span>
          </h1>
          <p className="text-slate-300 text-sm md:text-base max-w-xl">
            Dimas Learning is a platform built for developers, testers, and IT
            professionals who want to master the real technical English used in
            the industry.
          </p>
          {!user && (
            <button
              onClick={handleLogin}
              className="mt-4 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold flex items-center gap-2"
            >
              <GraduationCap size={18} />
              Start with Google
            </button>
          )}
          {user && profile?.status === "pending" && (
            <p className="mt-4 text-amber-400 text-sm">
              Your account was created. Please wait for Director Dimas to approve
              your access to the Dashboard.
            </p>
          )}
        </div>
        <div className="flex-1 max-w-md bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
          <p className="text-sm font-semibold text-blue-400 mb-2">
            Personalized roadmap
          </p>
          <p className="text-slate-200 text-sm">
            1:1 mentoring, custom materials, and direct feedback on your English
            in real IT contexts.
          </p>
        </div>
      </section>

      {/* COURSE LIST */}
      <section id="courses" className="px-8 pb-16">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <BookOpen size={20} />
          Course catalogue
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {courses.map((c) => (
            <div
              key={c.id}
              className="bg-slate-900 border border-slate-800 p-6 rounded-2xl"
            >
              <h3 className="font-semibold text-lg">{c.title}</h3>
              <p className="text-slate-300 text-sm mt-2">
                {c.description || "Technical English with real-world IT scenarios."}
              </p>
            </div>
          ))}
          {courses.length === 0 && (
            <p className="text-slate-400 text-sm">
              Courses coming soon. The director is preparing the content.
            </p>
          )}
        </div>
      </section>
    </div>
  )
}

// --------- DASHBOARD (ADMIN / STUDENT) ---------
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
        Connecting to the real database...
      </div>
    )
  }

  if (!user) {
    return <div className="p-10">Not authenticated.</div>
  }

  if (!isAdmin && (!profile || profile.status === "pending")) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-10 text-center">
        <div className="max-w-md bg-white p-10 rounded-3xl shadow-xl">
          <Clock size={48} className="mx-auto text-amber-500 mb-4" />
          <h2 className="text-2xl font-bold">Account under review</h2>
          <p className="text-slate-500 mt-2">
            Director Dimas has received your registration. Please wait until your
            account is activated to access the courses.
          </p>
          <button
            onClick={() => supabase.auth.signOut().then(() => navigate("/"))}
            className="mt-6 text-blue-600 font-bold"
          >
            Sign out
          </button>
        </div>
      </div>
    )
  }

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
            <BookOpen size={18} /> Courses
          </button>
          {isAdmin && (
            <>
              <button
                onClick={() => setView("students")}
                className={`w-full text-left p-3 rounded-xl flex items-center gap-2 ${
                  view === "students" ? "bg-blue-600 text-white" : ""
                }`}
              >
                <Users size={18} /> Students
              </button>
              <button
                onClick={() => setView("requests")}
                className={`w-full text-left p-3 rounded-xl flex items-center gap-2 ${
                  view === "requests" ? "bg-blue-600 text-white" : ""
                }`}
              >
                <Check size={18} /> Requests
              </button>
              <button
                onClick={() => setView("materials")}
                className={`w-full text-left p-3 rounded-xl flex items-center gap-2 ${
                  view === "materials" ? "bg-blue-600 text-white" : ""
                }`}
              >
                <FileText size={18} /> Materials
              </button>
            </>
          )}
        </nav>
        <button
          onClick={() => supabase.auth.signOut().then(() => navigate("/"))}
          className="text-red-400 p-3 flex items-center gap-2 font-bold"
        >
          <LogOut size={18} /> Sign out
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-10">
        {view === "overview" && (
          <div>
            <h1 className="text-3xl font-bold mb-8">Welcome, {user.email}</h1>
            {!isAdmin && profile && (
              <div className="bg-white p-8 rounded-3xl border shadow-sm max-w-2xl">
                <div className="flex justify-between mb-2 font-bold">
                  <span>Course progress</span>
                  <span className="text-blue-600">
                    {lessonsCompleted} / {totalLessons} lessons
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 h-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="mt-4 text-sm text-slate-500">
                  Current English level: {profile.english_level || "Not set yet"}
                </p>

                <h3 className="font-bold mt-8 mb-4">My materials</h3>
                {materials.length === 0 ? (
                  <p className="text-slate-400 text-sm italic">
                    No materials received yet.
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
                Admin control panel active. Choose an option from the sidebar.
              </div>
            )}
          </div>
        )}

        {view === "courses" && (
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Course catalogue</h2>
              {isAdmin && (
                <div className="bg-white p-4 rounded-xl border flex gap-2">
                  <input
                    placeholder="Title"
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
                    Create
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
                    {c.description || "No description."}
                  </p>
                  {!isAdmin && (
                    <button className="mt-4 w-full bg-slate-900 text-white py-2 rounded-lg text-sm">
                      Request enrollment
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {isAdmin && view === "students" && (
          <section>
            <h2 className="text-2xl font-bold mb-4">Students</h2>
            <div className="bg-white rounded-3xl border shadow-sm p-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-400 border-b">
                    <th className="py-2">Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Level</th>
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
                Admission requests (guests)
              </h2>
              <div className="bg-white rounded-3xl border shadow-sm p-6 space-y-2">
                {studentPending.length === 0 && (
                  <p className="text-sm text-slate-500">
                    No admission requests pending.
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
                      <Check size={14} /> Approve as student
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">
                Course enrollment requests
              </h2>
              <div className="bg-white rounded-3xl border shadow-sm p-6 space-y-2">
                {enrollmentPending.length === 0 && (
                  <p className="text-sm text-slate-500">
                    No course enrollment requests pending.
                  </p>
                )}
                {enrollmentPending.map((e) => (
                  <div
                    key={e.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span>
                      {e.profiles?.email} requested access to{" "}
                      <span className="font-semibold">
                        {e.courses?.title}
                      </span>
                    </span>
                    <button
                      onClick={() => handleApproveEnrollment(e.id)}
                      className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full flex items-center gap-1"
                    >
                      <Check size={14} /> Approve
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {isAdmin && view === "materials" && (
          <section className="space-y-6">
            <h2 className="text-2xl font-bold mb-4">Learning materials</h2>
            <div className="bg-white rounded-3xl border shadow-sm p-6 space-y-4 max-w-xl">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold">Select student</label>
                <select
                  className="border rounded p-2 text-sm"
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                >
                  <option value="">Choose a student</option>
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
                <label className="text-sm font-semibold">File link</label>
                <input
                  className="border rounded p-2 text-sm"
                  placeholder="URL of PDF / video / etc."
                  value={materialUrl}
                  onChange={(e) => setMaterialUrl(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold">Material description</label>
                <textarea
                  className="border rounded p-2 text-sm"
                  rows={3}
                  placeholder="e.g. Listening practice – Sprint 1"
                  value={materialDesc}
                  onChange={(e) => setMaterialDesc(e.target.value)}
                />
              </div>

              <button
                onClick={handleSendMaterial}
                className="mt-2 inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded text-sm"
              >
                <Send size={16} /> Send to student
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

// --------- AUTH PAGE (OPTIONAL ROUTE) ---------
const AuthComponent = () => {
  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: REDIRECT_URL },
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-50">
      <div className="bg-slate-900 p-10 rounded-3xl max-w-md w-full border border-slate-800">
        <h1 className="text-2xl font-bold mb-4">Sign in to Dimas Learning</h1>
        <p className="text-sm text-slate-300 mb-6">
          Use your Google account to access your personalized Technical English
          coaching.
        </p>
        <button
          onClick={handleLogin}
          className="w-full rounded-xl bg-blue-600 py-2 text-sm font-semibold flex items-center justify-center gap-2"
        >
          <GraduationCap size={18} />
          Sign in with Google
        </button>
      </div>
    </div>
  )
}

// --------- ROOT APP ---------
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
