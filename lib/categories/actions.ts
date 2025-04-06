"use server";

import { sql } from "drizzle-orm";
import { db } from "../db/instance";
import { Category } from "../db/schema";
import { CategoryType } from "./types";

function findCategoryByTextAndType(text: string, type: CategoryType) {
  console.log(`Searching for category with text: ${text} and type: ${type}`);
  return db.query.categoryTable.findFirst({
    with: {
      keywords: {
        where: (keyword) =>
          sql`LOWER(${text}) LIKE LOWER('%' || ${keyword.keyword} || '%')`,
      },
    },
    where: (category, { eq }) => eq(category.type, type),
    orderBy: (table, { asc }) => [asc(table.position)],
  });
}

export async function getAllCategories() {
  return db.query.categoryTable.findMany({
    orderBy: (table, { asc }) => [asc(table.name)],
  });
}

export async function categoriseTransaction(
  text: string,
  amount: number,
): Promise<Category | undefined> {
  let category: Category | undefined;
  if (amount <= 0) {
    category =
      (await findCategoryByTextAndType(text, "EXPENSE")) ??
      (await findCategoryByTextAndType(text, "EXCLUDED"));
  } else if (amount > 0) {
    category =
      (await findCategoryByTextAndType(text, "INCOME")) ??
      (await findCategoryByTextAndType(text, "EXCLUDED"));
  }

  return category;
}
