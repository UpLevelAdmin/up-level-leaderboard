import type { Metadata } from "next";
import { Nunito, Poppins } from "next/font/google";
import "./globals.css";

import { AuthContextProvider } from "@/context/AuthContext";
import BottomNav from "@/components/BottomNav";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700", "800"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Up Level Guild - Cute & Friendly Card Game Community",
  description: "Join the Up Level Guild adventure! Collect EXP, complete quests, and become a Legend.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${nunito.variable} ${poppins.variable} antialiased bg-[#1F2E4A] text-white`}
      >
        <AuthContextProvider>
          {children}
          <BottomNav />
        </AuthContextProvider>
      </body>
    </html>
  );
}
