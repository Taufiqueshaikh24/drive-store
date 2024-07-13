import FilesBrowser from "../_components/FileBrowser";





export default function Favourites(){
     return (
          <>
         <div className="w-full flex  justify-between items-center">
                        
        
                    
                      
                          <FilesBrowser title="Favourties" favourites />
                      
  
                      {/* <UploadButton button='+ Upload Files' /> */}
                          
                        
                       </div>
          </>
     )
}