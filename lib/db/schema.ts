import { randomUUID } from "crypto";
import {
  sqliteTable,
  text,
  real,
  integer,
  check,
} from "drizzle-orm/sqlite-core";
import { CATEGORY_TYPES } from "../categories/types";
import { relations, sql } from "drizzle-orm";

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
  date: integer("date", { mode: "timestamp_ms" }).notNull(),
  editedDate: integer("editedDate", { mode: "timestamp_ms" }).notNull(),
  category: text()
    .notNull()
    .references(() => categoryTable.name),
  amount: real().notNull(),
  concept: text().notNull(),
  comment: text(),
});
export type Transaction = typeof transactionTable.$inferSelect;

export const categoryTable = sqliteTable(
  "Category",
  {
    name: text().primaryKey(),
    position: integer().notNull(),
    type: text({ enum: CATEGORY_TYPES }).notNull(),
    icon: text().notNull(),
    color: text().notNull(),
  },
  (table) => [
    // Use a static string constraint instead of parameterized values
    check(
      "validCategoryType",
      sql`${table.type} IN ('EXCLUDED', 'EXPENSE', 'INCOME')`,
    ),
  ],
);
export type Category = typeof categoryTable.$inferSelect;
export type CategoryInsert = typeof categoryTable.$inferInsert;

export const categoriesKeywordsTable = sqliteTable("CategoriesKeywords", {
  id: integer().primaryKey(),
  categoryName: text()
    .notNull()
    .references(() => categoryTable.name, { onDelete: "cascade" }),
  keyword: text().notNull(),
});

export const transactionRelations = relations(transactionTable, ({ one }) => ({
  account: one(accountTable, {
    fields: [transactionTable.accountId],
    references: [accountTable.id],
  }),
  category: one(categoryTable, {
    fields: [transactionTable.category],
    references: [categoryTable.name],
  }),
}));
export type TransactionWithCategory = Transaction & {
  category: Category;
};

export const accountRelations = relations(accountTable, ({ many }) => ({
  transactions: many(transactionTable),
}));

export const categoriesRelations = relations(categoryTable, ({ many }) => ({
  keywords: many(categoriesKeywordsTable),
  transactions: many(transactionTable),
}));

export const categoryKeywordsRelations = relations(
  categoriesKeywordsTable,
  ({ one }) => ({
    category: one(categoryTable, {
      fields: [categoriesKeywordsTable.categoryName],
      references: [categoryTable.name],
    }),
  }),
);
