import { useAuthProfile } from '@/hooks/useAuthProfile'
import AdminDashboardSupabase from '@/modules/admin/AdminDashboardSupabase'
import StudentDashboard from '@/modules/student/StudentDashboard'
import GuestPendingView from '@/modules/guest/GuestPendingView'

export default function DashboardPage() {
  const { loading, profile } = useAuthProfile()

  if (loading) return <div className="p-6">A carregar...</div>

  if (!profile) return <div className="p-6">Por favor, faça login.</div>

  if (profile.role === 'admin') return <AdminDashboardSupabase />
  if (profile.role === 'student' && profile.status === 'active') return <StudentDashboard />
  if (profile.role === 'guest' && profile.status === 'pending') return <GuestPendingView />

  return <div className="p-6">Conta não ativa. Contacte o suporte.</div>
}
