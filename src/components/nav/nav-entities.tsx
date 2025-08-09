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
import { cn } from "@/lib/utils";


export function NavEntities({
  items,
}: {
  items: {
    title: string
    icon?: Icon
  }[]
}) {

  const entity   = useEntityStore((s) => s.entity);
  const setEntity = useEntityStore((state) => state.setEntity);

  return (
    <SidebarGroup>
    <SidebarGroupContent className="flex flex-col gap-2">
      <SidebarMenu />
      <SidebarMenu>
        <SidebarGroupLabel>Entidades</SidebarGroupLabel>

        {items.map((item) => {
          const isActive = item.title === entity;

          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                onClick={() => setEntity(item.title)}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "transition-all duration-300 hover:scale-105 hover:cursor-pointer hover:bg-blue-500 hover:text-white",
                  isActive
                    ? "bg-blue-500/80 text-white"
                    : "hover:bg-blue-500 hover:text-white"
                )}
              >
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroupContent>
  </SidebarGroup>
  )
}
