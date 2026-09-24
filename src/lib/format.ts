export function formatPrice(price: number): string {
  return new Intl.NumberFormat("sl-SI", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("sl-SI").format(value);
}

export function formatDate(isoDate: string): string {
  return new Intl.DateTimeFormat("sl-SI", { day: "numeric", month: "long", year: "numeric" }).format(
    new Date(isoDate)
  );
}

// Compact numeric date + time for admin tables/feeds, e.g. "24. 9. 2026, 14:05".
export function formatDateTimeSl(isoDate: string): string {
  return new Intl.DateTimeFormat("sl-SI", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(isoDate));
}

/**
 * Slovenian noun pluralization (1/2/3-4/5+), e.g. forms ["oglas", "oglasa", "oglasi", "oglasov"].
 */
export function pluralizeSl(count: number, forms: [string, string, string, string]): string {
  const mod100 = count % 100;
  if (mod100 === 1) return forms[0];
  if (mod100 === 2) return forms[1];
  if (mod100 === 3 || mod100 === 4) return forms[2];
  return forms[3];
}
