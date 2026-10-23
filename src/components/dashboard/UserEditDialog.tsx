"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateUserProfile } from "@/lib/supabase/admin-actions";

export function UserEditDialog({
  userId,
  defaultFullName,
  defaultPhone,
  defaultCompanyName,
}: {
  userId: string;
  defaultFullName: string;
  defaultPhone: string;
  defaultCompanyName: string;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [fullName, setFullName] = useState(defaultFullName);
  const [phone, setPhone] = useState(defaultPhone);
  const [companyName, setCompanyName] = useState(defaultCompanyName);

  function handleSave() {
    startTransition(async () => {
      try {
        await updateUserProfile(userId, { fullName, phone, companyName });
        toast.success("Podatki uporabnika posodobljeni.");
        setOpen(false);
      } catch {
        toast.error("Napaka pri shranjevanju podatkov.");
      }
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) {
          setFullName(defaultFullName);
          setPhone(defaultPhone);
          setCompanyName(defaultCompanyName);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          Uredi
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Uredi uporabnika</DialogTitle>
          <DialogDescription>Sprememba se shrani takoj, uporabnik je ne potrdi.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="edit-full-name">Ime in priimek</Label>
            <Input id="edit-full-name" value={fullName} onChange={(event) => setFullName(event.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="edit-phone">Telefon</Label>
            <Input id="edit-phone" value={phone} onChange={(event) => setPhone(event.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="edit-company">Podjetje</Label>
            <Input id="edit-company" value={companyName} onChange={(event) => setCompanyName(event.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" disabled={pending} onClick={() => setOpen(false)}>
            Prekliči
          </Button>
          <Button type="button" disabled={pending} onClick={handleSave}>
            {pending ? "Shranjevanje …" : "Shrani"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
