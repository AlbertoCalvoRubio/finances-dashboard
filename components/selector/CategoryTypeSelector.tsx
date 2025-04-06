"use client";

import { CATEGORY_TYPES, CategoryType } from "../../lib/categories/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { useRouter, useSearchParams } from "next/navigation";

type CategoryTypeSelectorProps = {
  defaultCategoryType: CategoryType;
};

export default function CategoryTypeSelector({
  defaultCategoryType,
}: CategoryTypeSelectorProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleCategoryTypeChange = (categoryType: CategoryType) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("categoryType", categoryType);
    newParams.delete("page");
    router.push(`?${newParams.toString()}`, { scroll: false });
  };

  const selectItems = CATEGORY_TYPES.map((categoryType) => (
    <SelectItem key={categoryType} value={categoryType}>
      {categoryType}
    </SelectItem>
  ));
  return (
    <Select
      defaultValue={defaultCategoryType.toString()}
      onValueChange={handleCategoryTypeChange}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="CategoryType" />
      </SelectTrigger>
      <SelectContent>{selectItems}</SelectContent>
    </Select>
  );
}
