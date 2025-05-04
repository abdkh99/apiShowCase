import type { Metadata } from "next";
import "./globals.css";
import ScrollProgress from "./components/ScrollProgress";

export const metadata: Metadata = {
  title: "animeVerse",
  description: "عرض الأنمي الشائع",
  icons: {
    icon: "/animeflix.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <ScrollProgress />
        {children}
      </body>
    </html>
  );
}
