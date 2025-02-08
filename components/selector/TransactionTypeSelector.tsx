"use client";

import { TRANSACTIONS, TransactionType } from "../../lib/transactions/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { useRouter, useSearchParams } from "next/navigation";

type TransactionTypeSelectorProps = {
  defaultTransactionType: TransactionType;
};

export default function TransactionTypeSelector({
  defaultTransactionType,
}: TransactionTypeSelectorProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleTransactionTypeChange = (transactionType: TransactionType) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("transactionType", transactionType);
    newParams.delete("page");
    router.push(`?${newParams.toString()}`, { scroll: false });
  };

  const selectItems = Object.values(TRANSACTIONS).map((transactionType) => (
    <SelectItem key={transactionType} value={transactionType}>
      {transactionType}
    </SelectItem>
  ));
  return (
    <Select
      defaultValue={defaultTransactionType.toString()}
      onValueChange={handleTransactionTypeChange}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="TransactionType" />
      </SelectTrigger>
      <SelectContent>{selectItems}</SelectContent>
    </Select>
  );
}
