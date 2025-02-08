import { TransactionType } from "../../lib/transactions/types";

export function buildTransactionsPageUrl(
  page: number,
  pageSize: number,
  modal: string,
) {
  return `?${new URLSearchParams({ page: page.toString(), pageSize: pageSize.toString(), modal })}`;
}

export function extractSearchParams(searchParams: {
  [key: string]: string | string[] | undefined;
}) {
  const page = searchParams.page ? parseInt(searchParams.page as string) : 1;
  const pageSize = searchParams.pageSize
    ? parseInt(searchParams.pageSize as string)
    : 10;
  const year = searchParams.year
    ? parseInt(searchParams.year as string)
    : new Date().getFullYear();
  const month = searchParams.month
    ? parseInt(searchParams.month as string)
    : new Date().getMonth();
  const transactionType =
    (searchParams.transactionType as TransactionType) ?? "Expense";
  const category = searchParams.category as string | undefined;

  return { page, pageSize, year, month, transactionType, category };
}
