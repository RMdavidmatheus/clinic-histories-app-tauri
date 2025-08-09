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
import NewDates from "./new-dates";

export default function DashboardCards() {
  return (
    <section className="grid grid-cols-4 gap-4 mt-10 h-full w-full">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Pacientes atendidos hoy</CardTitle>
          <CardDescription>En esta sección podrás ver el número de pacientes atendidos hoy.</CardDescription>
        </CardHeader>
        <CardContent className="p-2">
          <CharComponent />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Cantidad de proximas consultas</CardTitle>
          <CardDescription>En esta sección podrás ver el número de proximas consultas.</CardDescription>
        </CardHeader>
        <CardContent>
          <NewDates />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ingresos del día</CardTitle>
          <CardDescription>Card Description</CardDescription>
          <CardAction>Card Action</CardAction>
        </CardHeader>
        <CardContent>
          <p>Card Content</p>
        </CardContent>
        <CardFooter>
          <p>Card Footer</p>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notificaciones</CardTitle>
          <CardDescription>Card Description</CardDescription>
          <CardAction>Card Action</CardAction>
        </CardHeader>
        <CardContent>
          <p>Card Content</p>
        </CardContent>
        <CardFooter>
          <p>Card Footer</p>
        </CardFooter>
      </Card>
    </section>
  );
}
