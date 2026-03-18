import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Рента Строй",
  description: "Найкращій помічник з пошуку нерухомості",
};

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.className} font-sans`}>
    <body className="antialiased mt-24">
    <Header />
    {children}
    <Footer />
    </body>
    </html>
  );
}

