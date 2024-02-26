import type { Metadata, Viewport } from "next";
import { tajawal, Aljazira, roboto } from "@/app/font/font";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "الاتحاد الوطني لطلبة موريتانيا",
    template: "%s | الاتحاد الوطني",
  },
  description: "الاتحاد الوطني لطلبة موريتانيا - الأخبار والمنشورات",
};

export const viewport: Viewport = {
  themeColor: "#58cc02",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${Aljazira.className}  ${tajawal.className}`}>
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
