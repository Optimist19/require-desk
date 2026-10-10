import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Aside from "@/components/shared/Aside";
import Header from "@/components/shared/Header";
import AuthProvider from "@/components/AuthProvider";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "Request Desk",
  description: "A simple role based request desk.",
  icons: {
    icon: [
      {
        url: "/request.svg",
        media: "(prefers-color-scheme: light)"
      },
      {
        url: "/request.svg",
        media: "(prefers-color-scheme: dark)"
      },
      {
        url: "/request.png",
        type: "image/svg+png"
      }
    ]
  }
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"

      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body>
        <AuthProvider>

          <Aside />
          <Header />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
