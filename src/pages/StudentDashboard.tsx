// src/modules/student/StudentDashboard.tsx
import { useAuthProfile } from '@/hooks/useAuthProfile'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabaseClient'
import { Progress } from '@/components/ui/progress' // shadcn

export default function StudentDashboard() {
  const { profile } = useAuthProfile()

  const { data: enrollments } = useQuery({
    queryKey: ['student-enrollments', profile?.id],
    enabled: !!profile,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('enrollments')
        .select('id, status, completed_lessons, courses(title, total_lessons)')
        .eq('student_id', profile!.id)
        .eq('status', 'approved')
      if (error) throw error
      return data
    },
  })

  const { data: materials } = useQuery({
    queryKey: ['student-materials', profile?.id],
    enabled: !!profile,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('student_materials')
        .select('*')
        .eq('student_id', profile!.id)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data
    },
  })

  return (
    <div className="p-6 space-y-8">
      <section>
        <h1 className="text-2xl font-semibold text-royal-500">
          Olá, {profile?.email}
        </h1>
        <p className="text-sm text-slate-300">
          Nível atual de Inglês: {profile?.english_level ?? 'Por definir'}
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Progresso nos cursos</h2>
        <div className="space-y-3">
          {enrollments?.map((e: any) => {
            const total = e.courses.total_lessons || 1
            const percent = Math.round((e.completed_lessons / total) * 100)
            return (
              <div key={e.id} className="rounded bg-slate-900 p-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>{e.courses.title}</span>
                  <span>{percent}%</span>
                </div>
                <Progress value={percent} />
              </div>
            )
          })}
          {enrollments?.length === 0 && <p>Ainda não tens cursos aprovados.</p>}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Materiais recebidos</h2>
        <ul className="space-y-2">
          {materials?.map((m: any) => (
            <li key={m.id} className="rounded bg-slate-900 p-3">
              <p className="font-medium">{m.description}</p>
              <a
                className="text-sm text-royal-400 underline"
                href={m.file_url}
                target="_blank"
              >
                Abrir ficheiro
              </a>
            </li>
          ))}
          {materials?.length === 0 && <p>Sem materiais ainda.</p>}
        </ul>
      </section>
    </div>
  )
}
