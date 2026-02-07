import { useAuthProfile } from '@/hooks/useAuthProfile'
import AdminDashboardSupabase from '@/modules/admin/AdminDashboardSupabase'
import StudentDashboard from '@/modules/student/StudentDashboard'
import GuestPendingView from '@/modules/guest/GuestPendingView'

export default function DashboardPage() {
  const { loading, profile } = useAuthProfile()

  if (loading) return <div className="p-6">Loading...</div>

  // se não houver perfil, não renderiza nada "pesado"
  if (!profile) return <div className="p-6">Please sign in.</div>

  if (profile.role === 'admin') {
    return <AdminDashboardSupabase />
  }

  if (profile.role === 'student' && profile.status === 'active') {
    return <StudentDashboard />
  }

  if (profile.role === 'guest' && profile.status === 'pending') {
    return <GuestPendingView />
  }

  return <div className="p-6">Account not active. Contact support.</div>
}
