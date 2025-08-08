"use client";

import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useEntityStore } from "@/lib/application-utils";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

export function SiteHeader() {

  const entity = useEntityStore((state) => state.entity);
  const setEntity = useEntityStore((state) => state.setEntity);

  useEffect(() => {
    if (entity === null || entity === undefined || entity === "") {
      setEntity("Inicio");
    }
  }, [entity, setEntity]);

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <AnimatePresence mode="wait">
          <motion.h1
            key={entity}
            className="text-lg font-bold"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.3 }}
          >
            {entity}
          </motion.h1>
        </AnimatePresence>
      </div>
    </header>
  )
}
