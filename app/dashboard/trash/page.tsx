import FilesBrowser from "../_components/FileBrowser";





export default function TrashPage(){
     return (
          <>
         <div className="w-full flex  justify-between items-center">
                        
        
                    
                      
                          <FilesBrowser title="Recently Deleted" deletedOnly />
                      
  
                      {/* <UploadButton button='+ Upload Files' /> */}
                          
                        
                       </div>
          </>
     )
}