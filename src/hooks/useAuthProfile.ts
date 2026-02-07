// src/hooks/useAuthProfile.ts
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

type Role = 'admin' | 'student' | 'guest'

export function useAuthProfile() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        // se ainda não existir, cria como guest pending
        if (!profiles) {
          const role: Role = user.email === 'dimaslearningbusiness@gmail.com'
            ? 'admin'
            : 'guest'

          const { data: inserted } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              email: user.email,
              role,
              status: role === 'admin' ? 'active' : 'pending'
            })
            .select()
            .single()

          setProfile(inserted)
        } else {
          setProfile(profiles)
        }
      }

      setLoading(false)
    }

    load()
  }, [])

  return { loading, user, profile }
}
