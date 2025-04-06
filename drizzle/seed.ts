import {
  otherExpenseCategory,
  otherIncomeCategory,
} from "../lib/categories/const";
import { db } from "../lib/db/instance";
import { categoryTable } from "../lib/db/schema";

async function initCategories() {
  if (
    !(await db.query.categoryTable.findFirst({
      where: (category, { eq }) => eq(category.name, otherExpenseCategory.name),
    }))
  ) {
    await db.insert(categoryTable).values(otherExpenseCategory);
    console.log(
      `Created category: ${otherExpenseCategory.name} (${otherExpenseCategory.type})`,
    );
  }

  if (
    !(await db.query.categoryTable.findFirst({
      where: (category, { eq }) => eq(category.name, otherIncomeCategory.name),
    }))
  ) {
    await db.insert(categoryTable).values(otherIncomeCategory);
    console.log(
      `Created category: ${otherIncomeCategory.name} (${otherIncomeCategory.type})`,
    );
  }
}

initCategories()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  });
