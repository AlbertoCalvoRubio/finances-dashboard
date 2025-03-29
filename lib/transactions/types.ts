import { Transaction } from "../db/schema";

export const TRANSACTIONS = {
  EXPENSE: "EXPENSE",
  INCOME: "INCOME",
  EXCLUDED: "EXCLUDED",
} as const;
export type TransactionType = keyof typeof TRANSACTIONS;

export type TransactionsFilters = {
  type?: TransactionType;
  year?: number;
  month?: number;
  category?: string;
  account?: string;
};

export type CreateTransaction = Omit<Transaction, "id" | "accountId">;
