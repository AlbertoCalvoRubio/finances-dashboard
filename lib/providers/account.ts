import Papa from "papaparse";
import z from "zod";
import { CreateTransaction } from "../transactions/types";
import { parse } from "@formkit/tempo";
import { extractCategory } from "../categories";

const floatNumberProcessed = z.preprocess((val) => {
  const valParsed = parseFloat(val as string);
  return isNaN(valParsed) ? undefined : valParsed;
}, z.number());

const csvParsedTransactionSchema = z.object({
  "Account number": z.string(),
  "Purchase date": z.string(),
  Amount: floatNumberProcessed,
  "Booking text": z.string(),
});

const transactionsSchema = z.array(csvParsedTransactionSchema);

function transformParsedCsvToTransactions(
  data: unknown[],
): CreateTransaction[] {
  const result = transactionsSchema.safeParse(data);
  if (!result.success) {
    console.error(result.error);
    throw new Error("Error parsing CSV data");
  }

  return result.data.map((item) => {
    const date = parse(item["Purchase date"], "DD.MM.YYYY");
    const amount = -item.Amount;
    const concept = item["Booking text"];
    const category = extractCategory(concept, amount);

    return {
      type: "EXPENSE",
      date,
      editedDate: date,
      category,
      amount,
      concept,
      comment: "",
    };
  });
}

export function transformBank1AccountCsvData(csvData: string) {
  const lines = csvData.split("\n").slice(1, -3).join("\n");
  const parsedData = Papa.parse(lines, { header: true });
  return transformParsedCsvToTransactions(parsedData.data);
}
