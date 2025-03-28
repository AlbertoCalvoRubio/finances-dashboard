import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

export const db = drizzle(process.env.DATABASE_URL!, {
  logger: true,
  schema,
});
