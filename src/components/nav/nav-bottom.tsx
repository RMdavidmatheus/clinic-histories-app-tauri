"use client";

import * as React from "react";
import { type Icon } from "@tabler/icons-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useEntityStore } from "@/lib/application-utils";
import { cn } from "@/lib/utils";

export function NavBottom({
  items,
  ...props
}: {
  items: {
    title: string;
    icon: Icon;
    visible: boolean;
  }[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const entity = useEntityStore((s) => s.entity);
  const setEntity = useEntityStore((state) => state.setEntity);

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const isActive = item.title === entity;

            return (
              <SidebarMenuItem key={item.title} className={item.visible ? "" : "hidden"}>
                <SidebarMenuButton
                  tooltip={item.title}
                  aria-current={isActive ? "page" : undefined}
                  className={
                    cn(
                      "transition-all duration-300 hover:scale-105 hover:cursor-pointer hover:bg-blue-500 hover:text-white",
                      isActive
                        ? "bg-blue-500/80 text-white"
                        : "hover:bg-blue-500 hover:text-white"
                    )
                  }
                  onClick={() => setEntity(item.title)}
                >
                  <item.icon />
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
