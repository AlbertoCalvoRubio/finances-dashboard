"use client";

import { useCallback, useRef, useState } from "react";
import { CSV_PROVIDER, CsvProvider, processFile } from "../lib/providers/csv";
import { FolderIcon } from "@heroicons/react/24/outline";
import { createTransactions } from "../lib/transactions/actions";
import { useRouter } from "next/navigation";
import { CreateTransaction } from "../lib/transactions/types";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { toast } from "sonner";
import { Account } from "../lib/db/schema";

type UploadTransactionsCsvDialogProps = {
  accounts: Account[];
};

export default function UploadTransactionsCsvDialog({
  accounts,
}: UploadTransactionsCsvDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const accountSelectItems = accounts.map((account) => (
    <SelectItem key={account.id} value={account.id}>
      {account.alias}
    </SelectItem>
  ));
  const [selectedCsvType, setSelectedCsvType] = useState<CsvProvider>(
    CSV_PROVIDER.BANK_1_CARD,
  );
  const [accountId, setAccountId] = useState<string>();
  const [isFileLoaded, setIsFileLoaded] = useState(false);
  const [transactions, setTransactions] = useState<CreateTransaction[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        try {
          const transactions = await processFile(file, selectedCsvType);
          setTransactions(transactions);
          setIsFileLoaded(true);
        } catch (error) {
          console.error("Failed to process file:", error);
          toast.error(`Failed to import transactions`);
          clearState();
          setOpen(false);
        }
      }
    },
    [selectedCsvType],
  );

  const openInputFile = () => {
    fileInputRef.current?.click();
  };

  const providerOptions = Object.values(CSV_PROVIDER).map((provider) => (
    <option key={provider} value={provider}>
      {provider}
    </option>
  ));

  const clearState = () => {
    setIsFileLoaded(false);
    setTransactions([]);
    setSelectedCsvType(CSV_PROVIDER.BANK_1_CARD);
    setAccountId(undefined);
  };

  const importLoadedTransactions = async () => {
    try {
      if (!accountId) {
        throw new Error("No account selected");
      }
      await createTransactions(transactions, accountId);
      toast.success("Transactions imported successfully");
    } catch (error) {
      console.error("Failed to import transactions:", error);
      alert(`Failed to import transactions ${error}`);
    }

    clearState();
    setOpen(false);
    router.refresh();
  };

  const onOpenChange = (newOpen: boolean) => {
    if (open && !newOpen) {
      clearState();
    }

    setOpen(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger className="my-3 rounded bg-primary px-3 py-2 text-white">
        Upload transactions CSV
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import transactions CSV</DialogTitle>
          <DialogDescription>
            Import transactions from a CSV file of the allowed providers
          </DialogDescription>
        </DialogHeader>
        {!isFileLoaded ? (
          <div className="flex flex-col items-center space-y-4">
            <label htmlFor="csvType" className="text-sm font-semibold">
              Select CSV Type:
            </label>
            <select
              id="csvType"
              value={selectedCsvType}
              onChange={(e) =>
                setSelectedCsvType(e.target.value as CsvProvider)
              }
              className="rounded border"
            >
              {providerOptions}
            </select>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button onClick={openInputFile}>
              <FolderIcon className="mr-2 h-5 w-5" />
              Open file
            </Button>
          </div>
        ) : (
          <div>
            <p>
              {`The file contains `}
              <b>{`${transactions.length} transactions`}</b>
              {`. Select the account to import the transactions to.`}
            </p>
            <div className="flex flex-col items-center space-x-4">
              <Select onValueChange={setAccountId}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>

                <SelectContent>{accountSelectItems}</SelectContent>
              </Select>

              <Button
                className="mt-4"
                disabled={!accountId}
                onClick={importLoadedTransactions}
              >
                Import
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
