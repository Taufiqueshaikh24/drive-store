
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { MoreVertical, TrashIcon } from "lucide-react"
import { Doc } from "@/convex/_generated/dataModel"
import { useState } from "react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "@/components/ui/alert-dialog"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"






function FileCardActions({ file } : { file: Doc<"files">}){


    const deleteFile = useMutation(api.files.deleteFile);

    const [isOpen , setIsOpen ] = useState(false);

    return (
       <>
       <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your account
                    and remove your data from our servers.
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => {
                      deleteFile({
                          fileId : file._id
                      })
                }}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
            </AlertDialog>

       <DropdownMenu>
<DropdownMenuTrigger><MoreVertical className="w-4 h-4" /></DropdownMenuTrigger>
<DropdownMenuContent>
  <DropdownMenuItem className="flex gap-1 text-red-600 items-center flex justify-center text-center cursor-pointer " 
   onClick={() => {
         setIsOpen(true)
   }}
  >
      <TrashIcon className="w-4 h-4" /> Delete
  </DropdownMenuItem>
</DropdownMenuContent>
</DropdownMenu>

       </>
    )
}








export default function FileCard(
    {file}: {  file : Doc<"files">} 

){
      return (
        <>




            <Card>
            <CardHeader className="relative">
                <CardTitle>{file.name}</CardTitle>
                <div className="absolute top-1 right-0.5">
                    <FileCardActions file={file} />
                </div>
            </CardHeader>
            <CardContent>
                <p>Card Content</p>
            </CardContent>
            <CardFooter>
                <Button>Download</Button>
            </CardFooter>
            </Card>

        </>
      )
}