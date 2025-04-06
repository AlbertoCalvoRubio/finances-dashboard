"use client";

import { Category } from "../../lib/db/schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { useRouter, useSearchParams } from "next/navigation";

type CategorySelectorProps = {
  categories: Category[];
  defaultCategory?: string;
};

export default function CategorySelector({
  defaultCategory,
  categories,
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

  const selectItems = categories.map(({ name, icon }) => (
    <SelectItem key={name} value={name}>
      {`${icon} ${name}`}
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
