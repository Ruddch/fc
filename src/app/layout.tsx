import type { Metadata } from "next";
import localFont from "next/font/local";
import { Geist, Geist_Mono, Inter, Plus_Jakarta_Sans } from "next/font/google";
import WalletProvider from "@/components/WalletProvider";
import Sidebar from "@/components/Sidebar";
import { OnboardingProvider } from "@/contexts/OnboardingContext";
import OnboardingModalWrapper from "@/components/OnboardingModalWrapper";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Token Fantasy",
  description: "Fantasy league for crypto tokens",
};

// Abstract Fonts
const avenueMono = localFont({
  src: "../fonts/Avenue Mono.ttf",
  variable: "--font-avenue-mono",
  weight: "100, 900",
});

const roobert = localFont({
  src: [
    { path: "../fonts/Roobert-Light.ttf", weight: "300", style: "normal" },
    { path: "../fonts/Roobert-Regular.ttf", weight: "400", style: "normal" },
    { path: "../fonts/Roobert-Medium.ttf", weight: "500", style: "normal" },
    { path: "../fonts/Roobert-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "../fonts/Roobert-Bold.ttf", weight: "700", style: "normal" },
    { path: "../fonts/Roobert-Heavy.ttf", weight: "800", style: "normal" },
  ],
  variable: "--font-roobert",
});

const sangoUppercase = localFont({
  src: "../fonts/SangoUppercase-Static.otf",
  variable: "--font-sango-uppercase",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${plusJakartaSans.variable} ${avenueMono.variable} ${roobert.variable} ${sangoUppercase.variable} antialiased`}
      >
        <>
          <WalletProvider>
            <OnboardingProvider>
              <OnboardingModalWrapper />
              <Sidebar />
              {children}
            </OnboardingProvider>
          </WalletProvider>
        </>
      </body>
    </html>
  );
}
