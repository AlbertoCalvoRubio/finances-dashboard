"use client";
import { Label, Pie, PieChart, Sector } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { PieSectorDataItem } from "recharts/types/polar/Pie";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function getChartConfig(data: CategoryData[]): ChartConfig {
  return data.reduce((config, { category, icon }) => {
    config[category] = {
      label: `${icon} ${category}`,
    };
    return config;
  }, {} as ChartConfig);
}

export type CategoryData = {
  category: string;
  amount: number;
  icon: string;
  fill: string;
};

type SummaryByCategoryPieChartProps = {
  categoryData: CategoryData[];
  category?: string;
  className?: string;
};

export function SummaryByCategoryPieChart({
  categoryData,
  category,
  className,
}: SummaryByCategoryPieChartProps) {
  const chartConfig = getChartConfig(categoryData);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    category,
  );
  const totalAmount = categoryData.reduce(
    (total, { amount }) => total + amount,
    0,
  );
  const [selectedTotalAmount, setSelectedTotalAmount] = useState<number>(0);
  const activeIndex = categoryData.findIndex(
    (data) => data.category === selectedCategory,
  );

  useEffect(() => {
    setSelectedTotalAmount(totalAmount);
  }, [totalAmount]);

  const router = useRouter();
  const searchParams = useSearchParams();

  const handleOnCategoryChange = (category: string) => {
    const newParams = new URLSearchParams(searchParams.toString());

    if (selectedCategory === category) {
      setSelectedCategory(undefined);
      setSelectedTotalAmount(totalAmount);
      newParams.delete("category");
    } else {
      setSelectedCategory(category);
      const selectedCategoryData = categoryData.find(
        (data) => data.category === category,
      );
      setSelectedTotalAmount(selectedCategoryData?.amount ?? totalAmount);
      newParams.set("category", category);
    }
    newParams.delete("page");

    router.push(`?${newParams.toString()}`, { scroll: false });
  };

  return (
    <ChartContainer config={chartConfig} className={`mx-auto ${className}`}>
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <Pie
          data={categoryData}
          dataKey="amount"
          nameKey="category"
          innerRadius={85}
          strokeWidth={5}
          activeIndex={activeIndex}
          activeShape={({ outerRadius = 0, ...props }: PieSectorDataItem) => (
            <Sector {...props} outerRadius={outerRadius + 15} />
          )}
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
                {payload.category}
              </text>
            );
          }}
          onClick={({ category }) => handleOnCategoryChange(category)}
        >
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground text-2xl font-bold"
                    >
                      {`${selectedTotalAmount.toLocaleString()}`}
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}
