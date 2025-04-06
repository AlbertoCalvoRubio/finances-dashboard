import { CategoryType } from "../categories/types";
import { Transaction } from "../db/schema";

export type TransactionsFilters = {
  categoryType?: CategoryType;
  year?: number;
  month?: number;
  category?: string;
  account?: string;
};

export type CreateTransaction = Omit<Transaction, "id" | "accountId">;
