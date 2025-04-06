"use client";

import { CellContext, ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, EditIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { deleteTransaction } from "../../lib/transactions/actions";
import { useRouter } from "next/navigation";
import { Transaction } from "../../lib/db/schema";

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
function formatCellDate(cellContext: CellContext<Transaction, unknown>) {
  const date = cellContext.getValue();
  if (date instanceof Date) {
    return <div>{formatDate(date)}</div>;
  } else {
    return <div></div>;
  }
}

export const columns: ColumnDef<Transaction>[] = [
  {
    header: "Date",
    accessorKey: "date",
    cell: formatCellDate,
  },
  { header: "Edited Date", accessorKey: "editedDate", cell: formatCellDate },
  {
    header: "Category",
    accessorKey: "category",
  },
  {
    header: "Amount",
    accessorKey: "amount",
  },
  {
    header: "Concept",
    accessorKey: "concept",
  },
  {
    header: "Comment",
    accessorKey: "comment",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const router = useRouter();
      const transaction = row.original;
      return (
        <div>
          <Link href={`/transactions/${transaction.id}`}>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0"
              onClick={() => {
                window.location.href = `/transactions/${transaction.id}`;
              }}
            >
              <EditIcon />
            </Button>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(transaction.id)}
              >
                Copy transaction ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={async () => {
                  await deleteTransaction(transaction.id);
                  router.refresh();
                }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
