"use client"

import { type Icon } from "@tabler/icons-react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useEntityStore } from "@/lib/application-utils";


export function NavEntities({
  items,
}: {
  items: {
    title: string
    icon?: Icon
  }[]
}) {

  const setEntity = useEntityStore((state) => state.setEntity);

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
        </SidebarMenu>
        <SidebarMenu>
          <SidebarGroupLabel>Entidades</SidebarGroupLabel>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton tooltip={item.title} className="hover:bg-blue-500 hover:cursor-pointer hover:text-white focus:bg-blue-500/90 focus:text-white transition-all duration-300 hover:scale-105" onClick={() => setEntity(item.title)}>
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
