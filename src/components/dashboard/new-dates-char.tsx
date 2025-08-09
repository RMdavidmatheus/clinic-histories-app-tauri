"use client";

import { useMemo } from "react";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { Card, CardHeader, CardDescription, CardTitle, CardContent } from "../ui/card";
import { BarChart, XAxis, CartesianGrid, Bar } from "recharts";

export default function NewDatesChar() {
  const data = useMemo(
    () => [
      { date: "Agosto", patients: 5 },
      { date: "Septiembre", patients: 10 },
      { date: "Octubre", patients: 15 },
    ],
    []
  );

  const chartConfig = {
    patients: { label: "Pacientes", color: "hsl(var(--chart-1))" },
    date: { label: "Fecha", color: "hsl(var(--chart-2))" },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Proximas consultas en 3 meses</CardTitle>
        <CardDescription>En esta sección podrás ver el número de proximas consultas en los proximos 3 meses.</CardDescription>
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
