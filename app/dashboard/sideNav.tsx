"use client"
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { FileIcon, StarIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";




export default function SideNav(){

    const pathname = usePathname();



    return (
        <>
              <div className="w-1/5 container flex flex-col gap-2 justify-start items-start h-50 mt-10" >
    
    <Link href="/dashboard/files">
               <Button variant={"ghost"} className={clsx("flex gap-2 pr-9 " , {
                     "bg-black text-white": pathname.includes("/dashboard/files")
               })} >
                            <FileIcon /> All Files
                </Button>
    </Link>
    <Link href="/dashboard/favourites">
                <Button variant={"ghost"} className={clsx("flex gap-2" , {
                        "bg-black text-white": pathname.includes("/dashboard/favourites")
                })} >
                    <StarIcon />Favourites
                </Button>
    </Link>
    <Link href="/dashboard/trash">
                <Button variant={"ghost"} className={clsx("flex gap-2 pr-12" , {
                        "bg-black text-white": pathname.includes("/dashboard/trash")
                })} >
                    <Trash2Icon />Trash
                </Button>
    </Link>



</div>

        </>
    )
}