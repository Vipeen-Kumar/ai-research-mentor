import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { Navbar } from "@/components/layout/navbar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Research Mentor",
  description: "A STEM research mentor workspace for learning roadmaps, lessons, and progress tracking.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Navbar />
        {/* pt-[73px] offsets the fixed navbar height (py-4 × 2 + ~1.25rem text = ~73px) */}
        <div className="pt-[73px]">
          {children}
        </div>
      </body>
    </html>
  );
}
