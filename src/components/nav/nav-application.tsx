"use client"

import { IconDashboard } from "@tabler/icons-react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useEntityStore } from "@/lib/application-utils";

export function NavApplication() {

  const setEntity = useEntityStore((state) => state.setEntity);

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
        </SidebarMenu>
        <SidebarMenu>
          <SidebarGroupLabel>Aplicación</SidebarGroupLabel>
            <SidebarMenuItem key="Home">
              <SidebarMenuButton tooltip="Home" className="hover:bg-blue-500 hover:cursor-pointer hover:text-white focus:bg-blue-500/90 focus:text-white transition-all duration-300 hover:scale-105" onClick={() => setEntity("Inicio")}>
                <IconDashboard />
                <span>Inicio</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
