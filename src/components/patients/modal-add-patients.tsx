"use client";
import { useState } from "react";
import { Button } from "../ui/button";
import {
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  Dialog,
  DialogContent,
  DialogClose,
} from "../ui/dialog";
import { AlertCircle, CalendarIcon, CheckCircle, Plus } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { PatientBody } from "@/models/patients/patient-model";
import { createPostFunction } from "@/lib/application-utils";
import { toast } from "sonner";

const formSchema = z.object({
  fullName: z.string().min(1, { message: "El nombre completo es requerido" }),
  document_type: z
    .string()
    .min(1, { message: "El tipo de documento es requerido" }),
  document: z.string().min(1, { message: "El documento es requerido" }),
  birth_date: z.date({
    message: "La fecha de nacimiento es requerida.",
  }),
  gender: z.string().min(1, { message: "El género es requerido" }),
  email: z.email({ message: "El email no es válido" }),
  phone: z.string().min(1, { message: "El teléfono es requerido" }),
});

export default function ModalAddPatients() {
  const [open, setOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const typesDocument = [
    {
      label: "Cédula de ciudadanía",
      value: "CC",
    },
    {
      label: "Cédula de extranjería",
      value: "CE",
    },
    {
      label: "Pasaporte",
      value: "PA",
    },
    {
      label: "Tarjeta de identidad",
      value: "TI",
    },
  ];

  const genders = [
    {
      label: "Masculino",
      value: "Masculino",
    },
    {
      label: "Femenino",
      value: "Femenino",
    },
    {
      label: "Otro",
      value: "Otro",
    },
  ];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      document_type: "",
      document: "",
      birth_date: undefined,
      gender: "",
      email: "",
      phone: "",
    },
    mode: "onChange",
  });

  function splitFullName(fullName: string) {
    const nameParts = fullName
      .trim()
      .split(" ")
      .filter((part) => part.length > 0);

    let first_name = "";
    let second_name: string | undefined = undefined;
    let first_last_name = "";
    let second_last_name: string | undefined = undefined;

    if (nameParts.length === 2) {
      first_name = nameParts[0];
      first_last_name = nameParts[1];
    } else if (nameParts.length === 3) {
      first_name = nameParts[0];
      second_name = nameParts[1];
      first_last_name = nameParts[2];
    } else if (nameParts.length >= 4) {
      first_name = nameParts[0];
      second_name = nameParts[1];
      first_last_name = nameParts[2];
      second_last_name = nameParts[3];
    } else if (nameParts.length === 1) {
      first_name = nameParts[0];
    }

    return {
      first_name,
      second_name,
      first_last_name,
      second_last_name,
    };
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formattedValues = {
      ...values,
      birth_date: values.birth_date
        ? format(values.birth_date, "yyyy-MM-dd")
        : "",
    };

    const { first_name, second_name, first_last_name, second_last_name } =
      splitFullName(formattedValues.fullName);

    const body: PatientBody = {
      first_name,
      second_name,
      first_last_name,
      second_last_name,
      document_type: formattedValues.document_type,
      document_number: formattedValues.document,
      birth_date: formattedValues.birth_date,
      gender: formattedValues.gender,
      email: formattedValues.email,
      phone: formattedValues.phone,
    };

    const response = await createPostFunction<PatientBody>("/patients")(body);

    if (!response) {
      toast("Error", {
        description:
          "Por favor, asegúrese de haber ingresado todos los campos correctamente, de lo contrario contacte a soporte.",
        icon: <AlertCircle className="h-4 w-4 text-amber-400" />,
      });
      return;
    }

    toast("Proceso exitoso", {
      description: "El registro se ha creado correctamente.",
      icon: <CheckCircle className="h-4 w-4 text-green-500" />,
    });

    form.reset();
    form.clearErrors();
    setOpen(false);
    setCalendarOpen(false);
  }

  const handleModalOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setCalendarOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleModalOpenChange}>
      <DialogTrigger asChild>
        <Button variant="default" size="lg" className="cursor-pointer">
          <Plus className="mr-2 h-4 w-4" />
          Agregar paciente
        </Button>
      </DialogTrigger>

      <DialogContent
        className={cn(
          "w-[min(95vw,500px)]",
          "max-h-[85dvh] sm:max-h-[90dvh]",
          "overflow-hidden",
          "flex flex-col"
        )}
      >
        <DialogHeader className="shrink-0">
          <DialogTitle className="text-2xl font-bold">
            Agregar paciente
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Completa la información del paciente y guarda los cambios.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col flex-1 min-h-0"
          >
            <div className="space-y-4 overflow-y-auto flex-1 pr-2 -mr-2 p-2">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre completo</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ingrese el nombre completo del paciente"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="document_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de documento</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Seleccione el tipo de documento" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Tipos de documento</SelectLabel>
                          {typesDocument.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
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
                      <Input
                        placeholder="Ingrese el documento del paciente"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Género</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Seleccione un género" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Géneros</SelectLabel>
                          {genders.map((gender) => (
                            <SelectItem key={gender.value} value={gender.value}>
                              {gender.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="birth_date"
                render={({ field }) => {
                  return (
                    <FormItem className="flex flex-col">
                      <FormLabel>Fecha de nacimiento</FormLabel>
                      <Popover
                        open={calendarOpen}
                        onOpenChange={setCalendarOpen}
                        modal={false}
                      >
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              type="button"
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "dd 'de' MMMM 'de' yyyy", {
                                  locale: es,
                                })
                              ) : (
                                <span>Selecciona la fecha de nacimiento</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>

                        <PopoverContent
                          onOpenAutoFocus={(e) => e.preventDefault()}
                          onInteractOutside={(e) => e.preventDefault()}
                          onPointerDownOutside={(e) => e.preventDefault()}
                          className="w-auto overflow-hidden p-0 z-[1000] pointer-events-auto bg-popover border shadow-md"
                          align="start"
                          sideOffset={6}
                        >
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(date) => {
                              if (date) {
                                field.onChange(date);
                                setCalendarOpen(false);
                              }
                            }}
                            disabled={(d) =>
                              d > new Date() || d < new Date("1900-01-01")
                            }
                            captionLayout="dropdown"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Ingrese el email del paciente"
                        {...field}
                      />
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
                      <Input
                        placeholder="Ingrese el teléfono del paciente"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="flex gap-2 justify-end shrink-0 mt-4 pt-4 border-t">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="cursor-pointer"
                  onClick={() => {
                    form.reset({
                      fullName: "",
                      document_type: "",
                      document: "",
                      birth_date: undefined,
                      gender: "",
                      email: "",
                      phone: "",
                    });
                    form.clearErrors();
                    setCalendarOpen(false);
                  }}
                >
                  Cancelar
                </Button>
              </DialogClose>
              <Button
                type="submit"
                variant="default"
                className="cursor-pointer"
              >
                Guardar cambios
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
