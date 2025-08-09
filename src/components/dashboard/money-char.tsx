import { useMemo } from "react";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import { PieChart, Pie, Cell, Legend } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

export default function MoneyChar() {
  const data = useMemo(() => [{ cost: 40000, patients: 29 }], []);

  const totalMoney = useMemo(
    () => data.reduce((acc, { cost, patients }) => acc + cost * patients, 0),
    [data]
  );

  const formatCOP = (value: number) =>
    value.toLocaleString("es-CO", { style: "currency", currency: "COP" });

  const COLORS = {
    patients: "#60A5FA",   
    cost: "#3B82F6",      
    totalMoney: "#2563EB",
  };

  const chartConfig = {
    patients: { label: "Pacientes", color: COLORS.patients },
    cost: { label: "Costo consulta", color: COLORS.cost },
    totalMoney: { label: "Total recaudado", color: COLORS.totalMoney },
  } satisfies ChartConfig;

  const pieData = useMemo(
    () => [
      { key: "patients", name: chartConfig.patients.label, value: data[0].patients },
      { key: "cost", name: chartConfig.cost.label, value: data[0].cost },
      { key: "totalMoney", name: chartConfig.totalMoney.label, value: totalMoney },
    ],
    [chartConfig.cost.label, chartConfig.patients.label, chartConfig.totalMoney.label, data, totalMoney]
  );

  const valueFormatter = (
    value: unknown,
    _name: unknown,
    item: unknown
  ): [React.ReactNode, React.ReactNode] => {
    const key = (item as { payload: { key: string } })?.payload?.key as string;
    const num = Array.isArray(value) ? Number(value[0] as number) : Number(value as number);
    if (key === "patients") return [num.toLocaleString("es-CO"), " Pacientes"];
    if (key === "cost") return [formatCOP(num), " Costo consulta"];
    return [formatCOP(num), " Total recaudado"];
  };

  const colorByKey = (k: string) =>
    k === "patients" ? COLORS.patients : k === "cost" ? COLORS.cost : COLORS.totalMoney;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-baseline gap-2">
          Total recaudado
          <span className="text-green-800 text-sm font-semibold">
            {formatCOP(totalMoney)} COP
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-auto h-[220px] w-full">
          <PieChart accessibilityLayer>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={90}
              strokeWidth={2}
              stroke="#FFFFFF"
              labelLine={false}
              label={({ name, value, payload }) => {
                const key = payload.key;
                if (key === "patients") return `${name}: ${Number(value).toLocaleString("es-CO")}`;
                return `${name}: ${formatCOP(Number(value))}`;
              }}
            >
              {pieData.map((entry) => (
                <Cell key={entry.key} fill={colorByKey(entry.key)} />
              ))}
            </Pie>

            <Legend
              verticalAlign="bottom"
              align="center"
              wrapperStyle={{ paddingTop: 8 }}
              payload={pieData.map((d) => ({
                id: d.key,
                value: d.name,
                type: "circle" as const,
                color: colorByKey(d.key),
              }))}
            />

            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[200px]"
                  formatter={valueFormatter}
                  labelFormatter={() => "Detalle"}
                />
              }
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
