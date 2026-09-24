import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SettingsSectionForm } from "@/components/admin/SettingsSectionForm";

export const metadata: Metadata = { title: "Nastavitve | Admin | mobilnahiska.si" };

export default async function AdminNastavitvePage() {
  const admin = createAdminClient();
  const { data: rows } = await admin.from("portal_settings").select("key, value");
  const settings = Object.fromEntries((rows ?? []).map((row) => [row.key, row.value ?? ""]));

  // Payment/email integrations are checked by env var presence only — never
  // read or display the actual secret values here.
  const stripeConnected = Boolean(process.env.STRIPE_SECRET_KEY);
  const emailConnected = Boolean(process.env.RESEND_API_KEY);

  return (
    <div>
      <h1 className="font-heading text-2xl font-light tracking-[-0.01em] text-foreground">Nastavitve portala</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Urejanje kontaktnih podatkov, SEO privzetih vrednosti in stanja povezanih storitev.
      </p>

      <Tabs defaultValue="splosno" className="mt-6">
        <TabsList>
          <TabsTrigger value="splosno">Splošno</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="placila">Plačila</TabsTrigger>
          <TabsTrigger value="email">E-pošta</TabsTrigger>
        </TabsList>

        <TabsContent value="splosno" className="max-w-lg">
          <SettingsSectionForm
            fields={[
              {
                key: "contact_email",
                label: "Kontaktni e-poštni naslov",
                defaultValue: settings.contact_email ?? "",
                type: "email",
                placeholder: "info@mobilnahiska.si",
              },
              {
                key: "contact_phone",
                label: "Kontaktna telefonska številka",
                defaultValue: settings.contact_phone ?? "",
                type: "tel",
                placeholder: "+386 1 234 56 78",
              },
            ]}
          />
        </TabsContent>

        <TabsContent value="seo" className="max-w-lg">
          <SettingsSectionForm
            fields={[
              {
                key: "seo_default_title",
                label: "Privzeti SEO naslov",
                defaultValue: settings.seo_default_title ?? "",
              },
              {
                key: "seo_default_description",
                label: "Privzeti SEO opis",
                defaultValue: settings.seo_default_description ?? "",
                type: "textarea",
              },
            ]}
          />
        </TabsContent>

        <TabsContent value="placila" className="max-w-lg">
          <div className="rounded-[14px] border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">Plačilni ponudnik</p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {stripeConnected ? "Povezano" : "Ni povezano — doda se ob registraciji podjetja stranke."}
                </p>
              </div>
              <span
                className={`shrink-0 rounded-[6px] px-2.5 py-1 text-xs font-semibold ${
                  stripeConnected ? "bg-secondary text-secondary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                {stripeConnected ? "Aktivno" : "Neaktivno"}
              </span>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="email" className="max-w-lg">
          <div className="rounded-[14px] border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">E-poštna obvestila</p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {emailConnected ? "Povezano" : "Ni povezano — potrebna je integracija e-poštnega ponudnika."}
                </p>
              </div>
              <span
                className={`shrink-0 rounded-[6px] px-2.5 py-1 text-xs font-semibold ${
                  emailConnected ? "bg-secondary text-secondary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                {emailConnected ? "Aktivno" : "Neaktivno"}
              </span>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
