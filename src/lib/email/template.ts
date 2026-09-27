import "server-only";

// Shared branded HTML wrapper for every transactional email — one template,
// used everywhere, so the portal never sends visually inconsistent emails.
// Table-based layout with inline styles on purpose: this is what actually
// renders correctly across Gmail/Outlook/Apple Mail, unlike modern CSS.

const BRAND_DARK = "#5A3026";
const SAGE = "#B9CDB3";
const TEXT = "#302521";
const MUTED = "#766A64";
const BORDER = "#E4DDD7";
const BACKGROUND = "#F7F5F2";
const LOGO_URL = "https://www.mobilnahiska.si/logo-mark.png";
const SITE_URL = "https://www.mobilnahiska.si";

export interface EmailContent {
  title: string;
  // Paragraphs of plain text (already HTML-escaped by the caller if needed).
  paragraphs: string[];
  ctaLabel?: string;
  ctaHref?: string;
  // Optional key/value rows shown in a light box below the CTA (e.g. listing
  // title, status, amount, date).
  details?: { label: string; value: string }[];
  footerNote?: string;
}

export function renderEmail(content: EmailContent): string {
  const paragraphsHtml = content.paragraphs
    .map(
      (paragraph) =>
        `<p style="margin:0 0 16px; font-size:15px; line-height:1.6; color:${TEXT};">${paragraph}</p>`
    )
    .join("");

  const detailsHtml = content.details?.length
    ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px; background:${BACKGROUND}; border-radius:10px; border:1px solid ${BORDER};">
        ${content.details
          .map(
            (row, index) => `<tr>
              <td style="padding:12px 16px; ${index > 0 ? `border-top:1px solid ${BORDER};` : ""} font-size:13px; color:${MUTED}; white-space:nowrap;">${row.label}</td>
              <td style="padding:12px 16px; ${index > 0 ? `border-top:1px solid ${BORDER};` : ""} font-size:14px; color:${TEXT}; text-align:right; font-weight:600;">${row.value}</td>
            </tr>`
          )
          .join("")}
      </table>`
    : "";

  const ctaHtml =
    content.ctaLabel && content.ctaHref
      ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
          <tr>
            <td style="border-radius:8px; background:${BRAND_DARK};">
              <a href="${content.ctaHref}" style="display:inline-block; padding:13px 28px; font-size:15px; font-weight:600; color:#ffffff; text-decoration:none; border-radius:8px;">
                ${content.ctaLabel}
              </a>
            </td>
          </tr>
        </table>`
      : "";

  return `<!DOCTYPE html>
<html lang="sl">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${content.title}</title>
  </head>
  <body style="margin:0; padding:0; background:${BACKGROUND}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BACKGROUND};">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%; max-width:600px; background:#ffffff; border-radius:14px; overflow:hidden; border:1px solid ${BORDER};">
            <tr>
              <td style="background:${BRAND_DARK}; padding:28px 32px; text-align:center;">
                <img src="${LOGO_URL}" alt="mobilnahiska.si" width="140" style="display:inline-block; width:140px; height:auto;" />
              </td>
            </tr>
            <tr>
              <td style="padding:32px;">
                <h1 style="margin:0 0 16px; font-size:22px; line-height:1.3; color:${TEXT}; font-weight:600;">
                  ${content.title}
                </h1>
                ${paragraphsHtml}
                ${detailsHtml}
                ${ctaHtml}
                ${
                  content.footerNote
                    ? `<p style="margin:0; font-size:13px; line-height:1.5; color:${MUTED};">${content.footerNote}</p>`
                    : ""
                }
              </td>
            </tr>
            <tr>
              <td style="background:${SAGE}22; padding:20px 32px; border-top:1px solid ${BORDER};">
                <p style="margin:0 0 4px; font-size:13px; color:${MUTED};">
                  <a href="${SITE_URL}" style="color:${BRAND_DARK}; text-decoration:none; font-weight:600;">mobilnahiska.si</a>
                  — slovenski marketplace za mobilne in modularne hiške ter zemljišča.
                </p>
                <p style="margin:0; font-size:12px; color:${MUTED};">
                  To sporočilo ste prejeli, ker je povezano z vašim računom ali dejanjem na mobilnahiska.si.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
