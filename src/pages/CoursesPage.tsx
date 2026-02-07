// src/pages/CoursesPage.tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabaseClient'
import { useAuthProfile } from '@/hooks/useAuthProfile'

export default function CoursesPage() {
  const { user, profile } = useAuthProfile()
  const qc = useQueryClient()

  const { data: courses } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const { data, error } = await supabase.from('courses').select('*')
      if (error) throw error
      return data
    },
  })

  const { data: myEnrollments } = useQuery({
    queryKey: ['my-enrollments', profile?.id],
    enabled: !!profile,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('enrollments')
        .select('*')
        .eq('student_id', profile!.id)
      if (error) throw error
      return data
    },
  })

  const requestEnroll = useMutation({
    mutationFn: async (courseId: number) => {
      const { error } = await supabase.from('enrollments').insert({
        student_id: profile!.id,
        course_id: courseId,
        status: 'pending',
        completed_lessons: 0,
      })
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-enrollments', profile?.id] })
    },
  })

  const getStatus = (courseId: number) =>
    myEnrollments?.find((e: any) => e.course_id === courseId)?.status

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-semibold text-royal-500">Cursos Disponíveis</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {courses?.map((c: any) => {
          const status = getStatus(c.id)
          return (
            <div key={c.id} className="rounded bg-slate-900 p-4">
              <h2 className="text-lg font-semibold">{c.title}</h2>
              <p className="text-sm text-slate-300">{c.description}</p>
              {user && profile?.status === 'active' ? (
                status ? (
                  <p className="mt-2 text-sm text-slate-300">Estado: {status}</p>
                ) : (
                  <button
                    className="mt-3 rounded bg-royal-500 px-3 py-1 text-sm"
                    onClick={() => requestEnroll.mutate(c.id)}
                  >
                    Pedir inscrição
                  </button>
                )
              ) : (
                <p className="mt-2 text-sm text-slate-400">
                  Faça login e aguarde aprovação para pedir inscrição.
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
