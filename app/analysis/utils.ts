import { CATEGORY_TYPE, CategoryType } from "../../lib/categories/types";
import { getTransactionsSumByCategory } from "../../lib/transactions/actions";
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
  const categoryType =
    (searchParams.categoryType as CategoryType) ?? CATEGORY_TYPE.EXPENSE;
  const category = searchParams.category as string | undefined;
  const account = searchParams.account as string | undefined;

  return {
    searchParams,
    page,
    pageSize,
    year,
    month,
    categoryType,
    category,
    account,
  };
}

export async function getTransactionsSum(
  categoryType: CategoryType,
  year: number,
  month?: number,
  account?: string,
) {
  const transactionsSumByCategory = (
    await getTransactionsSumByCategory({
      categoryType,
      year,
      month,
      account,
    })
  ).map((aggregation) => ({
    ...aggregation,
    amount: typeof aggregation.sum === "string" ? Number(aggregation.sum) : 0,
  }));

  return transactionsSumByCategory.map(({ category, icon, color, amount }) => {
    return {
      category,
      amount: Math.abs(amount),
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
      .filter((item) => item.type === CATEGORY_TYPE.EXPENSE)
      .reduce((acc, item) => acc + item.total, 0);

    const totalIncome = monthData
      .filter((item) => item.type === CATEGORY_TYPE.INCOME)
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
