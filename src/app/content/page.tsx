"use client";

import { AppSidebar } from "@/components/nav/app-sidebar";
import { SiteHeader } from "@/components/header/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import DashboardComponent from "@/components/dashboard/dashboard-component";
import { useEntityStore } from "@/lib/application-utils";
import { AnimatePresence, motion } from "framer-motion";
import PatientsComponent from "@/components/patients/patients-component";
import ClinicHistoriesComponent from "@/components/clinic-histories/clinic-histories-component";

export default function Page() {
  const entity = useEntityStore((s) => s.entity);

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" className="transition-all duration-100" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={entity}
                initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -12, filter: "blur(6px)" }}
                transition={{ type: "spring", stiffness: 260, damping: 28 }}
                className="min-h-[200px]" 
              >
                {entity === "Inicio" ? (
                  <DashboardComponent />
                ) : entity === "Pacientes" ? (
                  <PatientsComponent />
                ) : entity === "Historias clínicas" ? (
                  <ClinicHistoriesComponent />
                ) : (
                  <div>No hay contenido</div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
