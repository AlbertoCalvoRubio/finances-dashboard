import {
  getTransactions,
  getTransactionsCount,
  getTransactionsSumByYearMonthAndType,
} from "../../lib/transactions/actions";
import { PageSearchParams } from "../../lib/types";
import {
  extractSearchParams,
  getTransactionsSum,
  groupExpenseIncomeByMonth,
} from "./utils";
import { TRANSACTIONS } from "../../lib/transactions/types";
import TransactionsTabs from "./transactions-tabs";
import TransactionsBarChart from "./transactions-bar-chart";
import TransactionsTotalTable from "./transactions-total-table";
import { getCategoryKeyByDisplayName } from "../../lib/categories";

export default async function Page({
  searchParams: searchParamsPromise,
}: {
  searchParams: PageSearchParams;
}) {
  const { category, month, year, page, pageSize, searchParams } =
    await extractSearchParams(searchParamsPromise);

  const categoryKey = category
    ? getCategoryKeyByDisplayName(category)
    : undefined;
  const startingDate = new Date(Date.UTC(year, 0, 1));
  const endingDate = new Date(Date.UTC(year, 11, 31));

  const data = await getTransactionsSumByYearMonthAndType(
    startingDate,
    endingDate,
    categoryKey,
  );

  const groupedData = groupExpenseIncomeByMonth(data, year);

  const income =
    month !== undefined && groupedData[month].income !== undefined
      ? groupedData[month].income
      : groupedData.reduce((acc, item) => acc + (item.income || 0), 0);
  const expense =
    month !== undefined && groupedData[month].expense !== undefined
      ? groupedData[month].expense
      : groupedData.reduce((acc, item) => acc + (item.expense || 0), 0);

  const net = income - expense;

  const incomeTransactions = await getTransactions(
    {
      year,
      month,
      type: TRANSACTIONS.INCOME,
      category: categoryKey,
    },
    page,
    pageSize,
  );
  const totalIncomeTransactions = await getTransactionsCount({
    year,
    month,
    type: TRANSACTIONS.INCOME,
    category: categoryKey,
  });

  const expensesTransactions = await getTransactions(
    {
      year,
      month,
      type: TRANSACTIONS.EXPENSE,
      category: categoryKey,
    },
    page,
    pageSize,
  );

  const totalExpensesTransactions = await getTransactionsCount({
    year,
    month,
    type: TRANSACTIONS.EXPENSE,
    category: categoryKey,
  });

  const previousDateSearchParams = new URLSearchParams({
    ...searchParams,
    year: (year - 1).toString(),
  });

  const nextDateSearchParams = new URLSearchParams({
    ...searchParams,
    year: (year + 1).toString(),
  });

  const expensesTransactionsByCategory = await getTransactionsSum(
    TRANSACTIONS.EXPENSE,
    year,
    month,
  );
  const incomeTransactionsByCategory = await getTransactionsSum(
    TRANSACTIONS.INCOME,
    year,
    month,
  );

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="flex w-full flex-col space-y-4">
        <TransactionsBarChart
          previousDateSearchParams={previousDateSearchParams}
          nextDateSearchParams={nextDateSearchParams}
          month={month}
          year={year}
          groupedData={groupedData}
        />
        <TransactionsTotalTable income={income} expense={expense} net={net} />
        <div className="w-full">
          <TransactionsTabs
            expensesTransactions={expensesTransactions}
            expensesTransactionsByCategory={expensesTransactionsByCategory}
            incomeTransactions={incomeTransactions}
            incomeTransactionsByCategory={incomeTransactionsByCategory}
            totalExpensesTransactions={totalExpensesTransactions}
            totalIncomeTransactions={totalIncomeTransactions}
            category={category}
            page={page}
            transactionsPerPage={pageSize}
          />
        </div>
      </div>
    </div>
  );
}
