"use client";

import { useActionState, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { submitInquiry, type InquiryActionState } from "@/lib/supabase/inquiries";

const initialState: InquiryActionState = {};

interface InquiryModalProps {
  trigger: React.ReactNode;
  listingSlug: string;
  listingTitle: string;
  sellerName: string;
}

export function InquiryModal({ trigger, listingSlug, listingTitle, sellerName }: InquiryModalProps) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(submitInquiry, initialState);

  // Controlled so a server-side validation error (e.g. message too short)
  // doesn't wipe the other fields — React resets uncontrolled <form> inputs
  // after every action call, success or failure.
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState(`Zanima me oglas "${listingTitle}". Prosim za več informacij.`);

  const listingUrl =
    typeof window !== "undefined" ? `${window.location.origin}/oglasi/${listingSlug}` : `/oglasi/${listingSlug}`;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        {state.success ? (
          <>
            <DialogHeader>
              <DialogTitle>Povpraševanje je oddano</DialogTitle>
              <DialogDescription>
                Prodajalec {sellerName} bo v kratkem prejel vaše sporočilo in vas kontaktiral na navedeni naslov.
              </DialogDescription>
            </DialogHeader>
            <Button onClick={() => setOpen(false)} className="bg-primary text-primary-foreground hover:bg-brand-hover">
              Zapri
            </Button>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Pošlji povpraševanje</DialogTitle>
              <DialogDescription>Vaše kontaktne podatke bo prejel prodajalec: {sellerName}.</DialogDescription>
            </DialogHeader>
            <form action={formAction} className="space-y-4">
              <input type="hidden" name="listingSlug" value={listingSlug} />
              <input type="hidden" name="listingTitle" value={listingTitle} />
              <input type="hidden" name="listingUrl" value={listingUrl} />
              <input type="hidden" name="sellerName" value={sellerName} />

              <div className="space-y-1.5">
                <Label htmlFor="inquiry-name">Ime in priimek</Label>
                <Input
                  id="inquiry-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="inquiry-email">E-poštni naslov</Label>
                <Input
                  id="inquiry-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="inquiry-phone">Telefon (neobvezno)</Label>
                <Input
                  id="inquiry-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="inquiry-message">Sporočilo</Label>
                <textarea
                  id="inquiry-message"
                  name="message"
                  rows={4}
                  required
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  className="w-full rounded-[10px] border border-border bg-background p-3 text-sm text-foreground focus-visible:border-ring focus-visible:outline-none"
                />
              </div>

              {state.error && (
                <p role="alert" className="rounded-[10px] bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {state.error}
                </p>
              )}

              <Button
                type="submit"
                disabled={pending}
                className="w-full bg-primary text-primary-foreground hover:bg-brand-hover"
              >
                {pending ? "Pošiljanje …" : "Pošlji povpraševanje"}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
