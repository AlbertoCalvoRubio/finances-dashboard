import { sqliteTable, text, real, numeric } from "drizzle-orm/sqlite-core";

export const account = sqliteTable("Account", {
  id: text().primaryKey().notNull(),
  iban: text().notNull(),
  alias: text(),
  balance: real().notNull(),
});

export const transaction = sqliteTable("Transaction", {
  id: text().primaryKey().notNull(),
  accountId: text()
    .notNull()
    .references(() => account.id, {
      onDelete: "restrict",
      onUpdate: "cascade",
    }),
  type: text().notNull(),
  date: numeric().notNull(),
  editedDate: numeric().notNull(),
  category: text().notNull(),
  amount: real().notNull(),
  concept: text().notNull(),
  comment: text(),
});
