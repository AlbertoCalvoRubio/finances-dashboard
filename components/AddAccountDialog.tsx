"use client";

import { useState } from "react";
import { AccountForm } from "./AccountForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

export default function AddAccountDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="my-3 rounded bg-primary px-3 py-2 text-white">
        Add account
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New account</DialogTitle>
          <DialogDescription>
            Add a new account to your finances dashboard.
          </DialogDescription>
        </DialogHeader>
        <AccountForm onSubmit={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
