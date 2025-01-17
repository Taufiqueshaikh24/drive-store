import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "./ConvexClientProvider";
import Header from "@/components/ui/Header";
import { Toaster } from "@/components/ui/toaster"
import { SignedIn } from "@clerk/nextjs";
import Footer from "./Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Storage",
  description: "File sharing file storage data storage ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ConvexClientProvider>
          <Header />
          <SignedIn>
         {children}
          </SignedIn>
       
        <Toaster />
        </ConvexClientProvider>
        
        </body>
    </html>
  );
}
