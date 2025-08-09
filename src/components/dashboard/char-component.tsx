"use client";

import { useMemo, useState } from "react";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import { Card, CardContent, CardDescription, CardHeader } from "../ui/card";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

export default function CharComponent() {
  const data = useMemo(
    () => [
      { hour: "08:00", patients: 3 },
      { hour: "09:00", patients: 1 },
      { hour: "10:00", patients: 1 },
      { hour: "11:00", patients: 1 },
      { hour: "13:00", patients: 2 },
      { hour: "14:00", patients: 1 },
      { hour: "15:00", patients: 1 },
      { hour: "16:00", patients: 2 },
      { hour: "17:00", patients: 3 },
      { hour: "18:00", patients: 5 },
      { hour: "19:00", patients: 6 },
      { hour: "20:00", patients: 3 },
    ],
    []
  );

  const chartConfig = {
    patients: { label: "Pacientes", color: "hsl(var(--chart-1))" },
    hour: { label: "Horas", color: "hsl(var(--chart-2))" },
  } satisfies ChartConfig;

  const [activeStat, setActiveStat] =
    useState<keyof typeof chartConfig>("patients");

  const totals = useMemo(
    () => ({
      patients: data.reduce((acc, curr) => acc + curr.patients, 0),
      hour: data.length,
    }),
    [data]
  );

  return (
    <Card className="py-0">
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="hidden 2xl:flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3">
          <CardDescription className="text-center text-md">
            Día de hoy
          </CardDescription>
        </div>

        <div className="flex">
          {(["patients", "hour"] as const).map((key) => (
            <button
              key={key}
              data-active={activeStat === key}
              className="data-[active=true]:bg-muted/50 relative z-30 flex flex-1 flex-col justify-center items-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
              onClick={() => setActiveStat(key)}
            >
              <span className="text-muted-foreground text-xs text-center">
                {chartConfig[key].label}
              </span>
              <span className="text-lg leading-none font-bold sm:text-3xl text-center">
                {totals[key].toLocaleString()}
              </span>
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="px-2">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[130px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={data}
            margin={{ left: 0, right: 0 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="hour" // <- usa la hora del dataset
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
                  labelFormatter={(value) => `Hora: ${value as string}`}
                />
              }
            />
            <Bar dataKey="patients" fill="#3B82F6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
