import { randomUUID } from "crypto";
import { sqliteTable, text, real, integer } from "drizzle-orm/sqlite-core";

export const accountTable = sqliteTable("Account", {
  id: text()
    .primaryKey()
    .notNull()
    .$defaultFn(() => randomUUID()),
  iban: text().notNull(),
  alias: text(),
  balance: real().notNull(),
});

export type Account = typeof accountTable.$inferSelect;
export const transactionTable = sqliteTable("Transaction", {
  id: text()
    .primaryKey()
    .notNull()
    .$defaultFn(() => randomUUID()),
  accountId: text()
    .notNull()
    .references(() => accountTable.id, {
      onDelete: "restrict",
      onUpdate: "cascade",
    }),
  type: text().notNull(),
  date: integer("date", { mode: "timestamp_ms" }).notNull(),
  editedDate: integer("editedDate", { mode: "timestamp_ms" }).notNull(),
  category: text().notNull(),
  amount: real().notNull(),
  concept: text().notNull(),
  comment: text(),
});
export type Transaction = typeof transactionTable.$inferSelect;
