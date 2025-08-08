"use client"

import * as React from "react"
import {
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react"

import { NavReports } from "@/components/nav/nav-reports"
import { NavEntities } from "@/components/nav/nav-entities"
import { NavBottom } from "@/components/nav/nav-bottom"
import { NavUser } from "@/components/nav/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { NavApplication } from "./nav-application"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navApplication: [
    {
      title: "Dashboard",
      icon: IconDashboard,
    },
  ],
  navEntities: [
    {
      title: "Lifecycle",
      icon: IconListDetails,
    },
    {
      title: "Analytics",
      icon: IconChartBar,
    },
    {
      title: "Projects",
      icon: IconFolder,
    },
    {
      title: "Team",
      icon: IconUsers,
    },
  ],
  navBottom: [
    {
      title: "Settings",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      icon: IconHelp,
    },
    {
      title: "Search",
      icon: IconSearch,
    },
  ],
  navReports: [
    {
      name: "Data Library",
      url: "#",
      icon: IconDatabase,
    },
    {
      name: "Reports",
      url: "#",
      icon: IconReport,
    },
    {
      name: "Word Assistant",
      url: "#",
      icon: IconFileWord,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Acme Inc.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavApplication />
        <NavEntities items={data.navEntities} />
        <NavReports items={data.navReports} />
        <NavBottom items={data.navBottom} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
