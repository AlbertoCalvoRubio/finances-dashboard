"use client";

import { Pie, PieChart } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "./ui/chart";
import { Card, CardHeader, CardTitle } from "./ui/card";

type FinancesOverviewProps = {
  className?: string;
};

const latestProductsBalances = [
  { name: "ibercaja", balance: 1000, fill: "#FFC107" },
  { name: "bbva", balance: 2000, fill: "#FF5722" },
  { name: "santander", balance: 3000, fill: "#4CAF50" },
  { name: "bankia", balance: 4000, fill: "#2196F3" },
];

const chartConfig = {
  balance: {
    label: "Balance",
  },
  bbva: {
    label: "BBVA",
  },
  bankia: {
    label: "Bankia",
  },
  ibercaja: {
    label: "Ibercaja",
  },
  santander: {
    label: "Santander",
  },
};

export default function FinancesOverview(props: FinancesOverviewProps) {
  const { className } = props;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Balances Overview</CardTitle>
      </CardHeader>
      <ChartContainer config={chartConfig} className={`mx-auto ${className}`}>
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent hideLabel />} />
          <Pie
            data={latestProductsBalances}
            dataKey="balance"
            nameKey="name"
            innerRadius={100}
            strokeWidth={5}
            labelLine={false}
            label={({ payload, ...props }) => {
              return (
                <text
                  cx={props.cx}
                  cy={props.cy}
                  x={props.x}
                  y={props.y}
                  textAnchor={props.textAnchor}
                  dominantBaseline={props.dominantBaseline}
                >
                  {chartConfig[payload.name as keyof typeof chartConfig].label}
                </text>
              );
            }}
          />
        </PieChart>
      </ChartContainer>
    </Card>
  );
}
