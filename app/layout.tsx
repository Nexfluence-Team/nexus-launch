import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const rubik = Rubik({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-rubik",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nex · You're Invited — May 28, 2026",
  description:
    "A private gathering for the Baltics' next generation of creators. By invitation only. 100 seats.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={rubik.variable}>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-K5Z3FTDGZP"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-K5Z3FTDGZP');
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  );
}