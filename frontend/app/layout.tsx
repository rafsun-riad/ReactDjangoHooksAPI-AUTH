"use client";

import { useState, useEffect } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useAuth } from "@/hooks/useAuth";

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
  const [queryClient] = useState(() => new QueryClient());
  const { jwtLogin } = useAuth();

  useEffect(() => {
    jwtLogin();
  }, [jwtLogin]);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-hidden`}
      >
        <QueryClientProvider client={queryClient}>
          <div className="h-screen flex flex-col">
            <Header />
            <div className="container mx-auto flex-1">{children}</div>
            <Footer />
          </div>
          <Toaster richColors position="bottom-right" />
        </QueryClientProvider>
      </body>
    </html>
  );
}
