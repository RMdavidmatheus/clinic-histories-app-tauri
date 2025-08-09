import Image from "next/image";
import DashboardCards from "./dashboard-cards";
import Link from "next/link";

export default function DashboardComponent() {
  return (
    <section className="flex flex-col p-5 h-full">
      <div className="flex justify-center items-center w-full">
        <Image
          src="/images/image_index.png"
          alt="dashboard"
          width={250}
          height={250}
        />
      </div>
      <div className="flex flex-col gap-3 w-full items-center justify-center mt-10">
        <h1 className="text-5xl font-semibold">
          Bienvenido al sistema de historias clínicas
        </h1>
        <p className="text-lg text-neutral-500 justify-center items-center text-center">
          Este sistema es una herramienta que te ayudará a gestionar tus
          pacientes, citas, historias clínicas y demás.
          <br />
          Si deseas conocer más sobre nosotros y nuestro trabajo, haz click en el siguiente <Link href="https://portafolio-page-gamma.vercel.app/" target="_blank" className="hover:text-blue-400 text-blue-500 text-xl">enlace.</Link>
        </p>
      </div>
      <DashboardCards />
    </section>
  );
}
