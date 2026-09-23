"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const DISMISSED_KEY = "mobilnahiska-for-sale-dismissed";

export function SiteForSaleDialog() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(DISMISSED_KEY)) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sessionStorage is only readable after mount
    setOpen(true);
  }, []);

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      sessionStorage.setItem(DISMISSED_KEY, "1");
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-lg">Ta spletna stran je naprodaj</DialogTitle>
          <DialogDescription>
            Za informacije o nakupu pišite na{" "}
            <a href="mailto:info@veloria.si" className="font-semibold text-brand">
              info@veloria.si
            </a>
            .
          </DialogDescription>
        </DialogHeader>
        <Button
          className="w-full bg-brand text-brand-foreground hover:bg-brand-hover"
          onClick={() => handleOpenChange(false)}
        >
          Razumem
        </Button>
      </DialogContent>
    </Dialog>
  );
}
