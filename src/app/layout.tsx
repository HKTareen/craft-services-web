import type { Metadata } from "next";
import { Geist } from "next/font/google";
import LangSetter from "@/components/LangSetter";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={`${geist.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-white font-sans text-stone-900 antialiased">
        <LangSetter />
        {children}
      </body>
    </html>
  );
}
