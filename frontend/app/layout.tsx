"use client";

import { useState } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Header from "@/components/header";

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
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryClientProvider client={queryClient}>
          <Header />
          <div className="container mx-auto flex flex-col items-center p-4">
            <nav>
              <ul className="flex space-x-4">
                <li>
                  <Link href="/" className="text-blue-500 hover:underline">
                    Categories
                  </Link>
                </li>
                <li>
                  <Link href="/blogs" className="text-blue-500 hover:underline">
                    Blogs
                  </Link>
                </li>
              </ul>
            </nav>
            {children}
          </div>
        </QueryClientProvider>
      </body>
    </html>
  );
}
