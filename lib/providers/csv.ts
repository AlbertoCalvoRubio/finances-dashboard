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

export function processFile(
  file: File,
  type: CsvProvider,
): Promise<CreateTransaction[]> {
  return new Promise((resolve, reject) => {
    if (file.name.endsWith(".csv") && file.type === "text/csv") {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const csvData = reader.result as string;
          const transactions = transformCsv(csvData, type);
          resolve(transactions);
        } catch (error) {
          console.error(error);
          reject(error);
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    } else {
      resolve([]);
    }
  });
}
