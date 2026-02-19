import type { Metadata } from "next";
import { Noto_Sans_KR, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const notoSansKR = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "경제적 자유 시뮬레이터",
  description: "자산 성장을 시뮬레이션하고 경제적 자유까지 걸리는 시간을 계산합니다",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${notoSansKR.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <div className="w-full min-h-screen flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
