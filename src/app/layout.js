"use client";

import "./globals.css";
import Providers from "./providers";
import PageTransition from "@/components/PageTransition";

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <body className="bg-black text-white overflow-x-hidden">
        <Providers>
          <PageTransition>{children}</PageTransition>
        </Providers>
      </body>
    </html>
  );
}
