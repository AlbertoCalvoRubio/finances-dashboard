import { transformBank1CardCsvData } from "./card";
import { transformBank1AccountCsvData } from "./account";
import { CreateTransaction } from "../transactions/types";

export const CSV_PROVIDER = {
  BANK_1_ACCOUNT: "BANK_1_ACCOUNT",
  BANK_1_CARD: "BANK_1_CARD",
} as const;
export type CsvProvider = (typeof CSV_PROVIDER)[keyof typeof CSV_PROVIDER];

function transformCsv(csvData: string, type: CsvProvider) {
  switch (type) {
    case CSV_PROVIDER.BANK_1_CARD:
      return transformBank1AccountCsvData(csvData);
    case CSV_PROVIDER.BANK_1_ACCOUNT:
      return transformBank1CardCsvData(csvData);
    default:
      throw new Error("Invalid CSV provider");
  }
}

export async function processFile(
  file: File,
  type: CsvProvider,
): Promise<CreateTransaction[]> {
  const csvData = await new Promise<string | undefined>((resolve, reject) => {
    if (file.name.endsWith(".csv") && file.type === "text/csv") {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const csvData = reader.result as string;
          resolve(csvData);
        } catch (error) {
          console.error(error);
          reject(error);
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    } else {
      resolve(undefined);
    }
  });
  if (!csvData) {
    throw new Error("Invalid CSV file");
  }

  const transactions = await transformCsv(csvData, type);
  console.log("Transactions from CSV:", transactions);

  return transactions;
}
