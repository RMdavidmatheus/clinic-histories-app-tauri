"use client";

import { useMemo, useState } from "react";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { Card, CardHeader, CardDescription, CardTitle, CardContent } from "../ui/card";
import { BarChart, XAxis, CartesianGrid, Bar } from "recharts";

export default function NewDates() {
  const data = useMemo(
    () => [
      { date: "Enero", patients: 5 },
      { date: "Febrero", patients: 10 },
      { date: "Marzo", patients: 15 },
      { date: "Abril", patients: 20 },
      { date: "Mayo", patients: 25 },
      { date: "Junio", patients: 30 },
      { date: "Julio", patients: 35 },
      { date: "Agosto", patients: 40 },
      { date: "Septiembre", patients: 45 },
      { date: "Octubre", patients: 50 },
      { date: "Noviembre", patients: 55 },
      { date: "Diciembre", patients: 60 },
    ],
    []
  );

  const chartConfig = {
    patients: { label: "Pacientes", color: "hsl(var(--chart-1))" },
    date: { label: "Fecha", color: "hsl(var(--chart-2))" },
  } satisfies ChartConfig;

  const [activeStat, setActiveStat] =
    useState<keyof typeof chartConfig>("patients");

  const totals = useMemo(
    () => ({
      patients: data.reduce((acc, curr) => acc + curr.patients, 0),
      date: data.length,
    }),
    [data]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Proximas consultas por mes</CardTitle>
        <CardDescription>En esta sección podrás ver el número de proximas consultas por mes.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-auto h-[130px] w-full">
          <BarChart accessibilityLayer data={data} margin={{ left: 0, right: 0 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={24}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[160px]"
                  nameKey="patients"
                  labelFormatter={(value) => `Fecha: ${value as string}`}
                />
              }
            />
            <Bar
              dataKey="patients"                  
              fill="#3B82F6"        
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
