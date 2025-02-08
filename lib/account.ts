"use server";

import prisma from "./db";

type CreateAccount = {
  alias: string;
  iban: string;
  balance: number;
};

export async function getAccounts() {
  return prisma.account.findMany();
}

export async function createAccount(account: CreateAccount) {
  return prisma.account.create({ data: account });
}
