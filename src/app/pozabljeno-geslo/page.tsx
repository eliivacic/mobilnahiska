import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = { title: "Pozabljeno geslo | mobilnahiska.si" };

export default function PozabljenoGesloPage() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-md">
        <h1 className="font-heading text-3xl font-light tracking-[-0.01em] text-foreground">Pozabljeno geslo</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Vnesite e-poštni naslov svojega računa in poslali vam bomo povezavo za ponastavitev gesla.
        </p>
        <div className="mt-8 rounded-[14px] border border-border bg-card p-6 shadow-lift">
          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  );
}
