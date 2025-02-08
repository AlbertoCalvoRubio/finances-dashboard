"use client";

import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useRouter, useSearchParams } from "next/navigation";

const chartConfig = {
  income: {
    label: "Income",
    color: "hsl(var(--chart-2))",
  },
  expense: {
    label: "Expense",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

type ExpenseIncomeBarChartProps = {
  data: {
    year: number;
    month: number;
    expense?: number;
    income?: number;
    yearMonth: string;
  }[];
  activeMonthIndex?: number;
};

export function ExpenseIncomeBarChart({
  data,
  activeMonthIndex,
}: ExpenseIncomeBarChartProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleMonthChange = (index?: number) => {
    const newParams = new URLSearchParams(searchParams.toString());
    if (index === activeMonthIndex || index === undefined) {
      newParams.delete("month");
    } else {
      newParams.set("month", index.toString());
    }

    newParams.delete("page");
    router.push(`?${newParams.toString()}`, { scroll: false });
  };

  const handleBarClick = (index: number) => {
    handleMonthChange(activeMonthIndex === index ? undefined : index);
  };

  return (
    <ChartContainer className="mt-8 min-h-[360px]" config={chartConfig}>
      <BarChart accessibilityLayer data={data}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="yearMonth"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <YAxis />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dashed" />}
        />
        <Bar
          activeIndex={activeMonthIndex}
          dataKey="income"
          fill="var(--color-income)"
          fillOpacity={activeMonthIndex === undefined ? 1 : 0.5}
          radius={4}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-income-${index}`}
              fillOpacity={
                activeMonthIndex === undefined || index === activeMonthIndex
                  ? 1
                  : 0.5
              }
              onClick={() => handleBarClick(index)}
            />
          ))}
        </Bar>
        <Bar
          activeIndex={activeMonthIndex}
          dataKey="expense"
          fill="var(--color-expense)"
          radius={4}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-expense-${index}`}
              fillOpacity={
                activeMonthIndex === undefined || index === activeMonthIndex
                  ? 1
                  : 0.5
              }
              onClick={() => handleBarClick(index)}
            />
          ))}
        </Bar>
        <ChartLegend content={<ChartLegendContent />} />
      </BarChart>
    </ChartContainer>
  );
}
