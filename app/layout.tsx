import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "BreatheSafe — Air Quality Intelligence",
  description:
    "Explore real-time and historical Air Quality Index data across major Indian cities. Understand pollutant breakdowns, health advisories, and environmental insights.",
  keywords: [
    "AQI",
    "air quality",
    "India",
    "pollution",
    "PM2.5",
    "health",
    "environment",
  ],
  openGraph: {
    title: "BreatheSafe — Air Quality Intelligence",
    description:
      "A premium air quality intelligence platform for Indian cities.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <body className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-[family-name:var(--font-inter)]">
        {children}
      </body>
    </html>
  );
}
