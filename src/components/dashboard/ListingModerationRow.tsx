"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { approveListingSubmission, rejectListingSubmission } from "@/lib/supabase/admin-actions";
import { formatPrice, formatDateTimeSl } from "@/lib/format";

interface Props {
  id: string;
  title: string;
  price: number;
  location: string;
  contactName: string;
  contactEmail: string;
  createdAt: string;
  status: "pending_review" | "published" | "rejected";
  rejectionReason: string | null;
}

const STATUS_LABELS: Record<Props["status"], { label: string; className: string }> = {
  pending_review: { label: "V pregledu", className: "bg-accent text-primary" },
  published: { label: "Objavljeno", className: "bg-secondary text-primary" },
  rejected: { label: "Zavrnjeno", className: "bg-destructive/10 text-destructive" },
};

export function ListingModerationRow({
  id,
  title,
  price,
  location,
  contactName,
  contactEmail,
  createdAt,
  status,
  rejectionReason,
}: Props) {
  const [pending, startTransition] = useTransition();
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");
  const statusMeta = STATUS_LABELS[status];

  function handleApprove() {
    startTransition(async () => {
      try {
        await approveListingSubmission(id);
        toast.success("Oglas odobren in objavljen.");
      } catch {
        toast.error("Napaka pri odobritvi oglasa.");
      }
    });
  }

  function handleReject() {
    startTransition(async () => {
      try {
        await rejectListingSubmission(id, reason);
        toast.success("Oglas zavrnjen, obrazložitev poslana.");
        setRejecting(false);
        setReason("");
      } catch {
        toast.error("Napaka pri zavrnitvi oglasa.");
      }
    });
  }

  return (
    <div data-testid="listing-moderation-row" className="rounded-[14px] border border-border bg-card p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-foreground">{title}</p>
          <p className="text-sm text-muted-foreground">
            {location} &middot; {formatPrice(price)} &middot; oddano {formatDateTimeSl(createdAt)}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {contactName} &middot; {contactEmail}
          </p>
          {status === "rejected" && rejectionReason && (
            <p className="mt-2 rounded-[8px] bg-destructive/10 px-3 py-2 text-sm text-destructive">
              Razlog: {rejectionReason}
            </p>
          )}
        </div>
        <span className={`shrink-0 rounded-[6px] px-2.5 py-1 text-xs font-semibold ${statusMeta.className}`}>
          {statusMeta.label}
        </span>
      </div>

      {status === "pending_review" && (
        <div className="mt-3 flex flex-wrap gap-2">
          <ConfirmDialog
            trigger={
              <Button size="sm" disabled={pending} className="bg-primary text-primary-foreground hover:bg-brand-hover">
                Odobri
              </Button>
            }
            title="Odobri in objavi oglas?"
            description={`Oglas "${title}" bo objavljen, prodajalec pa bo prejel e-poštno obvestilo.`}
            confirmLabel="Odobri"
            onConfirm={handleApprove}
          />

          {!rejecting ? (
            <Button size="sm" variant="outline" disabled={pending} onClick={() => setRejecting(true)}>
              Zavrni
            </Button>
          ) : (
            <div className="mt-2 w-full space-y-2">
              <textarea
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                placeholder="Razlog za zavrnitev (prodajalec ga bo videl v e-pošti) …"
                rows={2}
                className="w-full rounded-[10px] border border-border bg-background p-2.5 text-sm text-foreground focus-visible:border-ring focus-visible:outline-none"
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="destructive"
                  disabled={pending || reason.trim().length < 3}
                  onClick={handleReject}
                >
                  Pošlji zavrnitev
                </Button>
                <Button size="sm" variant="outline" disabled={pending} onClick={() => setRejecting(false)}>
                  Prekliči
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
