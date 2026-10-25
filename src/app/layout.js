import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import PageTransition from "@/components/PageTransition";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "MySetups - F1 26 Official Sim Engineering Setups",
  description: "Hub competitivo di assetti tecnici per F1 26. 25 circuiti, Passo Gara, Qualifica, Bagnato, Asciutto, High Downforce e Low Drag.",
  openGraph: {
    title: "MySetups - F1 26 Official Sim Engineering Setups",
    description: "Hub competitivo di assetti tecnici per F1 26. 25 circuiti, Passo Gara, Qualifica, Bagnato, Asciutto, High Downforce e Low Drag.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="it" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-[#07070a] text-zinc-100 antialiased selection:bg-white/20 selection:text-white">
        <Providers>
          <PageTransition>{children}</PageTransition>
        </Providers>
      </body>
    </html>
  );
}
