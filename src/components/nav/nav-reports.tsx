"use client"

import {
  type Icon,
} from "@tabler/icons-react"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useEntityStore } from "@/lib/application-utils"

export function NavReports({
  items,
}: {
  items: {
    name: string
    icon: Icon
  }[]
}) {

  const setEntity = useEntityStore((state) => state.setEntity);

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Reportes</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton title={item.name} className="hover:bg-blue-500 hover:cursor-pointer hover:text-white focus:bg-blue-500/90 focus:text-white transition-all duration-300 hover:scale-105" onClick={() => setEntity(item.name)}>
                <item.icon />
                <span>{item.name}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
