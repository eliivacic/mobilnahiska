import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";

export const metadata: Metadata = { title: "Piškotki | mobilnahiska.si" };

export default function PiskotkiPage() {
  return (
    <PageShell className="py-8">
      <article>
        <h1 className="font-heading text-3xl font-light tracking-[-0.01em] text-foreground sm:text-4xl">
          Piškotki
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">Veljavno od 23. septembra 2026.</p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-foreground/90">
          <section>
            <h2 className="mb-2 text-base font-semibold text-foreground">Kaj so piškotki</h2>
            <p>
              Piškotki so majhne besedilne datoteke, ki jih spletna stran shrani v vaš brskalnik, da si
              zapomni informacije o vašem obisku.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-foreground">Katere piškotke uporabljamo</h2>
            <p>
              Portal uporablja nujno potrebne piškotke za delovanje prijave in ohranjanje vaše seje
              (avtentikacija prek Supabase). Trenutno ne uporabljamo analitičnih ali oglaševalskih
              piškotkov tretjih oseb.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-foreground">Upravljanje piškotkov</h2>
            <p>
              Piškotke lahko kadarkoli izbrišete ali blokirate v nastavitvah svojega brskalnika. Ker so
              piškotki za prijavo nujno potrebni za delovanje računa, njihova blokada onemogoči prijavo v
              portal.
            </p>
          </section>
        </div>
      </article>
    </PageShell>
  );
}
