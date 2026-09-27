import "server-only";
import { renderEmail } from "@/lib/email/template";

const SITE_URL = "https://www.mobilnahiska.si";

export function welcomeEmail(params: { fullName: string | null }) {
  const greeting = params.fullName ? `${params.fullName}, dobrodošli` : "Dobrodošli";
  return {
    subject: "Dobrodošli na mobilnahiska.si",
    html: renderEmail({
      title: `${greeting} na mobilnahiska.si!`,
      paragraphs: [
        "Vaš e-poštni naslov je potrjen in vaš račun je pripravljen za uporabo.",
        "Prebrskajte trenutno ponudbo mobilnih in modularnih hišk ter zemljišč, ali oddajte svoj oglas, če želite prodati.",
      ],
      ctaLabel: "Raziščite ponudbo",
      ctaHref: `${SITE_URL}/oglasi`,
      footerNote: `Želite prodati? <a href="${SITE_URL}/oddaj-oglas" style="color:#5A3026;">Oddaj oglas</a>.`,
    }),
  };
}

export function listingSubmittedEmail(params: { title: string }) {
  return {
    subject: "Prejeli smo vaš oglas | mobilnahiska.si",
    html: renderEmail({
      title: "Prejeli smo vaš oglas",
      paragraphs: ["Vaš oglas smo prejeli in čaka na pregled."],
      details: [
        { label: "Naslov oglasa", value: params.title },
        { label: "Status", value: "V pregledu" },
      ],
      ctaLabel: "Poglej status oglasa",
      ctaHref: `${SITE_URL}/moj-racun/oglasi`,
    }),
  };
}

export function listingApprovedEmail(params: { title: string; expiresAt: string | null }) {
  return {
    subject: "Vaš oglas je objavljen | mobilnahiska.si",
    html: renderEmail({
      title: "Vaš oglas je objavljen",
      paragraphs: ["Čestitamo — vaš oglas je bil odobren in je zdaj objavljen na portalu."],
      details: [
        { label: "Naslov oglasa", value: params.title },
        ...(params.expiresAt
          ? [{ label: "Datum poteka", value: new Intl.DateTimeFormat("sl-SI").format(new Date(params.expiresAt)) }]
          : []),
      ],
      ctaLabel: "Poglej oglas",
      ctaHref: `${SITE_URL}/moj-racun/oglasi`,
    }),
  };
}

export function listingRejectedEmail(params: { title: string; reason: string }) {
  return {
    subject: "Potrebna je dopolnitev oglasa | mobilnahiska.si",
    html: renderEmail({
      title: "Potrebna je dopolnitev oglasa",
      paragraphs: [
        "Vašega oglasa žal (še) nismo mogli objaviti. Razlog administratorja:",
        `<span style="display:block; padding:12px 16px; background:#F7F5F2; border-radius:8px; border:1px solid #E4DDD7;">${params.reason}</span>`,
      ],
      details: [{ label: "Naslov oglasa", value: params.title }],
      ctaLabel: "Uredi oglas",
      ctaHref: `${SITE_URL}/oddaj-oglas`,
    }),
  };
}

export function inquiryNotificationEmail(params: {
  listingTitle: string;
  listingUrl: string;
  sellerName: string;
  senderName: string;
  senderEmail: string;
  senderPhone: string | null;
  message: string;
}) {
  return {
    subject: `Novo povpraševanje za vaš oglas | mobilnahiska.si`,
    html: renderEmail({
      title: "Novo povpraševanje za vaš oglas",
      paragraphs: [
        `Prejeli ste novo povpraševanje za oglas <strong>${params.listingTitle}</strong> (prodajalec: ${params.sellerName}).`,
        `<span style="display:block; padding:12px 16px; background:#F7F5F2; border-radius:8px; border:1px solid #E4DDD7;">${params.message.replace(/\n/g, "<br />")}</span>`,
      ],
      details: [
        { label: "Ime", value: params.senderName },
        { label: "E-pošta", value: params.senderEmail },
        ...(params.senderPhone ? [{ label: "Telefon", value: params.senderPhone }] : []),
      ],
      ctaLabel: "Poglej povpraševanje",
      ctaHref: params.listingUrl,
    }),
  };
}

export function listingExpiringEmail(params: { title: string; expiresAt: string }) {
  return {
    subject: "Vaš oglas bo kmalu potekel | mobilnahiska.si",
    html: renderEmail({
      title: "Vaš oglas bo kmalu potekel",
      paragraphs: [
        "Objava vašega oglasa se bo kmalu iztekla. Če ga želite ohraniti aktivnega, ga lahko podaljšate.",
      ],
      details: [
        { label: "Naslov oglasa", value: params.title },
        { label: "Datum poteka", value: new Intl.DateTimeFormat("sl-SI").format(new Date(params.expiresAt)) },
      ],
      ctaLabel: "Podaljšaj oglas",
      ctaHref: `${SITE_URL}/moj-racun/oglasi`,
    }),
  };
}

export function planExpiringEmail(params: { planName: string; expiresAt: string }) {
  return {
    subject: "Vaš paket bo kmalu potekel | mobilnahiska.si",
    html: renderEmail({
      title: "Vaš paket bo kmalu potekel",
      paragraphs: ["Vaš trenutni paket se bo kmalu iztekel."],
      details: [
        { label: "Paket", value: params.planName },
        { label: "Datum poteka", value: new Intl.DateTimeFormat("sl-SI").format(new Date(params.expiresAt)) },
      ],
      ctaLabel: "Preglej paket",
      ctaHref: `${SITE_URL}/moj-racun/paket`,
    }),
  };
}

export function paymentConfirmationEmail(params: {
  serviceName: string;
  amountCents: number;
  paidAt: string;
  status: string;
  invoiceUrl?: string | null;
}) {
  const amount = new Intl.NumberFormat("sl-SI", { style: "currency", currency: "EUR" }).format(
    params.amountCents / 100
  );
  return {
    subject: "Potrditev plačila | mobilnahiska.si",
    html: renderEmail({
      title: "Potrditev plačila",
      paragraphs: ["Prejeli smo vaše plačilo. Podrobnosti spodaj."],
      details: [
        { label: "Storitev", value: params.serviceName },
        { label: "Znesek", value: amount },
        { label: "Datum", value: new Intl.DateTimeFormat("sl-SI").format(new Date(params.paidAt)) },
        { label: "Status", value: params.status },
      ],
      ctaLabel: params.invoiceUrl ? "Prenesi račun" : undefined,
      ctaHref: params.invoiceUrl ?? undefined,
    }),
  };
}

export function adminNewListingEmail(params: { title: string; submitterEmail: string }) {
  return {
    subject: `Nov oglas čaka na pregled | mobilnahiska.si`,
    html: renderEmail({
      title: "Nov oglas čaka na pregled",
      paragraphs: [`Uporabnik ${params.submitterEmail} je oddal nov oglas, ki čaka na odobritev.`],
      details: [{ label: "Naslov oglasa", value: params.title }],
      ctaLabel: "Odpri v administraciji",
      ctaHref: `${SITE_URL}/admin/oglasi`,
    }),
  };
}
