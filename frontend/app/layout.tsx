import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

import Footer from "@/components/footer";
import Header from "@/components/header";
import ThemeModeProvider from "@/providers/DarkLightProvider";
import QueryAndAuthProvider from "@/providers/QueryAndAuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-hidden`}
      >
        <QueryAndAuthProvider>
          <ThemeModeProvider>
            <div className="h-screen flex flex-col">
              <Header />
              <div className="container mx-auto flex-1">{children}</div>
              <Footer />
            </div>
            <Toaster richColors position="bottom-right" />
          </ThemeModeProvider>
        </QueryAndAuthProvider>
      </body>
    </html>
  );
}
