"use client"
import { useOrganization, useUser} from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import {  useQuery } from "convex/react";
import Image from "next/image";
  


import UploadButton from "./upload-button";
import FileCard from "./FileCard";
import { FileIcon, Loader2, StarIcon } from "lucide-react";
import { url } from "inspector";
import SearchBar from "./searchBar";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";




  export default function Home() {

   

    
    const [query , setQuery] = useState("");


    const organization  = useOrganization();
    const user = useUser();
     let orgId : string | undefined = undefined ;

     if(organization.isLoaded && user.isLoaded){
          orgId = organization.organization?.id ?? user.user?.id
     }
    const files = useQuery(api.files.getFiles, orgId  ? { orgId , query } : 'skip' );
    const isLoading  =  files === undefined ; 
    const queryFailed = query === undefined ; 
    console.log(files);
    return (
      <>
       { isLoading && (
            <div className="flex flex-col gap-8 pt-28  font-thin justify-center items-center h-full  mx-auto">
                    <Loader2 className="h-32 w-32 animate-spin " />
               </div>
          )}

   
      <main>
          <div className="flex">

          <div className="w-1/5 container flex flex-col gap-2 justify-start items-start h-50 mt-10" >
          {!isLoading && (<>
              <Link href="/"><Button variant={"link"} className="flex gap-2" ><FileIcon />All Files</Button></Link>
              <Link href="/"><Button variant={"link"} className="flex gap-2" ><StarIcon />Favourites</Button></Link>
    </> )}

          
          </div>

          
            <div className="w-full">

        {/* side nav div */}
          <div className="container flex justify-between pt-6 mt-4 ">
         
          


            {!isLoading && !queryFailed && files?.length === 0 && (
                <div className="flex flex-col items-center w-full ">
                 
                 <Image 
                 width="400"
                 height="400"
                 src="/empty.svg"
                 alt="you don't have files image"
                 />
                   <div className="text-2xl mt-2 mb-4 text-center font-bold mx-auto">{queryFailed ? "File not found" : "You don't have files, Upload now"}</div>
                    {queryFailed ? <Button>Go Back</Button> :  <UploadButton button='Upload Files' /> }
                  
                 </div>
            )}


            {!isLoading && files.length > 0  && (
              <>
                     <div className="w-full flex  justify-between items-center">
                        
                   

                      <h2 className="text-3xl font-bold">Your Files</h2>
                  
                    

                      <SearchBar query={query} setQuery={setQuery} />
                      
                        

                    <UploadButton button='+ Upload Files' />
                        
                      
                     </div>
                   
                    
              </>

            )}
      
          </div>
              
                 <div className="mt-16 grid lg:grid-cols-3 gap-4 px-4 mb-4 sm:grid-cols-2 xs:grid-cols-1">

                  

                 {files?.map((file) => {
                   return <FileCard key={file._id} file={file} url={file.url}  />
                  })}
                  </div>
                  {/*  */}
                  </div>
                  </div>
              
             
          </main>
          </>
        );
  }
  