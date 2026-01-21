import DashboardAccessGuard from "@/components/dashboard-access-guard"
import DashboardNavbar from "@/components/dashboard-navbar"
import DashboardContent from "@/components/dashboard-content"
import TeacherDashboard from "@/components/teacher-dashboard/teacher-dashboard"
import Footer from "@/components/footer"
import { useEffect, useState } from "react"

export const metadata = {
  title: "Dashboard - SUJHAV Institute",
  description:
    "Dashboard for SUJHAV Institute students and teachers.",
}

export default function DashboardPage() {
  // We need to check role on client side since we're using localStorage/client-side auth for now
  // In a full next.js app with server auth, this could be done at middleware or server component level
  const [role, setRole] = useState(null)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    setRole(user.role)
  }, [])

  return (
    <DashboardAccessGuard>
      <div className="min-h-screen bg-black">
        <DashboardNavbar />
        {role === 'teacher' ? <TeacherDashboard /> : <DashboardContent />}
        <Footer />
      </div>
    </DashboardAccessGuard>
  )
}
