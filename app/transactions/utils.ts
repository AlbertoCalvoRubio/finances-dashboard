import { TRANSACTIONS, TransactionType } from "../../lib/transactions/types";

export function extractSearchParams(searchParams: {
  [key: string]: string | string[] | undefined;
}) {
  const page = searchParams.page ? parseInt(searchParams.page as string) : 1;
  const pageSize = searchParams.pageSize
    ? parseInt(searchParams.pageSize as string)
    : 100;
  const year = searchParams.year
    ? parseInt(searchParams.year as string)
    : new Date().getFullYear();
  const month = searchParams.month
    ? parseInt(searchParams.month as string)
    : new Date().getMonth();
  const transactionType =
    (searchParams.transactionType as TransactionType) ?? TRANSACTIONS.EXPENSE;
  const category = searchParams.category as string | undefined;
  const account = searchParams.account as string | undefined;

  return { page, pageSize, year, month, transactionType, category, account };
}
