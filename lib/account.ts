"use server";

import { revalidatePath } from "next/cache";
import { db } from "./db/instance";
import { accountTable } from "./db/schema";

type CreateAccount = {
  alias?: string;
  iban: string;
  balance: number;
};

export async function getAccounts() {
  return db.select().from(accountTable);
}

export async function createAccount(account: CreateAccount) {
  const createdAccount = await db
    .insert(accountTable)
    .values(account)
    .returning();
  revalidatePath("/");

  return createdAccount;
}
