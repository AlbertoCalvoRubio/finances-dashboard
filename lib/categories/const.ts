import { CategoryInsert } from "../db/schema";
import { CATEGORY_TYPE } from "./types";

export const otherExpenseCategory: CategoryInsert = {
  name: "Other Expenses",
  type: CATEGORY_TYPE.EXPENSE,
  color: "#FF5733",
  icon: "❓",
  position: 0,
} as const;

export const otherIncomeCategory: CategoryInsert = {
  name: "Other Income",
  type: CATEGORY_TYPE.INCOME,
  color: "#33FF57",
  icon: "❓",
  position: 0,
} as const;
