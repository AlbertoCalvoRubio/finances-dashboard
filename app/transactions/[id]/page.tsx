import { TransactionForm } from "../../../components/TransactionForm";
import { getTransactionById } from "../../../lib/transactions/actions";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const transaction = await getTransactionById(id);

  if (!transaction) {
    return <p>Transaction not found</p>;
  }

  return (
    <div className="flex-grow items-center justify-between">
      <div className="px-36 py-10">
        <TransactionForm transaction={transaction} />
      </div>
    </div>
  );
}
