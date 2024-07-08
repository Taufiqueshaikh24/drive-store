import { UserButton , SignInButton , SignedIn, SignedOut , OrganizationSwitcher,   } from "@clerk/nextjs";
import Image from "next/image";


 const Header = () => {

  
     return (
           <nav className="flex justify-between py-3 mx-auto container  shadow-lg  ">
               <div className="flex items-center space-x-2 cursor-pointer ">
                 <Image src="/logo.png" alt="logo" width="30" height="20" className="ml-10 cursor-pointer" /><span className="font-bold underline" >Storage</span>
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
