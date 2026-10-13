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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { reportListing, REPORT_REASONS, type ReportListingActionState } from "@/lib/supabase/listing-reports";

const initialState: ReportListingActionState = {};

interface ReportListingModalProps {
  trigger: React.ReactNode;
  listingSlug: string;
  listingTitle: string;
  // "/oglasi" for house listings (default), "/zemljisca" for land.
  basePath?: string;
}

export function ReportListingModal({ trigger, listingSlug, listingTitle, basePath = "/oglasi" }: ReportListingModalProps) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(reportListing, initialState);

  const [reason, setReason] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const listingUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}${basePath}/${listingSlug}`
      : `${basePath}/${listingSlug}`;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        {state.success ? (
          <>
            <DialogHeader>
              <DialogTitle>Prijava je oddana</DialogTitle>
              <DialogDescription>
                Hvala za prijavo. Oglas bomo pregledali in se po potrebi odzvali.
              </DialogDescription>
            </DialogHeader>
            <Button onClick={() => setOpen(false)} className="bg-primary text-primary-foreground hover:bg-brand-hover">
              Zapri
            </Button>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Prijavi oglas</DialogTitle>
              <DialogDescription>
                Prijavite oglas &quot;{listingTitle}&quot;, če menite, da krši pogoje uporabe ali
                zakonodajo.
              </DialogDescription>
            </DialogHeader>
            <form action={formAction} className="space-y-4">
              <input type="hidden" name="listingSlug" value={listingSlug} />
              <input type="hidden" name="listingTitle" value={listingTitle} />
              <input type="hidden" name="listingUrl" value={listingUrl} />
              <input type="hidden" name="reason" value={reason} />

              <div className="space-y-1.5">
                <Label htmlFor="report-reason">Razlog prijave</Label>
                <Select value={reason} onValueChange={setReason}>
                  <SelectTrigger id="report-reason" className="w-full">
                    <SelectValue placeholder="Izberite razlog" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(REPORT_REASONS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="report-name">Ime in priimek</Label>
                <Input
                  id="report-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="report-email">E-poštni naslov</Label>
                <Input
                  id="report-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="report-message">Opis razloga</Label>
                <textarea
                  id="report-message"
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
                disabled={pending || !reason}
                className="w-full bg-primary text-primary-foreground hover:bg-brand-hover"
              >
                {pending ? "Pošiljanje …" : "Oddaj prijavo"}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
