import type { Metadata } from "next";
import { Inter } from "next/font/google";
// import "../../globals.css";
import SideNav from "./sideNav";
import Footer from "../Footer";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Storage",
  description: "File sharing file storage data storage ",
};

export default function DashBoardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <>
    <main>
    <div className="flex">

      <SideNav />
    
      <div className="mx-auto w-full">

            {children}
            {/*  */}
            </div>
            </div>
        
       
    </main>
       <Footer />
    </>
  );
}
