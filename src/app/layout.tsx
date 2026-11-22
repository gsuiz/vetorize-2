import type { Metadata } from "next";
import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import PointsProvider from "../context/PointsContext";
import ModeProvider from "@/context/ModeContext";
import RegressionProvider from "@/context/RegressionContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  display:"swap",
  subsets: ["latin"],
  variable: "--font-jetbrains-mono"
})

export const metadata: Metadata = {
  title: "Vetorize",
  description: "Vetorize",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ModeProvider>
          <PointsProvider>
            <RegressionProvider>{children}</RegressionProvider>
          </PointsProvider>
        </ModeProvider>
      </body>
    </html>
  );
}
