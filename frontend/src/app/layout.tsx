import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

import Script from "next/script";

export const metadata: Metadata = {
  title: "Monetize Connect - Influencer Marketplace",
  description: "Hire top influencers and monetize your brand with Monetize Connect.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased min-h-screen flex flex-col`}>
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
        <Navbar />
        <main className="flex-1 pt-20">
          {children}
        </main>
      </body>
    </html>
  );
}
