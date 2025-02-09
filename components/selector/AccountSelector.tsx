"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { useRouter, useSearchParams } from "next/navigation";

type AccountSelectorProps = {
  selectedAccount?: string;
  accounts: {
    id: string;
    displayName: string;
  }[];
};

export default function AccountSelector({
  selectedAccount,
  accounts,
}: AccountSelectorProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const defaultAccount = "All accounts" as const;

  const handleAccountChange = (account: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    if (account === defaultAccount) {
      newParams.delete("account");
    } else {
      newParams.set("account", account);
    }
    newParams.delete("page");

    router.push(`?${newParams.toString()}`, { scroll: false });
  };

  const selectItems = accounts.map(({ id, displayName }) => (
    <SelectItem key={id} value={id}>
      {`${displayName}`}
    </SelectItem>
  ));

  return (
    <Select
      defaultValue={defaultAccount}
      value={selectedAccount}
      onValueChange={handleAccountChange}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Account" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem key={defaultAccount} value={defaultAccount}>
          {defaultAccount}
        </SelectItem>
        {selectItems}
      </SelectContent>
    </Select>
  );
}
