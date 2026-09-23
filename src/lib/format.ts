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
