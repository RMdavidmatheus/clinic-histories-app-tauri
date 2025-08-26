"use client";
import { useState } from "react";
import { Button } from "../ui/button";
import {
  DialogFooter, DialogHeader, DialogTitle, DialogDescription,
  DialogTrigger, Dialog, DialogContent, DialogClose
} from "../ui/dialog";
import { Plus } from "lucide-react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  fullName: z.string().min(1, { message: "El nombre completo es requerido" }),
  document: z.string().min(1, { message: "El documento es requerido" }),
  email: z.email({ message: "El email no es válido" }),
  phone: z.string().min(1, { message: "El teléfono es requerido" }),
});

export default function ModalAddClinicHistories() {
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      document: "",
      email: "",
      phone: "",
    },
    mode: "onChange",
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    alert("Guardando paciente...");
    console.log(values);

    form.reset();
    form.clearErrors();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="lg" className="cursor-pointer">
          <Plus className="mr-2 h-4 w-4" />
          Agregar historia clínica
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] max-h-[90vh] sm:max-h-none flex flex-col">
        <DialogHeader className="shrink-0">
          <DialogTitle className="text-2xl font-bold">Agregar historia clínica</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Completa la información de la historia clínica y guarda los cambios.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 min-h-0">
            <div className="space-y-4 overflow-y-auto flex-1 pr-2 -mr-2">

            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Juan Pérez" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="document"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Documento</FormLabel>
                  <FormControl>
                    <Input placeholder="CC 1234567890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="correo@ejemplo.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono</FormLabel>
                  <FormControl>
                    <Input placeholder="+57 300 000 0000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            </div>

            <DialogFooter className="flex gap-2 justify-end shrink-0 mt-4 pt-4 border-t">
              <DialogClose asChild>
                <Button type="button" variant="outline" className="cursor-pointer">Cancelar</Button>
              </DialogClose>
              <Button type="submit" variant="default" className="cursor-pointer">Guardar cambios</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
