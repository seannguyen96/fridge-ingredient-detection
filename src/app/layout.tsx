import type { Metadata } from "next";
import localFont from "next/font/local";
import '@/styles/globals.css';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Fridge Ingredient Detection",
  description: "AI-powered ingredient detection system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={geistSans.className}>
      <body className={geistMono.variable}>
        <main>{children}</main>
      </body>
    </html>
  );
}
