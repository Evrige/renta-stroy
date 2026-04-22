import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

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
    <html lang="uk" className="font-sans">
    <body className="antialiased mt-24">
    <Header />
    {children}
    <Footer />
    </body>
    </html>
  );
}
