"use client";

import { type Icon } from "@tabler/icons-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useEntityStore } from "@/lib/application-utils";
import { cn } from "@/lib/utils";

export function NavReports({
  items,
}: {
  items: {
    name: string;
    icon: Icon;
  }[];
}) {

  const entity   = useEntityStore((s) => s.entity);
  const setEntity = useEntityStore((state) => state.setEntity);

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Reportes</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isActive = item.name === entity;

          return (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton
              tooltip={item.name}
              aria-current={isActive ? "page" : undefined}
              className={
                cn(
                  "transition-all duration-300 hover:scale-105 hover:cursor-pointer hover:bg-blue-500 hover:text-white",
                  isActive
                    ? "bg-blue-500/80 text-white"
                    : "hover:bg-blue-500 hover:text-white"
                )
              }
              onClick={() => setEntity(item.name)}
            >
              <item.icon />
              <span>{item.name}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )})}
      </SidebarMenu>
    </SidebarGroup>
  );
}
