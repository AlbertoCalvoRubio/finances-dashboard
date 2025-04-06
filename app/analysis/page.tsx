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
import TransactionsTabs from "./transactions-tabs";
import TransactionsBarChart from "./transactions-bar-chart";
import TransactionsTotalTable from "./transactions-total-table";
import AccountSelector from "../../components/selector/AccountSelector";
import { getAccounts } from "../../lib/account";
import { CATEGORY_TYPE } from "../../lib/categories/types";

export default async function Page({
  searchParams: searchParamsPromise,
}: {
  searchParams: PageSearchParams;
}) {
  const { category, month, year, page, pageSize, searchParams, account } =
    await extractSearchParams(searchParamsPromise);

  const startingDate = new Date(year, 0, 1);
  const endingDate = new Date(year, 11, 31);

  const data = await getTransactionsSumByYearMonthAndType(
    startingDate,
    endingDate,
    category,
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
      categoryType: CATEGORY_TYPE.INCOME,
      category,
      account,
    },
    page,
    pageSize,
  );
  const totalIncomeTransactions = await getTransactionsCount({
    year,
    month,
    categoryType: CATEGORY_TYPE.INCOME,
    category,
    account,
  });

  const expensesTransactions = await getTransactions(
    {
      year,
      month,
      categoryType: CATEGORY_TYPE.EXPENSE,
      category,
      account,
    },
    page,
    pageSize,
  );

  const totalExpensesTransactions = await getTransactionsCount({
    year,
    month,
    categoryType: CATEGORY_TYPE.EXPENSE,
    category,
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
    CATEGORY_TYPE.EXPENSE,
    year,
    month,
    account,
  );
  const incomeTransactionsByCategory = await getTransactionsSum(
    CATEGORY_TYPE.INCOME,
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
