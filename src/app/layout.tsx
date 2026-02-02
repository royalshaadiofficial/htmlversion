import type { Metadata } from "next";
import { Playfair_Display, Poppins, Great_Vibes } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

const vibes = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-vibes",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Royal Shaadi - Luxury Indian Wedding Marketplace",
    template: "%s | Royal Shaadi",
  },
  description:
    "Discover premium wedding vendors, venues, and inspiration for your royal Indian wedding. Curated selection of photographers, decorators, caterers, and more across UP.",
  keywords: [
    "Indian weddings",
    "wedding vendors",
    "wedding venues",
    "wedding photographers",
    "Lucknow weddings",
    "UP weddings",
    "royal weddings",
    "luxury weddings",
  ],
  authors: [{ name: "Royal Shaadi" }],
  creator: "Royal Shaadi",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://royalshaadi.co.in",
    title: "Royal Shaadi - Luxury Indian Wedding Marketplace",
    description:
      "Discover premium wedding vendors for your royal Indian wedding",
    siteName: "Royal Shaadi",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Royal Shaadi",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Royal Shaadi - Luxury Indian Wedding Marketplace",
    description:
      "Discover premium wedding vendors for your royal Indian wedding",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{
      '--font-playfair': playfair.style.fontFamily,
      '--font-poppins': poppins.style.fontFamily,
      '--font-vibes': vibes.style.fontFamily,
    } as React.CSSProperties}>
      <body className="font-poppins antialiased">
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}