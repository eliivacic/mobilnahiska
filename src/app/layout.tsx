import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ConditionalChrome } from "@/components/layout/ConditionalChrome";
import { createClient } from "@/lib/supabase/server";
import { FavoritesProvider } from "@/components/providers/FavoritesProvider";
import { Toaster } from "@/components/ui/sonner";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin", "latin-ext"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.mobilnahiska.si"),
  title: "mobilnahiska.si: Mobilne in modularne hiške ter zemljišča",
  description:
    "Slovenski marketplace za mobilne in modularne hiške ter zemljišča, z oglasi, ponudniki in vodiči na enem mestu.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isAdmin = false;
  if (user) {
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    isAdmin = profile?.role === "admin";
  }

  return (
    <html
      lang="sl"
      className={`${plusJakartaSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <FavoritesProvider>
          <ConditionalChrome userEmail={user?.email} isAdmin={isAdmin}>
            {children}
          </ConditionalChrome>
        </FavoritesProvider>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
