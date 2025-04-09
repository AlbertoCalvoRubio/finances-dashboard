import { TransactionForm } from "../../../components/TransactionForm";
import { getAllCategories } from "../../../lib/categories/actions";
import { getTransactionById } from "../../../lib/transactions/actions";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const transaction = await getTransactionById(id);
  const categories = await getAllCategories();

  if (!transaction) {
    return <p>Transaction not found</p>;
  }

  return (
    <div className="flex-grow items-center justify-between">
      <div className="px-36 py-10">
        <TransactionForm transaction={transaction} categories={categories} />
      </div>
    </div>
  );
}
