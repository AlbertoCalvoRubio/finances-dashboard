export const CATEGORY_TYPE = {
  EXPENSE: "EXPENSE",
  INCOME: "INCOME",
  EXCLUDED: "EXCLUDED",
} as const;
export const CATEGORY_TYPES = [
  CATEGORY_TYPE.EXPENSE,
  CATEGORY_TYPE.INCOME,
  CATEGORY_TYPE.EXCLUDED,
] as const;
export type CategoryType = (typeof CATEGORY_TYPES)[number];
