"use client"
import { Button } from "@/components/ui/button";
import { useOrganization} from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";


  export default function Home() {
    const { organization } = useOrganization();
    // console.log(organization?.id);
    const files = useQuery(api.files.getFiles, organization?.id ? { orgId : organization?.id } : "skip");
    const createFile = useMutation(api.files.createFile);
  
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        {files?.map((file) => {
          return <div key={file._id}>{file.name}</div>;
        })}
  
        <Button
          onClick={() => {
            if (!organization?.id) return;
            createFile({
              name: "hello world",
              orgId : organization.id
            });
          }}
        >
          Click Me
        </Button>
      </main>
    );
  }
  