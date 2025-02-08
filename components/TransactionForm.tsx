"use client";

import { z } from "zod";
import { format } from "@formkit/tempo";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Transaction } from "@prisma/client";
import { updateTransaction } from "../lib/transactions/actions";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { CATEGORY_MAP, getTypeFromCategory } from "../lib/categories";

const formSchema = z.object({
  comment: z.string().optional(),
  category: z.string().optional(),
  editedDate: z.string().optional(),
});

interface TransactionFormProps {
  transaction: Transaction;
}

export function TransactionForm({ transaction }: TransactionFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      comment: transaction.comment || "",
      category: transaction.category || "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const newValues = {
      ...values,
      editedDate: values.editedDate
        ? new Date(Date.parse(values.editedDate))
        : undefined,
      type:
        values.category !== undefined
          ? getTypeFromCategory(values.category)
          : undefined,
    };

    updateTransaction(transaction.id, newValues)
      .then(() => {
        toast.success("Transaction updated");
      })
      .catch(() => {
        toast.error("Failed to update transaction");
      });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Read-only fields */}
        <div>
          <FormLabel>Date</FormLabel>
          <Input
            id="date"
            className="w-auto"
            type="date"
            readOnly
            disabled
            value={format(transaction.date, "YYYY-MM-DD")}
          />
        </div>
        <div>
          <FormLabel>Amount</FormLabel>
          <Input
            id="amount"
            className="w-auto"
            type="number"
            readOnly
            disabled
            value={transaction.amount.toString()}
          />
        </div>
        <div>
          <FormLabel>Type</FormLabel>
          <Input
            id="type"
            className="w-auto"
            readOnly
            disabled
            value={transaction.type}
          />
        </div>
        <div>
          <FormLabel>Concept</FormLabel>
          <Input
            id="concept"
            className="w-full"
            readOnly
            disabled
            value={transaction.concept}
          />
        </div>

        {/* Editable fields */}
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={transaction.category}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem disabled key="Income" value="income">
                    {"Income"}
                  </SelectItem>
                  {Object.entries(CATEGORY_MAP.INCOME).map(
                    ([categoryKey, { displayName, icon }]) => (
                      <SelectItem key={categoryKey} value={categoryKey}>
                        {`${icon} ${displayName}`}
                      </SelectItem>
                    ),
                  )}
                  <SelectItem disabled key="Expense" value="expense">
                    {"Expense"}
                  </SelectItem>
                  {Object.entries(CATEGORY_MAP.EXPENSE).map(
                    ([categoryKey, { displayName, icon }]) => (
                      <SelectItem key={categoryKey} value={categoryKey}>
                        {`${icon} ${displayName}`}
                      </SelectItem>
                    ),
                  )}
                  <SelectItem disabled key="Excluded" value="excluded">
                    {"Excluded"}
                  </SelectItem>
                  {Object.entries(CATEGORY_MAP.EXCLUDED).map(
                    ([categoryKey, { displayName, icon }]) => (
                      <SelectItem key={categoryKey} value={categoryKey}>
                        {`${icon} ${displayName}`}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="editedDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Edited Date</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  id="editedDate"
                  type="date"
                  className="w-auto"
                  placeholder="Enter a new date"
                  value={
                    field.value?.length
                      ? field.value
                      : format(transaction.date, "YYYY-MM-DD")
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Comment</FormLabel>
              <FormControl>
                <Input id="comment" {...field} placeholder="Enter comment" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Update</Button>
      </form>
    </Form>
  );
}
