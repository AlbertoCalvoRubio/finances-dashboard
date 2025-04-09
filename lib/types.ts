import { Transaction } from "./db/schema";

export type Column = keyof Omit<Transaction, "id" | "type">;

export type PageSearchParams = Promise<{
  [key: string]: string | string[] | undefined;
}>;
