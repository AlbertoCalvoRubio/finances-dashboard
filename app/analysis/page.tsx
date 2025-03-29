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
import AccountSelector from "../../components/selector/AccountSelector";
import { getAccounts } from "../../lib/account";

export default async function Page({
  searchParams: searchParamsPromise,
}: {
  searchParams: PageSearchParams;
}) {
  const { category, month, year, page, pageSize, searchParams, account } =
    await extractSearchParams(searchParamsPromise);

  const categoryKey = category
    ? getCategoryKeyByDisplayName(category)
    : undefined;
  const startingDate = new Date(year, 0, 1);
  const endingDate = new Date(year, 11, 31);

  const data = await getTransactionsSumByYearMonthAndType(
    startingDate,
    endingDate,
    categoryKey,
    account,
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
      account,
    },
    page,
    pageSize,
  );
  const totalIncomeTransactions = await getTransactionsCount({
    year,
    month,
    type: TRANSACTIONS.INCOME,
    category: categoryKey,
    account,
  });

  const expensesTransactions = await getTransactions(
    {
      year,
      month,
      type: TRANSACTIONS.EXPENSE,
      category: categoryKey,
      account,
    },
    page,
    pageSize,
  );

  const totalExpensesTransactions = await getTransactionsCount({
    year,
    month,
    type: TRANSACTIONS.EXPENSE,
    category: categoryKey,
    account,
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
    account,
  );
  const incomeTransactionsByCategory = await getTransactionsSum(
    TRANSACTIONS.INCOME,
    year,
    month,
    account,
  );

  const accounts = await getAccounts();
  const accountSelectorValues = accounts.map(({ id, iban, alias }) => ({
    id,
    displayName: alias || iban,
  }));

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="flex w-full flex-col space-y-4">
        <div className="flex w-full justify-center p-6">
          <AccountSelector
            accounts={accountSelectorValues}
            selectedAccount={account}
          />
        </div>
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
