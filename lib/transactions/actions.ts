"use server";

import { db } from "../db/instance"; // Update the import to use the existing instance
import { transactionTable } from "../db/schema";
import { eq, and, gte, lte, sql, desc, SQL, sum } from "drizzle-orm";
import { CreateTransaction, TransactionsFilters } from "./types";

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
  const minDate = new Date(year, month !== undefined ? month : 0, 1);
  const maxDate = new Date(
    new Date(year, month !== undefined ? month + 1 : 12).getTime() - 1,
  );

  let query = and(
    gte(transactionTable.editedDate, minDate),
    lte(transactionTable.editedDate, maxDate),
  );

  if (account) {
    query = and(query, eq(transactionTable.accountId, account));
  }

  if (category) {
    query = and(query, eq(transactionTable.category, category));
  }

  if (type) {
    query = and(query, eq(transactionTable.type, type));
  }

  const transactions = await db
    .select()
    .from(transactionTable)
    .where(query)
    .limit(pageSize)
    .offset((page - 1) * pageSize)
    .orderBy(desc(transactionTable.editedDate));
  console.log(transactions);

  return transactions;
}

export async function createTransactions(
  transactions: CreateTransaction[],
  accountId: string,
) {
  const transactionsWithAccountId = transactions.map((transaction) => ({
    ...transaction,
    accountId: accountId,
  }));

  return db
    .insert(transactionTable)
    .values(transactionsWithAccountId)
    .returning();
}

export async function getTransactionsCount({
  type,
  year = new Date().getFullYear(),
  month,
  category,
  account,
}: TransactionsFilters) {
  const minDate = new Date(year, month !== undefined ? month : 0, 1);
  const maxDate = new Date(
    new Date(year, month !== undefined ? month + 1 : 12).getTime() - 1,
  );

  let query = and(
    gte(transactionTable.editedDate, minDate),
    lte(transactionTable.editedDate, maxDate),
  );

  if (account) {
    query = and(query, eq(transactionTable.accountId, account));
  }

  if (category) {
    query = and(query, eq(transactionTable.category, category));
  }

  if (type) {
    query = and(query, eq(transactionTable.type, type));
  }

  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(transactionTable)
    .where(query);

  return result[0].count;
}

export async function getTransactionsSumByCategory({
  type,
  year = new Date().getFullYear(),
  month,
  account,
}: TransactionsFilters) {
  const minDate = new Date(year, month !== undefined ? month : 0, 1);
  const maxDate = new Date(
    new Date(year, month !== undefined ? month + 1 : 12).getTime() - 1,
  );

  let query = and(
    gte(transactionTable.editedDate, minDate),
    lte(transactionTable.editedDate, maxDate),
  );

  if (account) {
    query = and(query, eq(transactionTable.accountId, account));
  }

  if (type) {
    query = and(query, eq(transactionTable.type, type));
  }

  return db
    .select({
      category: transactionTable.category,
      sum: sum(transactionTable.amount).as("sum"),
    })
    .from(transactionTable)
    .where(query)
    .groupBy(transactionTable.category)
    .orderBy(desc(sql`sum`));
}

export async function getTransactionsSumByYearMonthAndType(
  startingDate: Date,
  endingDate: Date,
  category?: string,
  account?: string,
) {
  let filter: SQL | undefined;
  if (category) {
    filter = eq(transactionTable.category, category);
  }

  if (account) {
    filter = and(filter, eq(transactionTable.accountId, account));
  }

  const query = and(
    gte(transactionTable.editedDate, startingDate),
    lte(transactionTable.editedDate, endingDate),
    filter,
  );

  return db
    .select({
      type: transactionTable.type,
      month:
        sql<string>`strftime('%m', datetime(${transactionTable.editedDate}/1000, 'unixepoch'))`.as(
          "month",
        ),
      year: sql<string>`strftime('%Y', datetime(${transactionTable.editedDate}/1000, 'unixepoch'))`.as(
        "year",
      ),
      total: sql<number>`SUM(${transactionTable.amount})`.as("total"),
    })
    .from(transactionTable)
    .where(query)
    .groupBy(
      transactionTable.type,
      sql`strftime('%m', datetime(${transactionTable.editedDate}/1000, 'unixepoch'))`,
      sql`strftime('%Y', datetime(${transactionTable.editedDate}/1000, 'unixepoch'))`,
    );
}

export async function getTransactionById(id: string) {
  const result = await db
    .select()
    .from(transactionTable)
    .where(eq(transactionTable.id, id))
    .limit(1);

  return result[0] || null;
}

export async function updateTransaction(
  id: string,
  data: Partial<CreateTransaction>,
) {
  return db
    .update(transactionTable)
    .set(data)
    .where(eq(transactionTable.id, id));
}

export async function deleteTransaction(id: string) {
  return db.delete(transactionTable).where(eq(transactionTable.id, id));
}
