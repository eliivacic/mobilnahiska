import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SettingsSectionForm } from "@/components/admin/SettingsSectionForm";
import { EmailNotificationToggles } from "@/components/admin/EmailNotificationToggles";
import { formatDateTimeSl } from "@/lib/format";

export const metadata: Metadata = { title: "Nastavitve | Admin | mobilnahiska.si" };

const EMAIL_STATUS_LABELS: Record<string, { label: string; className: string }> = {
  sent: { label: "Poslano", className: "bg-secondary text-primary" },
  failed: { label: "Napaka", className: "bg-destructive/10 text-destructive" },
  skipped_no_provider: { label: "Ni ponudnika", className: "bg-muted text-muted-foreground" },
};

export default async function AdminNastavitvePage() {
  const admin = createAdminClient();
  const [{ data: rows }, { data: emailLog }] = await Promise.all([
    admin.from("portal_settings").select("key, value"),
    admin
      .from("email_log")
      .select("email_type, recipient_email, status, created_at")
      .order("created_at", { ascending: false })
      .limit(15),
  ]);
  const settings = Object.fromEntries((rows ?? []).map((row) => [row.key, row.value ?? ""]));

  // Payment/email integrations are checked by env var presence only — never
  // read or display the actual secret values here.
  const stripeConnected = Boolean(process.env.STRIPE_SECRET_KEY);
  const emailConnected = Boolean(process.env.RESEND_API_KEY);
  const notificationDefaults = Object.fromEntries(
    ["email_notify_welcome", "email_notify_listing_status", "email_notify_inquiry", "email_notify_expiry", "email_notify_admin"].map(
      (key) => [key, settings[key] !== "false"]
    )
  );

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

        <TabsContent value="email" className="max-w-lg space-y-6">
          <div className="rounded-[14px] border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">E-poštni ponudnik (Resend)</p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {emailConnected
                    ? "Povezano — e-pošta se dejansko pošilja."
                    : "Ni povezano — e-poštna obvestila se beležijo, a ne pošiljajo dejansko."}
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

          <div>
            <h3 className="text-[13px] font-semibold uppercase tracking-wide text-foreground/70">
              Pošiljatelj
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Uporabi se šele, ko je e-poštni ponudnik povezan in domena verificirana.
            </p>
            <div className="mt-3">
              <SettingsSectionForm
                fields={[
                  {
                    key: "email_sender_name",
                    label: "Ime pošiljatelja",
                    defaultValue: settings.email_sender_name ?? "",
                    placeholder: "mobilnahiska.si",
                  },
                  {
                    key: "email_sender_address",
                    label: "E-poštni naslov pošiljatelja",
                    defaultValue: settings.email_sender_address ?? "",
                    type: "email",
                    placeholder: "obvestila@mobilnahiska.si",
                  },
                  {
                    key: "email_reply_to",
                    label: "Reply-to naslov",
                    defaultValue: settings.email_reply_to ?? "",
                    type: "email",
                    placeholder: "info@mobilnahiska.si",
                  },
                ]}
              />
            </div>
          </div>

          <div>
            <h3 className="text-[13px] font-semibold uppercase tracking-wide text-foreground/70">
              Vrste obvestil
            </h3>
            <div className="mt-3">
              <EmailNotificationToggles initialValues={notificationDefaults} />
            </div>
          </div>

          <div>
            <h3 className="text-[13px] font-semibold uppercase tracking-wide text-foreground/70">
              Zadnja poslana obvestila
            </h3>
            {!emailLog || emailLog.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">Še ni zabeleženih e-poštnih obvestil.</p>
            ) : (
              <>
                <div className="mt-3 hidden overflow-hidden rounded-[10px] border border-border md:block">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-muted/60 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                      <tr>
                        <th className="px-3 py-2">Tip</th>
                        <th className="px-3 py-2">Prejemnik</th>
                        <th className="px-3 py-2">Stanje</th>
                        <th className="px-3 py-2">Datum</th>
                      </tr>
                    </thead>
                    <tbody>
                      {emailLog.map((row, index) => {
                        const status = EMAIL_STATUS_LABELS[row.status] ?? EMAIL_STATUS_LABELS.skipped_no_provider;
                        return (
                          <tr key={index} className="border-t border-border">
                            <td className="px-3 py-2 text-foreground">{row.email_type}</td>
                            <td className="px-3 py-2 text-muted-foreground">{row.recipient_email}</td>
                            <td className="px-3 py-2">
                              <span className={`rounded-[4px] px-2 py-0.5 text-[11px] font-semibold ${status.className}`}>
                                {status.label}
                              </span>
                            </td>
                            <td className="px-3 py-2 text-muted-foreground">{formatDateTimeSl(row.created_at)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="mt-3 space-y-2 md:hidden">
                  {emailLog.map((row, index) => {
                    const status = EMAIL_STATUS_LABELS[row.status] ?? EMAIL_STATUS_LABELS.skipped_no_provider;
                    return (
                      <div key={index} className="rounded-[10px] border border-border bg-card p-3">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium text-foreground">{row.email_type}</p>
                          <span className={`shrink-0 rounded-[4px] px-2 py-0.5 text-[11px] font-semibold ${status.className}`}>
                            {status.label}
                          </span>
                        </div>
                        <p className="mt-1 truncate text-xs text-muted-foreground">{row.recipient_email}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">{formatDateTimeSl(row.created_at)}</p>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
