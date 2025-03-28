import { relations } from "drizzle-orm/relations";
import { account, transaction } from "./schema";

export const transactionRelations = relations(transaction, ({ one }) => ({
  account: one(account, {
    fields: [transaction.accountId],
    references: [account.id],
  }),
}));

export const accountRelations = relations(account, ({ many }) => ({
  transactions: many(transaction),
}));
