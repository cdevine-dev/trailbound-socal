import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trailbound SoCal — Hikes & Camps",
  description: "A curated, interactive field guide to Southern California hikes and camping spots.",
  metadataBase: new URL("https://cdevine-dev.github.io"),
  alternates: {
    canonical: "/trailbound-socal/",
  },
  openGraph: {
    url: "/trailbound-socal/",
  },
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
