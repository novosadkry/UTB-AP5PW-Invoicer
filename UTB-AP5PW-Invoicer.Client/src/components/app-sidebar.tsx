import * as React from "react"
import {
  IconChartBar,
  IconDashboard,
  IconFileDescription,
  IconInnerShadowTop,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useAuth } from "@/hooks/use-auth"

const navMain = [
  {
    title: "Přehled",
    url: "/dashboard",
    icon: IconDashboard,
  },
  {
    title: "Faktury",
    url: "/dashboard/invoices",
    icon: IconFileDescription,
  },
  {
    title: "Zákazníci",
    url: "/dashboard/customers",
    icon: IconUsers,
  },
  {
    title: "Reporty",
    url: "/dashboard/reports",
    icon: IconChartBar,
  },
]

const navSecondary = [
  {
    title: "Profil",
    url: "/dashboard/profile",
    icon: IconSettings,
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth()
  
  const userData = {
    name: user?.fullName || "Uživatel",
    email: user?.email || "",
    avatar: "",
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/dashboard">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Invoicer</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  )
}
