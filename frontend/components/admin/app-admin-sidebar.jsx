"use client"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Boxes,
  FileText,
  LineChart,
  MessageSquare,
  Image,
  Award,
  Star,
  ClipboardList,
  BarChart3,
  Brain,
  ShoppingBag,
  Download,
} from "lucide-react"

const nav = [
  { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { title: "Users", href: "/admin/users", icon: Users },
  { title: "Products", href: "/admin/products", icon: Boxes },
  { title: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { title: "Notes", href: "/admin/notes", icon: FileText },
  { title: "Contacts", href: "/admin/contacts", icon: MessageSquare },
  { title: "Gallery", href: "/admin/gallery", icon: Image },
  { title: "Achievements", href: "/admin/achievements", icon: Award },
  { title: "Reviews", href: "/admin/reviews", icon: Star },
  { title: "Tests", href: "/admin/tests", icon: ClipboardList },
  { title: "Test Results", href: "/admin/test-results", icon: BarChart3 },
  { title: "AI Analytics", href: "/admin/ai-analytics", icon: Brain },
  { title: "Cart Items", href: "/admin/cart-items", icon: ShoppingBag },
  { title: "Downloads", href: "/admin/downloads", icon: Download },
  { title: "Analytics", href: "/admin/analytics", icon: LineChart },
]

export function AppAdminSidebar() {
  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader>
        <div className="flex flex-col gap-0.5 px-4 py-2 min-w-0">
          <div className="font-bold text-sm">SUJHAV Admin</div>
          <div className="text-xs text-muted-foreground">Control Center</div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {nav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}