"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { useRouter, useSearchParams } from "next/navigation";

type MonthSelectorProps = {
  defaultMonth: number;
};

export default function MonthSelector({ defaultMonth }: MonthSelectorProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleMonthChange = (month: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("month", month);
    router.push(`?${newParams.toString()}`, { scroll: false });
  };

  const selectItems = Array.from({ length: 12 }, (_, i) => i).map((month) => (
    <SelectItem key={month} value={month.toString()}>
      {new Date(0, month).toLocaleString("default", { month: "long" })}
    </SelectItem>
  ));
  return (
    <Select
      defaultValue={defaultMonth.toString()}
      onValueChange={handleMonthChange}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Month" />
      </SelectTrigger>
      <SelectContent>{selectItems}</SelectContent>
    </Select>
  );
}
