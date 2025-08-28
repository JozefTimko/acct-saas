import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "workpaperly",
  description: "AI workpapers for year-end accounts.",
  metadataBase: new URL("https://workpaperly.com"),
  openGraph: {
    title: "workpaperly",
    description: "AI workpapers for year-end accounts.",
    url: "https://workpaperly.com",
    siteName: "workpaperly",
  },
  twitter: {
    card: "summary_large_image",
    title: "workpaperly",
    description: "AI workpapers for year-end accounts.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
