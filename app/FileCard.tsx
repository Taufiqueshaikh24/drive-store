
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
import { Text ,  Braces, Code, Disc, FileArchive, FileText, FileTextIcon, GanttChartIcon, Hash, Headphones, ImageIcon, MoreVertical, TrashIcon, Video, Table, FolderArchive, ArrowDownToLine, } from "lucide-react"
import { Doc, Id } from "@/convex/_generated/dataModel"
import { ReactNode, useState } from "react"
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
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image"



function getFileUrl(fileId: Id<"_storage">):string {
       return `${process.env.NEXT_PUBLIC_CONVEX_URL}/api/storage/${fileId}`;
    //    https://cheery-kangaroo-448.convex.cloud/api/storage/f6b69ae9-03a8-454c-a7d9-e1d940fc1d8a
    // https://cheery-kangaroo-448.convex.cloud/api/storage/01de888a-c3ae-4296-a768-2eb7201b7e69
}



function FileCardActions({file ,  url }:{ file:Doc<"files"> }  & {url: string | null}){
   
     const { toast } = useToast();

    const deleteFile = useMutation(api.files.deleteFile);

    const [isOpen , setIsOpen ] = useState(false);

    return (
       <>
       <AlertDialog open={isOpen} onOpenChange={setIsOpen} >
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
                <AlertDialogAction onClick={ () => {
                      deleteFile({
                          fileId : file._id ,  
                      });
                      toast({
                         variant:"default",
                         title : "File deleted successfully", 
                         description: "Your file Has been deleted"
                      })
                }}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
            </AlertDialog>

       <DropdownMenu  >
<DropdownMenuTrigger className="outline-none" ><MoreVertical className="w-4 h-4 " /></DropdownMenuTrigger>
<DropdownMenuContent>
   
<DropdownMenuItem className="flex gap-1 text-red-600 items-center flex  justify-start text-center cursor-pointer " 
   onClick={() => {
        if(!url) return ; 
        window.open(url , "_blank")

   }}
  >
      <ArrowDownToLine className="w-4 h-4" /> Download
  </DropdownMenuItem>



  <DropdownMenuItem className="flex gap-1 text-red-600 items-center flex justify-start text-center cursor-pointer " 
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








export default function FileCard({file , url }:{ file:Doc<"files"> }  & {url: string | null}){               


    
    const typeIcons   = {
        png:<ImageIcon />,
        jpeg:<ImageIcon />,
        jpg:<ImageIcon />,
        pdf:<FileTextIcon />,
        csv: <GanttChartIcon />,
        mp3:<Headphones />,
        mp4:<Video />,
        zip:<FileArchive />,
        html:<Code />,
        css:<Hash/>,
        iso: <Disc />,
        js:<Braces />,
        rar: <FolderArchive />,
        txt : <Text />,
        doc : <FileText />,
        xls :  <Table />,  
        xlsx : <Table />
        
        
        
        
        
        
        
    } as Record<Doc<"files">["type"] | any ,  ReactNode>

     
      
    if(!file.type) return ;
      

      return (
        <>




            <Card onClick={() => {
                    if(!url) return ; 
                    window.open(url , "_blank")
            }} className="cursor-pointer" >
            <CardHeader className="relative">
                <CardTitle className="flex gap-1 items-center text-sm absolute top-2 left-2"><p><abbr title={`${file.name}.${file.type}`}>{typeIcons[file.type]}</abbr></p>{file.name}</CardTitle>
                <div className="absolute top-1 right-0.5 outline-none mb-4 ">
                    <FileCardActions file={file} url={url} />
                </div>
            </CardHeader>
            <CardContent className="h-[100px] w-full flex justify-center items-center" >
            {file.type === "png" && url && (
          <Image alt={file.name} width="100" height="100" src={url} />
             
        )}
         {file.type === "jpeg" && url && (
          <Image alt={file.name} width="100" height="100" src={url}  />
        )}
         {file.type === "jpg" && url && (
          <Image alt={file.name} width="100" height="100" src={url} />
        )}
        {file.type === "mp4" && url && (
          <video className="rounded flex jusitfy-center items-center pt-6 mt-6 mb-6  "  width="200" height="200" src={url} 
            onMouseOver={() => {
                      const video  = document.querySelector('video');
                      video?.setAttribute("controls" , "true")
            }}
          />
        )}
         {file.type === "mp3" && url && (
          <video className="rounded" controls width="200" height="200" src={url}  />
        )}
                { file.type === "csv" && <GanttChartIcon className="w-20 h-20  mx-auto"  />}
                { file.type === "pdf" && <FileTextIcon  className="w-20 h-20  mx-auto"  />}
                { file.type === "html" && <Code className="w-20 h-20  mx-auto"  />}
                { file.type === "css" && <Hash className="w-20 h-20  mx-auto"  />}
                { file.type === "js" && <Braces className="w-20 h-20  mx-auto"  />}
                { file.type === "txt" && <Text className="w-20 h-20  mx-auto"  />}
                { file.type === "zip" && <FileArchive className="w-20 h-20  mx-auto"  />}
                { file.type === "iso" && <Disc className="w-20 h-20  mx-auto"  />}
                { file.type === "rar" && <FolderArchive className="w-20 h-20  mx-auto"  />}
                { file.type === "doc" && <FileText className="w-20 h-20  mx-auto"  />}
                { file.type === "xls" && <Table className="w-20 h-20  mx-auto"  />}
                { file.type === "xlsx" && <Table className="w-20 h-20  mx-auto"  />}


                </CardContent>
            <CardFooter>
                {/* <Button className="container mx-auto" onClick={() => {
                      if (!file.url) return;
                      window.open(file.url, "_blank");
                }}>Download</Button> */}
            </CardFooter>
            </Card>

        </>
      )
}