"use server";

import { revalidatePath } from "next/cache";
import prisma from "./db";

type CreateAccount = {
  alias?: string;
  iban: string;
  balance: number;
};

export async function getAccounts() {
  return prisma.account.findMany();
}

export async function createAccount(account: CreateAccount) {
  const createdAccount = await prisma.account.create({ data: account });
  revalidatePath("/");

  return createdAccount;
}
