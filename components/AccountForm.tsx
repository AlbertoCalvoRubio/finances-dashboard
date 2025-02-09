"use client";

import { z } from "zod";
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
import { toast } from "sonner";

import { createAccount } from "../lib/account";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  iban: z.string(),
  alias: z.string().optional(),
  balance: z.coerce.number(),
});

type AccountFormProps = {
  onSubmit: () => void;
};

export function AccountForm({ onSubmit }: AccountFormProps) {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      iban: "",
      balance: 0,
    },
  });

  const onSubmitForm = async (values: z.infer<typeof formSchema>) => {
    try {
      await createAccount(values);
      toast.success("Account created");
      router.refresh();
      onSubmit();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create account");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmitForm)} className="space-y-4">
        <FormField
          control={form.control}
          name="alias"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alias</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  id="alias"
                  {...field}
                  placeholder="Enter alias"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="iban"
          render={({ field }) => (
            <FormItem>
              <FormLabel>IBAN</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  id="iban"
                  {...field}
                  placeholder="Enter iban"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="balance"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Balance</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  id="alias"
                  {...field}
                  placeholder="Enter alias"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Add</Button>
      </form>
    </Form>
  );
}
