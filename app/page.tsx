"use client"
import { useOrganization, useUser} from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import {  useQuery } from "convex/react";
  


import UploadButton from "./upload-button";
import FileCard from "./FileCard";



  export default function Home() {

   

    
       



    const organization  = useOrganization();
    const user = useUser();
     let orgId : string | undefined = undefined ;

     if(organization.isLoaded && user.isLoaded){
          orgId = organization.organization?.id ?? user.user?.id
     }
    const files = useQuery(api.files.getFiles, orgId  ? { orgId } : 'skip' );
    return (
      <>
      <main>



          <div className="container flex justify-between pt-6 mt-4 ">
        <h2 className="text-3xl flex justify-between font-bold items-center ">Your Files</h2>
          <UploadButton />
          </div>
                 <div className="mt-16 grid grid-cols-4 gap-4 px-4">

                 {files?.map((file) => {
                   return <FileCard key={file._id} file={file}  />
                  })}
                  </div>
              
          </main>
          </>
        );
  }
  