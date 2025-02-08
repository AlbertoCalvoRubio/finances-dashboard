"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { useRouter, useSearchParams } from "next/navigation";

type YearSelectorProps = {
  defaultYear: number;
};

export default function YearSelector({ defaultYear }: YearSelectorProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleYearChange = (year: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("year", year);
    router.push(`?${newParams.toString()}`, { scroll: false });
  };

  const selectItems = Array.from(
    { length: 3 },
    (_, i) => new Date().getFullYear() - i,
  ).map((year) => (
    <SelectItem key={year} value={year.toString()}>
      {year}
    </SelectItem>
  ));
  return (
    <Select
      defaultValue={defaultYear.toString()}
      onValueChange={handleYearChange}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Year" />
      </SelectTrigger>
      <SelectContent>{selectItems}</SelectContent>
    </Select>
  );
}
