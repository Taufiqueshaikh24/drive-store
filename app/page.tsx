"use client"
import { useOrganization, useUser} from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import {  useQuery } from "convex/react";
import Image from "next/image";
  


import UploadButton from "./upload-button";
import FileCard from "./FileCard";
import { Loader2 } from "lucide-react";
import { url } from "inspector";




  export default function Home() {

   

    
       


    const organization  = useOrganization();
    const user = useUser();
     let orgId : string | undefined = undefined ;

     if(organization.isLoaded && user.isLoaded){
          orgId = organization.organization?.id ?? user.user?.id
     }
    const files = useQuery(api.files.getFiles, orgId  ? { orgId } : 'skip' );
    const isLoading  =  files === undefined ; 
    console.log(files);
    return (
      <>
      <main>



          <div className="container flex justify-between pt-6 mt-4 ">
          { isLoading && (
               <div className="flex flex-col gap-8 pt-28  font-thin justify-center items-center h-full  mx-auto">
                    <Loader2 className="h-32 w-32 animate-spin " />
               </div>
          )}



            {!isLoading &&  files?.length === 0 && (
                <div className="flex flex-col items-center w-full ">
                 
                 <Image 
                 width="400"
                 height="400"
                 src="/empty.svg"
                 alt="you don't have files image"
                 />
                   <div className="text-2xl mt-2 mb-4 text-center font-bold mx-auto">You don't have files, Upload now</div>
                   <UploadButton button='Upload Files' />
                 </div>
            )}


            {!isLoading && files.length > 0  && (
              <>
                    <h2 className="text-3xl flex justify-between font-bold items-center ">Your Files</h2>
                    <UploadButton button='+ Upload Files' />
              </>

            )}
      
          </div>
                 <div className="mt-16 grid lg:grid-cols-4 gap-4 px-4 mb-4 sm:grid-cols-2 xs:grid-cols-1">

                  

                 {files?.map((file) => {
                   return <FileCard key={file._id} file={file} url={file.url}  />
                  })}
                  </div>
              
          </main>
          </>
        );
  }
  