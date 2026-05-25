import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "MobileWeb — 台灣手機比價平台",
  description: "全台灣最完整的手機規格比價平台，涵蓋所有品牌手機的詳細規格、價格比較與評測推薦",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Outfit:wght@300;400;500;600;700&family=Noto+Sans+TC:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen antialiased">
        <Navbar />
        <main>{children}</main>
        <footer className="border-t border-border-subtle px-6 py-10">
          <div className="mx-auto max-w-7xl text-center">
            <p className="text-sm text-text-secondary">
              &copy; 2026 MobileWeb. 資料僅供參考，實際價格請以各品牌官網為主。
            </p>
            <p className="mt-1 text-xs text-text-tertiary">
              資料來源參考：手機王、傑昇通訊
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
