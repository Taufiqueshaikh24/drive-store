"use client"
import { Button } from "@/components/ui/button";
import { useOrganization, useUser} from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { 
      Dialog, 
      DialogContent,
      DialogDescription,
      DialogHeader,
      DialogTitle,
      DialogTrigger 
    } from "@/components/ui/dialog";


    import {
      Form,
      FormControl,
      FormField,
      FormItem,
      FormLabel,
      FormMessage,
    } from "@/components/ui/form"
    import { Input } from "@/components/ui/input"    

import {  z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
    title : z.string().min(1).max(20),
    file: z
    .custom<FileList>((val) => val instanceof FileList , "Required")
    .refine((files) => files.length > 0 , 'Required')
})

  export default function UploadButton() {

       const [isOpen , setIsOpen] = useState(false);
       const {toast} = useToast();

      const form = useForm<z.infer<typeof formSchema>>({
            resolver : zodResolver(formSchema),
            defaultValues :{
                title : '',
                file : undefined
            }

      })
        const fileRef  = form.register('file');
      async function onSubmit(values: z.infer<typeof formSchema>){
              console.log(values);
              
              if (!orgId) return;
               // Step 1: Get a short-lived upload URL
                const postUrl = await generateUploadUrl();
                const result  = await fetch(postUrl , {
                   method: 'POST', 
                   headers : {
                       "Content-Type": values.file[0].type
                   },
                   body : values.file[0], 
                   
                })
                // Getting the storage from the convex table 
                const { storageId } = await result.json();


                  try {
                    await createFile({
                      name: values.title,
                      fileId : storageId,
                      orgId,
                    });
                    
    
                    form.reset();
    
                    setIsOpen(false);
    
                    toast({
                       variant : 'success',
                       title : 'File Uploaded',
                       description : 'Now everyone can view your file'
                    })
                  } catch (err) {
                      console.log(err)
                      toast({
                        variant:'destructive',
                        title : 'Something went wrong',
                        description : 'Your file couldn\'t be uploaded , try again later'
                      })
                  }

              
            
      }




    const organization  = useOrganization();
    const user = useUser();
     let orgId : string | undefined = undefined ;

     if(organization.isLoaded && user.isLoaded){
          orgId = organization.organization?.id ?? user.user?.id
     }
    // const files = useQuery(api.files.getFiles, orgId  ? { orgId } : 'skip' );
    const createFile = useMutation(api.files.createFile);
    const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  
    return (
        <>
        {/* {files?.map((file) => {
          return <div key={file._id}>{file.name}</div>;
        })} */}

        

        <Dialog open={isOpen} onOpenChange={(isOpen) => {
            setIsOpen(isOpen);
            form.reset();
        }}>
  <DialogTrigger asChild >
  <Button
          className="hover:opacity-0.5 flex gap-1"
          disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting && (
                <Loader2 className="h-2 w-4 animate-spin" />
            )}
         + Upload Files
        </Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle className="pb-4" >Upload Your Files </DialogTitle>
      <DialogDescription>
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          
          control={form.control}
          name="title"
          
          render={({ field }) => (
            <FormItem className="hover:cursor-pointer" >
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Add Your File title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="file"
          render={({ field :  {  onChange } , ...field }) => (
            <FormItem >
              <FormLabel>Add Your File</FormLabel>
              <FormControl>
                  <Input  
                  type="file" 
                  // required
                  //  onChange={(e) => {
                    //     if(!e.target.files) return ; 
                    //     onChange(e.target.files?.[0])
                    //  }}
                  {...fileRef} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="flex gap-1"  disabled={form.formState.isSubmitting} >
          {form.formState.isSubmitting && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
          Submit
        </Button>
      </form>
    </Form>
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>
    </>

  
       
    );
  }
  