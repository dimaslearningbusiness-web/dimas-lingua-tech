import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { Check } from "lucide-react"

type Profile = {
  id: string
  email: string
  role: "admin" | "student" | "guest"
  status: "pending" | "active" | "rejected" | null
  english_level: string | null
}

export default function AdminDashboardSupabase() {
  const [students, setStudents] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)

  const loadProfiles = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from("profiles")
      .select("id, email, role, status, english_level")
      .order("email", { ascending: true })

    if (!error && data) {
      setStudents(data as Profile[])
    }
    setLoading(false)
  }

  useEffect(() => {
    loadProfiles()
  }, [])

  const handleApproveProfile = async (id: string) => {
    await supabase
      .from("profiles")
      .update({ role: "student", status: "active" })
      .eq("id", id)
    await loadProfiles()
  }

  const handleChangeLevel = async (id: string, level: string | null) => {
    await supabase
      .from("profiles")
      .update({ english_level: level })
      .eq("id", id)
    await loadProfiles()
  }

  const pending = students.filter((s) => s.status === "pending")
  const all = students

  if (loading) {
    return <div className="p-6">Loading students...</div>
  }

  return (
    <div className="bg-red-600 text-white p-4 rounded">
  ADMIN DASHBOARD — FICHEIRO CERTO
</div>

    <div className="p-6 space-y-6">
      {/* Pending accounts */}
      <section className="bg-white rounded-3xl border shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-3">Pending accounts</h2>
        {pending.length === 0 ? (
          <p className="text-sm text-slate-500">No pending accounts.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {pending.map((s) => (
              <li
                key={s.id}
                className="flex items-center justify-between border-b last:border-0 py-2"
              >
                <span>
                  {s.email}{" "}
                  <span className="text-slate-400">({s.role})</span>
                </span>
                <button
                  onClick={() => handleApproveProfile(s.id)}
                  className="text-xs bg-emerald-500 text-white px-3 py-1 rounded-full flex items-center gap-1"
                >
                  <Check size={14} /> Approve as student
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* All profiles with level selector */}
      <section className="bg-white rounded-3xl border shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-3">All profiles</h2>
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
            {all.map((s) => (
              <tr key={s.id} className="border-b last:border-0">
                <td className="py-2">{s.email}</td>
                <td>{s.role}</td>
                <td>{s.status}</td>
                <td>
                  <select
                    className="border rounded px-2 py-1 text-xs"
                    value={s.english_level || ""}
                    onChange={(e) =>
                      handleChangeLevel(
                        s.id,
                        e.target.value === "" ? null : e.target.value,
                      )
                    }
                  >
                    <option value="">Not set</option>
                    <option value="A1">A1</option>
                    <option value="A2">A2</option>
                    <option value="B1">B1</option>
                    <option value="B2">B2</option>
                    <option value="C1">C1</option>
                    <option value="C2">C2</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}
