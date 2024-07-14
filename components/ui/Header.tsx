import { UserButton , SignInButton , SignedIn, SignedOut , OrganizationSwitcher,   } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";


 const Header = () => {

  
     return (
           <nav className="relative z-10 flex justify-between py-3 mx-auto container shadow">
               <div className="flex items-center space-x-2 cursor-pointer ">
               <Link href='/' className="flex gap-1"><Image src="/logo.png" alt="logo" width="30" height="20" className="ml-10 cursor-pointer" /><span className="font-bold text-center items-center flex  justify-center " >Drive Store</span></Link>
               </div>
               <SignedOut>
                    <SignInButton />
                </SignedOut>
                    
                <SignedIn>
                    <div className="flex gap-2">

                    <OrganizationSwitcher />
                    <UserButton />
                    </div>
                </SignedIn>
                    
           </nav>
     )
};

export default Header;
