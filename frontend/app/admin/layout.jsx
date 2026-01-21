import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { AppAdminSidebar } from "@/components/admin/app-admin-sidebar"
import AdminAccessGuard from "@/components/admin/admin-access-guard"

export const metadata = {
  title: "Admin | SUJHAV",
}

export default function AdminLayout({ children }) {
  return (
    <SidebarProvider>
      <AppAdminSidebar />
      <SidebarInset>
        <AdminAccessGuard>
          <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b bg-background px-4">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-4 h-4" />
            <div className="font-medium">Admin</div>
          </header>
          <div className="flex-1 p-4">{children}</div>
        </AdminAccessGuard>
      </SidebarInset>
    </SidebarProvider>
  )
}