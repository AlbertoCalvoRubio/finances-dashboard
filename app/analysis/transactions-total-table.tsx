import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "../../components/ui/table";
import { formatCurrency } from "./utils";

type TransactionsTotalTableProps = {
  income: number;
  expense: number;
  net: number;
};

export default function TransactionsTotalTable({
  income,
  expense,
  net,
}: TransactionsTotalTableProps) {
  const summaryTableCellClassName = "w-1/2 font-bold";

  return (
    <Table className="">
      <TableBody>
        <TableRow>
          <TableCell className={summaryTableCellClassName}>Income</TableCell>
          <TableCell className={summaryTableCellClassName}>
            {formatCurrency(income)}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className={summaryTableCellClassName}>Expense</TableCell>
          <TableCell className={summaryTableCellClassName}>
            {" "}
            {formatCurrency(expense)}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className={summaryTableCellClassName}>Net</TableCell>
          <TableCell className={summaryTableCellClassName}>
            {formatCurrency(net)}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
