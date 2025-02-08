import { parse } from "@formkit/tempo";
import { z } from "zod";
import Papa from "papaparse";
import { extractCategory } from "../categories";
import { CreateTransaction } from "../transactions/types";

const floatNumberProcessedOptional = z.preprocess((val) => {
  const valParsed = parseFloat(val as string);
  return isNaN(valParsed) ? undefined : valParsed;
}, z.number().optional());
const floatNumberProcessed = z.preprocess((val) => {
  const valParsed = parseFloat(val as string);
  return isNaN(valParsed) ? undefined : valParsed;
}, z.number());

const csvParsedTransactionSchema = z.object({
  "Trade date": z.string(),
  "Trade time": z.string(),
  "Booking date": z.string(),
  "Value date": z.string(),
  Currency: z.string(),
  Debit: floatNumberProcessedOptional,
  Credit: floatNumberProcessedOptional,
  Balance: floatNumberProcessed,
  "Transaction no.": z.string(),
  Description1: z.string(),
  Description2: z.string().optional(),
  Description3: z.string().optional(),
  Footnotes: z.string().optional(),
});

const transactionsSchema = z.array(csvParsedTransactionSchema);

function transformParsedCsvToTransactions(
  data: unknown[],
): CreateTransaction[] {
  const result = transactionsSchema.safeParse(data);
  if (!result.success) {
    console.error(result.error);
    return [];
  }

  return result.data.map((item) => {
    const date = parse(item["Trade date"], "YYYY-MM-DD");
    const amount = item.Credit || item.Debit || 0;
    const concept = item.Description1 || "";
    const category = extractCategory(concept, amount);

    return {
      type: amount > 0 ? "INCOME" : "EXPENSE",
      date,
      editedDate: date,
      category,
      amount,
      concept,
      comment: "",
    };
  });
}

export function transformBank1CardCsvData(csvData: string) {
  const lines = csvData.split("\n").slice(9).join("\n");
  const parsedData = Papa.parse(lines, { header: true });
  return transformParsedCsvToTransactions(parsedData.data);
}
