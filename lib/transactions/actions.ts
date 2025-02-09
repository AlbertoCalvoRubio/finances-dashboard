"use server";

import prisma from "../db";
import { Prisma } from "@prisma/client";
import { CreateTransaction, TransactionsFilters } from "./types";
import { revalidatePath } from "next/cache";

export async function getTransactions(
  {
    type,
    category,
    year = new Date().getFullYear(),
    month,
    account,
  }: TransactionsFilters,
  page: number = 1,
  pageSize: number = 10,
) {
  const minDate = new Date(Date.UTC(year, month !== undefined ? month : 0, 1));
  const maxDate = new Date(
    Date.UTC(year, month !== undefined ? month + 1 : 12) - 1,
  );

  const query: Record<string, unknown> = {
    AND: [
      {
        editedDate: {
          gte: minDate,
        },
      },
      {
        editedDate: {
          lte: maxDate,
        },
      },
      {
        category,
      },
      {
        accountId: account,
      },
    ],
  };

  if (type) {
    query["type"] = type;
  }

  return prisma.transaction.findMany({
    where: query,
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: {
      editedDate: "desc",
    },
  });
}

export async function createTransactions(
  transactions: CreateTransaction[],
  accountId: string,
) {
  const transactionsWithAccountId = transactions.map((transaction) => ({
    ...transaction,
    accountId: accountId,
  }));
  revalidatePath("/transactions");

  return prisma.transaction.createMany({
    data: transactionsWithAccountId,
  });
}

export async function getTransactionsCount({
  type,
  year = new Date().getFullYear(),
  month,
  category,
  account,
}: TransactionsFilters) {
  const minDate = new Date(Date.UTC(year, month !== undefined ? month : 0, 1));
  const maxDate = new Date(
    Date.UTC(year, month !== undefined ? month + 1 : 12) - 1,
  );
  const query: Record<string, unknown> = {
    AND: [
      {
        editedDate: {
          gte: minDate,
        },
      },
      {
        editedDate: {
          lte: maxDate,
        },
      },
      { category },
      { accountId: account },
    ],
  };

  if (type) {
    query["type"] = type;
  }

  return prisma.transaction.count({
    where: query,
  });
}

export async function getTransactionsSumByCategory({
  type,
  year = new Date().getFullYear(),
  month,
  account,
}: TransactionsFilters) {
  const minDate = new Date(Date.UTC(year, month !== undefined ? month : 0, 1));
  const maxDate = new Date(
    Date.UTC(year, month !== undefined ? month + 1 : 12) - 1,
  );

  return prisma.transaction.groupBy({
    by: ["category"],
    _sum: { amount: true },
    where: {
      AND: [
        { type },
        {
          editedDate: {
            gte: minDate,
          },
        },
        {
          editedDate: {
            lte: maxDate,
          },
        },
        { accountId: account },
      ],
    },
    orderBy: {
      _sum: {
        amount: "desc",
      },
    },
  });
}

export async function getTransactionsSumByYearMonthAndType(
  startingDate: Date,
  endingDate: Date,
  category?: string,
  account?: string,
) {
  return prisma.$queryRaw<
    {
      type: string;
      month: string;
      year: string;
      total: number;
    }[]
  >`
    SELECT
      type,
      strftime('%m', datetime(editedDate/1000, 'unixepoch')) AS month,
      strftime('%Y', datetime(editedDate/1000, 'unixepoch')) AS year,
      SUM(amount) AS total
    FROM "Transaction"
    WHERE editedDate >= ${startingDate}
      AND editedDate <= ${endingDate}
      ${category ? Prisma.sql`AND category = ${category}` : Prisma.empty}
      ${account ? Prisma.sql`AND accountId = ${account}` : Prisma.empty}

    GROUP BY type,
      strftime('%m', datetime(editedDate/1000, 'unixepoch')),
      strftime('%Y', datetime(editedDate/1000, 'unixepoch'));
  `;
}

export async function getTransactionById(id: string) {
  return prisma.transaction.findUnique({
    where: {
      id,
    },
  });
}

export async function updateTransaction(
  id: string,
  data: Partial<CreateTransaction>,
) {
  return prisma.transaction.update({
    where: {
      id,
    },
    data,
  });
}

export async function deleteTransaction(id: string) {
  return prisma.transaction.delete({
    where: {
      id,
    },
  });
}
