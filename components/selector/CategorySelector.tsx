"use client";

import { CATEGORIES } from "../../lib/categories";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { useRouter, useSearchParams } from "next/navigation";

type CategorySelectorProps = {
  defaultCategory?: string;
};

export default function CategorySelector({
  defaultCategory,
}: CategorySelectorProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleCategoryChange = (category: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    if (category === "All categories") {
      newParams.delete("category");
    } else {
      newParams.set("category", category);
    }
    newParams.delete("page");

    router.push(`?${newParams.toString()}`, { scroll: false });
  };

  const selectItems = CATEGORIES.map(([category, { displayName, icon }]) => (
    <SelectItem key={category} value={category}>
      {`${icon} ${displayName}`}
    </SelectItem>
  ));
  return (
    <Select defaultValue={defaultCategory} onValueChange={handleCategoryChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="All categories" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="All categories">All Categories</SelectItem>
        {selectItems}
      </SelectContent>
    </Select>
  );
}
