import * as React from "react"
import {
  IconChartBar,
  IconDashboard,
  IconFileDescription,
  IconInnerShadowTop,
  IconShield,
  IconUsers,
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth()
  
  const userData = {
    name: user?.fullName || "Uživatel",
    email: user?.email || "",
    avatar: "",
  }

  // Add admin menu item if user is admin
  const navMainItems = user?.role === "admin"
    ? [...navMain, {
        title: "Admin",
        url: "/dashboard/admin",
        icon: IconShield,
      }]
    : navMain;

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
        <NavMain items={navMainItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  )
}
