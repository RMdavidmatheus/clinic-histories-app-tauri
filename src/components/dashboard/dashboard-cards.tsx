import {
  Card,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import CharComponent from "./char-component";
import MoneyChar from "./money-char";

export default function DashboardCards() {
  return (
    <section className="grid grid-cols-2 gap-4 mt-10 h-full w-full">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Pacientes atendidos hoy</CardTitle>
          <CardDescription>En esta sección podrás ver el número de pacientes atendidos hoy.</CardDescription>
        </CardHeader>
        <CardContent className="py-5">
          <CharComponent />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Ingresos del día</CardTitle>
          <CardDescription>Recaudado por el consultorio el dia de hoy.</CardDescription>
        </CardHeader>
        <CardContent>
          <MoneyChar />
        </CardContent>
        </Card>
    </section>
  );
}
