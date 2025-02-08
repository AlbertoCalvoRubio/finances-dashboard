"use client";

import { Transaction } from "@prisma/client";
import Pagination from "../../components/Pagination";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { columns } from "../transactions/columns";
import { DataTable } from "../transactions/data-table";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CategoryData,
  SummaryByCategoryPieChart,
} from "../../components/SummaryByCategoryPieChart";

type TransactionsTabsProps = {
  incomeTransactions: Transaction[];
  incomeTransactionsByCategory: CategoryData[];
  expensesTransactions: Transaction[];
  expensesTransactionsByCategory: CategoryData[];
  totalIncomeTransactions: number;
  totalExpensesTransactions: number;
  category?: string;
  page: number;
  transactionsPerPage: number;
};

export default function TransactionsTabs({
  incomeTransactions,
  incomeTransactionsByCategory,
  expensesTransactions,
  expensesTransactionsByCategory,
  totalExpensesTransactions,
  totalIncomeTransactions,
  category,
  page,
  transactionsPerPage,
}: TransactionsTabsProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleTabChange = () => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.delete("page");
    newParams.delete("category");

    router.push(`?${newParams.toString()}`, { scroll: false });
  };

  const pieChartClassName = "max-w-[70vh]";

  return (
    <Tabs
      onValueChange={handleTabChange}
      defaultValue="expenses"
      className="flex flex-col items-center justify-center"
    >
      <TabsList className="space-x-4">
        <TabsTrigger value="income">Income</TabsTrigger>
        <TabsTrigger value="expenses">Expenses</TabsTrigger>
        <TabsTrigger value="excluded">Excluded</TabsTrigger>
      </TabsList>
      <TabsContent className="w-full" value="income">
        <SummaryByCategoryPieChart
          className={pieChartClassName}
          category={category}
          categoryData={incomeTransactionsByCategory}
        />
        <DataTable columns={columns} data={incomeTransactions} />
        <Pagination
          currentPage={page}
          totalTransactions={totalIncomeTransactions}
          transactionsPerPage={transactionsPerPage}
        />
      </TabsContent>
      <TabsContent className="w-full" value="expenses">
        <SummaryByCategoryPieChart
          className={pieChartClassName}
          category={category}
          categoryData={expensesTransactionsByCategory}
        />
        <DataTable columns={columns} data={expensesTransactions} />
        <Pagination
          currentPage={page}
          totalTransactions={totalExpensesTransactions}
          transactionsPerPage={transactionsPerPage}
        />
      </TabsContent>
      <TabsContent className="w-full" value="excluded">
        <DataTable columns={columns} data={[]} />
        <Pagination
          currentPage={page}
          totalTransactions={0}
          transactionsPerPage={transactionsPerPage}
        />
      </TabsContent>
    </Tabs>
  );
}
