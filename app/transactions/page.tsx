import {
  getTransactions,
  getTransactionsCount,
} from "../../lib/transactions/actions";
import Pagination from "../../components/Pagination";
import { DataTable } from "../../components/ui/data-table";
import { columns } from "./columns";
import YearSelector from "../../components/selector/YearSelector";
import MonthSelector from "../../components/selector/MonthSelector";
import TransactionTypeSelector from "../../components/selector/CategoryTypeSelector";
import { extractSearchParams } from "./utils";
import { PageSearchParams } from "../../lib/types";
import CategorySelector from "../../components/selector/CategorySelector";
import UploadTransactionsCsvDialog from "../../components/UploadTransactionsCsvDialog";
import { getAccounts } from "../../lib/account";
import AccountSelector from "../../components/selector/AccountSelector";
import { CATEGORY_TYPE } from "../../lib/categories/types";
import { getAllCategories } from "../../lib/categories/actions";

export default async function Page({
  searchParams: searchParamsPromise,
}: {
  searchParams: PageSearchParams;
}) {
  const searchParams = await searchParamsPromise;
  const { page, pageSize, year, month, categoryType, category, account } =
    extractSearchParams(searchParams);

  const categories = await getAllCategories();
  const transactions = await getTransactions(
    { year, month, categoryType, category, account },
    page,
    pageSize,
  );

  const totalTransactions = await getTransactionsCount({
    year,
    month,
    category,
    categoryType,
    account,
  });

  const accounts = await getAccounts();
  const accountsSelectorValues = accounts.map(({ id, iban, alias }) => ({
    id,
    displayName: alias != null ? alias : iban,
  }));

  return (
    <div className="m-4">
      <div className="flex flex-col items-center">
        <UploadTransactionsCsvDialog accounts={accounts} />
        <div className="m-2 flex space-x-4">
          <AccountSelector
            selectedAccount={account}
            accounts={accountsSelectorValues}
          />
          <TransactionTypeSelector
            defaultCategoryType={CATEGORY_TYPE.EXPENSE}
          />
          <CategorySelector
            defaultCategory={category}
            categories={categories}
          />
          <YearSelector selectedYear={year} />
          <MonthSelector defaultMonth={month} />
        </div>
        <DataTable columns={columns} data={transactions} />
        <Pagination
          currentPage={page}
          transactionsPerPage={pageSize}
          totalTransactions={totalTransactions}
        />
      </div>
    </div>
  );
}
