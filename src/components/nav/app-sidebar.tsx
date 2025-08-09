"use client"

import * as React from "react"
import {
  IconDatabase,
  IconHeartCog,
  IconUsers,
  IconPillFilled,
  IconCalendarDollar,
  IconReportAnalytics,
  IconUserCog,
  IconCalendar,
  IconHome
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
import Image from "next/image"

const data = {
  user: {
    name: "Marisol Parra Ricaurte",
    email: "marisolparra@gmail.com",
    avatar: "https://images.ctfassets.net/denf86kkcx7r/4IPlg4Qazd4sFRuCUHIJ1T/f6c71da7eec727babcd554d843a528b8/gatocomuneuropeo-97?fm=webp&w=913",
  },
  navApplication: [
    {
      title: "Inicio",
      icon: IconHome,
    },
  ],
  navEntities: [
    {
      title: "Pacientes",
      icon: IconUsers,
    },
    {
      title: "Historias clínicas",
      icon: IconHeartCog,
    },
    {
      title: "Medicamentos",
      icon: IconPillFilled,
    },
    {
      title: "Códigos diagnósticos",
      icon: IconDatabase,
    },
    {
      title: "Códigos cups",
      icon: IconDatabase,
    },
  ],
  navBottom: [
    {
      title: "Programar citas",
      icon: IconCalendar,
      visible: true,
    },
    {
      title: "Panel administrador",
      icon: IconUserCog,
      visible: false,
    },
  ],
  navReports: [
    {
      name: "Metrica de consultas",
      icon: IconReportAnalytics,
    },
    {
      name: "Metrica de pacientes",
      icon: IconReportAnalytics,
    },
    {
      name: "Metrica de ganancias",
      icon: IconCalendarDollar,
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
              className="data-[slot=sidebar-menu-button]:!p-1.5 hover:cursor-pointer transition-all duration-300 hover:scale-105 hover:rotate-1 h-auto"
            >
              <a href="/content">
                <Image src="/images/ico.png" alt="logo" width={50} height={50} className="rounded-lg" />
                <div className="flex flex-col">
                  <span className="text-xl font-bold">Historias clínicas</span>
                  <span className="text-md text-neutral-600 font-light">versión 0.1.0</span>
                </div>
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
