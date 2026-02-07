// src/modules/admin/AdminMaterials.tsx
import { supabase } from '@/lib/supabaseClient'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

export default function AdminMaterials() {
  const qc = useQueryClient()
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null)
  const [fileUrl, setFileUrl] = useState('')
  const [description, setDescription] = useState('')

  const { data: students } = useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email')
        .eq('role', 'student')
      if (error) throw error
      return data
    },
  })

  const { data: materials } = useQuery({
    queryKey: ['materials-by-student', selectedStudentId],
    enabled: !!selectedStudentId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('student_materials')
        .select('*')
        .eq('student_id', selectedStudentId!)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data
    },
  })

  const sendMaterial = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('student_materials').insert({
        student_id: selectedStudentId,
        file_url: fileUrl,
        description,
      })
      if (error) throw error
    },
    onSuccess: () => {
      setFileUrl('')
      setDescription('')
      qc.invalidateQueries({ queryKey: ['materials-by-student', selectedStudentId] })
    },
  })

  return (
    <section className="mt-8">
      <h2 className="text-xl font-semibold text-royal-500">Materiais para alunos</h2>

      <div className="mt-4 flex gap-4">
        <select
          className="rounded bg-slate-900 px-3 py-2 text-sm"
          value={selectedStudentId ?? ''}
          onChange={(e) => setSelectedStudentId(e.target.value || null)}
        >
          <option value="">Selecionar aluno</option>
          {students?.map((s: any) => (
            <option key={s.id} value={s.id}>
              {s.email}
            </option>
          ))}
        </select>
      </div>

      {selectedStudentId && (
        <div className="mt-4 space-y-3">
          <div className="space-y-2">
            <input
              className="w-full rounded bg-slate-900 px-3 py-2 text-sm"
              placeholder="Link do ficheiro (PDF, vídeo, etc.)"
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
            />
            <textarea
              className="w-full rounded bg-slate-900 px-3 py-2 text-sm"
              placeholder="Descrição do material"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <button
              className="rounded bg-royal-500 px-4 py-2 text-sm"
              onClick={() => sendMaterial.mutate()}
              disabled={!fileUrl || !description}
            >
              Enviar material
            </button>
          </div>

          <h3 className="mt-4 text-lg font-semibold">Histórico</h3>
          <ul className="space-y-2">
            {materials?.map((m: any) => (
              <li key={m.id} className="rounded bg-slate-900 p-3 text-sm">
                <p className="font-medium">{m.description}</p>
                <a
                  className="text-royal-400 underline"
                  href={m.file_url}
                  target="_blank"
                >
                  Abrir
                </a>
              </li>
            ))}
            {materials?.length === 0 && <p>Sem materiais enviados ainda.</p>}
          </ul>
        </div>
      )}
    </section>
  )
}
