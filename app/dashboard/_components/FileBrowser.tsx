



"use client"
import { useOrganization, useUser} from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import {  useQuery } from "convex/react";
import Image from "next/image";
  


import UploadButton from "../_components/upload-button";

import FileCard from "../_components/FileCard";
import {  Delete, Loader2,  } from "lucide-react";
import SearchBar from "../_components/searchBar";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { skip } from "node:test";
import { DataTable } from "./FileTable";
import { columns } from "./columns";




  export default function FilesBrowser(
    {title , favourites , deletedOnly}: 
    {title:string , favourites?:boolean ,deletedOnly?:boolean }) {

   

    
    const [query , setQuery] = useState("");


    const organization  = useOrganization();
    const user = useUser();
     let orgId : string | undefined = undefined ;

     if(organization.isLoaded && user.isLoaded){
          orgId = organization.organization?.id ?? user.user?.id
     }
    const files = useQuery(api.files.getFiles, orgId  ? { orgId , query , favourites , deletedOnly } : 'skip' );
    const favourite = useQuery(api.files.getAllFavourties,  orgId ? { orgId }: "skip");
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
                        
                   

                      <h2 className="text-3xl font-bold">{title}</h2>
                  
                    

                      <SearchBar query={query} setQuery={setQuery} />
                      
                        

                    <UploadButton button='+ Upload Files' files={files} />
                        
                      
                     </div>
                   
                    
              </>

            )}
      
          </div>

        

                 




            
              
                 <div className="mt-16 grid lg:grid-cols-3 gap-4 px-4 mb-4 sm:grid-cols-2 xs:grid-cols-1">

                  

                 {files?.map((file) => {
                   return <FileCard key={file._id} file={file} url={file.url} favourite={favourite ?? []}  />
                  })}
                  </div>
                  {/*  */}
          </main>
          </>
        );
  }
  