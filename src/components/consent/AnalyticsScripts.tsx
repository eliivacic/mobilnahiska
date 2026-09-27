"use client";

import Script from "next/script";
import { useConsent } from "@/components/consent/ConsentProvider";

const GA_MEASUREMENT_ID = "G-C7XR50X00S";

// Only ever rendered (and only ever loads gtag.js) once the visitor has
// actively granted analytics consent — see CookieConsentBanner. Before that,
// this renders nothing, so no analytics cookie or request happens.
export function AnalyticsScripts() {
  const { consent } = useConsent();
  if (!consent.analytics) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} strategy="afterInteractive" />
      <Script id="google-tag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  );
}
