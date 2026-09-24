import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { pluralizeSl } from "@/lib/format";

export const metadata: Metadata = {
  title: "Paketi in cenik | mobilnahiska.si",
  description: "Primerjajte pakete za oglaševanje na mobilnahiska.si in izberite tistega, ki ustreza vašim potrebam.",
};

interface Plan {
  id: string;
  name: string;
  price_cents: number;
  billing_period: string;
  max_active_listings: number;
  description: string | null;
}

export default async function CenePage() {
  const supabase = await createClient();

  const [{ data: plans }, { data: contactSetting }, { data: userData }] = await Promise.all([
    supabase.from("plans").select("*").eq("is_active", true).order("price_cents", { ascending: true }),
    supabase.from("portal_settings").select("value").eq("key", "contact_email").single(),
    supabase.auth.getUser(),
  ]);

  const contactEmail = contactSetting?.value;
  const isLoggedIn = !!userData.user;

  return (
    <PageShell className="py-12">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-heading text-3xl font-light tracking-[-0.01em] text-foreground sm:text-4xl">
          Paketi za ponudnike
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Izberite paket, ki ustreza obsegu vaše ponudbe. Vsi paketi vključujejo objavo oglasov, urejanje profila
          in dostop do nadzorne plošče.
        </p>
      </div>

      {!plans || plans.length === 0 ? (
        <div className="mx-auto mt-10 max-w-lg rounded-[14px] border border-dashed border-border p-8 text-center">
          <p className="text-sm font-semibold text-foreground">Paketi trenutno niso na voljo.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Cenik še ni bil nastavljen v administraciji portala. Kontaktirajte nas za več informacij.
          </p>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {(plans as Plan[]).map((plan) => {
            const isFree = plan.price_cents === 0;
            const ctaHref = isLoggedIn
              ? "/moj-racun/paket"
              : isFree
                ? "/registracija?returnTo=%2Fmoj-racun%2Fpaket"
                : contactEmail
                  ? `mailto:${contactEmail}?subject=${encodeURIComponent(`Zanima me paket ${plan.name}`)}`
                  : "/registracija?returnTo=%2Fmoj-racun%2Fpaket";
            const ctaLabel = isLoggedIn
              ? "Upravljaj svoj paket"
              : isFree
                ? "Ustvari brezplačen račun"
                : contactEmail
                  ? "Kontaktiraj nas"
                  : "Ustvari račun";

            return (
              <div
                key={plan.id}
                className="flex flex-col rounded-[14px] border border-border bg-card p-6 shadow-lift"
              >
                <p className="font-semibold text-foreground">{plan.name}</p>
                <p className="mt-2 font-heading text-3xl font-light tracking-[-0.01em] text-foreground">
                  {isFree ? "Brezplačno" : `${(plan.price_cents / 100).toFixed(0)} €`}
                  {!isFree && (
                    <span className="text-sm font-normal text-muted-foreground">
                      {" "}
                      / {plan.billing_period === "monthly" ? "mesec" : plan.billing_period}
                    </span>
                  )}
                </p>

                <ul className="mt-5 flex-1 space-y-2.5 text-sm text-foreground/90">
                  {plan.description && (
                    <li className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                      {plan.description}
                    </li>
                  )}
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                    Do {plan.max_active_listings}{" "}
                    {pluralizeSl(plan.max_active_listings, ["aktiven oglas", "aktivna oglasa", "aktivni oglasi", "aktivnih oglasov"])}{" "}
                    naenkrat
                  </li>
                </ul>

                <Button asChild className="mt-6 w-full bg-primary text-primary-foreground hover:bg-brand-hover">
                  <Link href={ctaHref}>{ctaLabel}</Link>
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </PageShell>
  );
}
