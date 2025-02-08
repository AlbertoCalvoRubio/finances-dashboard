import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { ExpenseIncomeBarChart } from "../../components/ExpenseIncomeBarChart";

type TransactionsBarChartProps = {
  groupedData: {
    year: number;
    month: number;
    expense?: number;
    income?: number;
    yearMonth: string;
  }[];
  month?: number;
  year: number;
  previousDateSearchParams: URLSearchParams;
  nextDateSearchParams: URLSearchParams;
};

export default function TransactionsBarChart({
  previousDateSearchParams,
  nextDateSearchParams,
  month,
  year,
  groupedData,
}: TransactionsBarChartProps) {
  return (
    <div className="flex items-center justify-center space-x-4 py-4">
      <Link href={`/analysis?${previousDateSearchParams.toString()}`}>
        <ArrowLeft size={24} />
      </Link>
      <ExpenseIncomeBarChart data={groupedData} activeMonthIndex={month} />
      {year < new Date().getFullYear() ? (
        <Link href={`/analysis?${nextDateSearchParams.toString()}`}>
          <ArrowRight size={24} />
        </Link>
      ) : (
        <ArrowRight className="opacity-50 hover:cursor-not-allowed" size={24} />
      )}
    </div>
  );
}
