import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Historias clinicas",
  description: "Proyecto de desarrollo de una aplicación para la gestión de historias clinicas en Colombia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="light">{children}</body>
    </html>
  );
}
