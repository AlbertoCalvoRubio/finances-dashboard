import { findCategoryByCategoryKey } from "../../lib/categories";
import { getTransactionsSumByCategory } from "../../lib/transactions/actions";
import { TRANSACTIONS, TransactionType } from "../../lib/transactions/types";
import { PageSearchParams } from "../../lib/types";

export async function extractSearchParams(
  searchParamsPromise: PageSearchParams,
) {
  const searchParams = await searchParamsPromise;

  const page = searchParams.page ? parseInt(searchParams.page as string) : 1;
  const pageSize = searchParams.pageSize
    ? parseInt(searchParams.pageSize as string)
    : 30;
  const year = searchParams.year
    ? parseInt(searchParams.year as string)
    : new Date().getFullYear();
  const month = searchParams.month
    ? parseInt(searchParams.month as string)
    : undefined;
  const transactionType =
    (searchParams.transactionType as TransactionType) ?? "Expense";
  const category = searchParams.category as string | undefined;

  return {
    searchParams,
    page,
    pageSize,
    year,
    month,
    transactionType,
    category,
  };
}

export async function getTransactionsSum(
  transactionType: TransactionType,
  year: number,
  month?: number,
) {
  const transactionsSumByCategory = (
    await getTransactionsSumByCategory({ type: transactionType, year, month })
  ).map((aggregation) => ({
    category: aggregation.category,
    amount: aggregation._sum.amount ?? 0,
  }));

  return transactionsSumByCategory.map((categoryEntry) => {
    const category = findCategoryByCategoryKey(categoryEntry.category);
    if (!category) {
      throw new Error(`Category not found for key ${categoryEntry.category}`);
    }

    const color = category?.color
      ? category.color
      : `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    const icon = category?.icon;
    const categoryDisplayName = category?.displayName;

    return {
      category: categoryDisplayName,
      amount: Math.abs(categoryEntry.amount),
      fill: color,
      icon,
    };
  });
}

export function groupExpenseIncomeByMonth(
  data: { type: string; month: string; year: string; total: number }[],
  year: number,
): {
  year: number;
  month: number;
  expense?: number;
  income?: number;
  yearMonth: string;
}[] {
  const groupedData = [];
  for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
    const month = (monthIndex + 1).toString().padStart(2, "0");
    const monthData = data.filter((item) => item.month === month);

    const totalExpense = monthData
      .filter((item) => item.type === TRANSACTIONS.EXPENSE)
      .reduce((acc, item) => acc + item.total, 0);

    const totalIncome = monthData
      .filter((item) => item.type === TRANSACTIONS.INCOME)
      .reduce((acc, item) => acc + item.total, 0);

    groupedData.push({
      year: year,
      month: monthIndex,
      yearMonth: new Date(year, monthIndex).toLocaleString("en", {
        year: "2-digit",
        month: "short",
      }),
      expense: Math.abs(totalExpense),
      income: Math.abs(totalIncome),
    });
  }

  return groupedData;
}

export function groupExpenseIncomeByMonthYear(
  data: { type: string; month: string; year: string; total: number }[],
): {
  year: number;
  month: number;
  expense?: number;
  income?: number;
  yearMonth: string;
}[] {
  return data.reduce(
    (
      acc: {
        year: number;
        month: number;
        expense?: number;
        income?: number;
        yearMonth: string;
      }[],
      item,
    ) => {
      const existingItem = acc.find(
        (accItem) =>
          accItem.year === parseInt(item.year) &&
          accItem.month === parseInt(item.month),
      );

      if (existingItem) {
        if (item.type === "expense") {
          existingItem.expense =
            (existingItem.expense || 0) + Math.abs(item.total);
        } else {
          existingItem.income =
            (existingItem.income || 0) + Math.abs(item.total);
        }
      } else {
        acc.push({
          year: parseInt(item.year),
          month: parseInt(item.month),
          yearMonth: new Date(
            parseInt(item.year),
            parseInt(item.month),
          ).toLocaleString("en", {
            year: "2-digit",
            month: "short",
          }),
          [item.type.toLowerCase()]: Math.abs(item.total),
        });
      }

      return acc.toSorted((a, b) => {
        if (a.year === b.year) {
          return a.month - b.month;
        }

        return a.year - b.year;
      });
    },
    [],
  );
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "CHF",
    useGrouping: true,
  }).format(amount);
}
