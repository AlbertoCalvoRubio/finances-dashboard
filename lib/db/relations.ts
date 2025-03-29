import { relations } from "drizzle-orm/relations";
import { accountTable, transactionTable } from "./schema";

export const transactionRelations = relations(transactionTable, ({ one }) => ({
  account: one(accountTable, {
    fields: [transactionTable.accountId],
    references: [accountTable.id],
  }),
}));

export const accountRelations = relations(accountTable, ({ many }) => ({
  transactions: many(transactionTable),
}));
