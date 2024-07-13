import FilesBrowser from "../_components/FileBrowser";





export default function FilePage(){
     return (
          <>
         <div className="w-full flex  justify-between items-center">
                        
        
                    
                      
                          <FilesBrowser title="Your Files" />
                      
  
                      {/* <UploadButton button='+ Upload Files' /> */}
                          
                        
                       </div>
          </>
     )
}