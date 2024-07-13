
import {mutation, MutationCtx, query, QueryCtx} from './_generated/server'
import {ConvexError, v} from 'convex/values'
import { getUser } from './users';
import { fileTypes } from './schema';
import { Doc, Id } from './_generated/dataModel';



export const generateUploadUrl = mutation(async (ctx) => {
      const identity = await ctx.auth.getUserIdentity();

      if(!identity){
          throw new ConvexError('You must be Logged in to upload a file')
      }

     return await ctx.storage.generateUploadUrl();
} )


async function hasAccessToOrg(
  ctx: QueryCtx | MutationCtx,
  tokenIdentifier: string,
  orgId: string
) {
  const user = await getUser(ctx, tokenIdentifier);

  const hasAccess =
    user.orgIds.includes(orgId) || user.tokenIdentifier.includes(orgId);

  return hasAccess;
}






export const createFile = mutation({


     args: {
          name : v.string(),
          type : fileTypes,
          fileId : v.id("_storage"),
          orgId : v.string(),
     },
     async handler(ctx , args){

          const identity  = await ctx.auth.getUserIdentity();
          console.log('identnitity',identity);

          if(!identity){
            throw new ConvexError('You Must be logged in')
      }

         const user = await getUser(ctx , identity.tokenIdentifier);


          const hasAccess = await hasAccessToOrg(ctx , identity?.tokenIdentifier , args.orgId)
          
     

          
          if(!hasAccess){
             throw new Error('You are not Authorized');
          }

        await ctx.db.insert('files' , {
               name:args.name,
               type : args.type,
               orgId : args.orgId,
               fileId : args.fileId,
              
        })
     } 
})


export const getFiles = query({
     args: {
       orgId: v.string(),
       type : v.optional(fileTypes),
       query : v.optional(v.string())
     },
     async handler(ctx, args) {
       const identity = await ctx.auth.getUserIdentity();
   
       if (!identity) {
         return [];
       }
   
   
       let files =  await ctx.db
         .query("files")
         .withIndex("by_orgId", (q) => q.eq("orgId", args.orgId))
         .collect();


  
        //  const filesWithUrl = await Promise.all(
        //   (await files).map(async (file:Doc<"files">) => ({
        //     ...file,
        //     url: await ctx.storage.getUrl(file.fileId),
        //   }))
        // );
    
        // return filesWithUrl;



        const query  = args.query ; 


         
    if (query) {
      files = files.filter((file) =>
        file.name.toLowerCase().includes(query.toLowerCase())
      );
    }


        const filesWithUrl = await Promise.all(
          files?.map(async (file) => ({
            ...file,
            url: await ctx.storage.getUrl(file.fileId),
          }))
        );

        console.log(filesWithUrl);


    
    return filesWithUrl



     },
   });
   

   export const deleteFile = mutation({
          args: {
              fileId: v.id("files")
          }, 
          async handler(ctx , args){
              const identity = await ctx.auth.getUserIdentity();

              if(!identity){
                  throw new ConvexError('You are not authorized to this Organization');
              }

              const file = await ctx.db.get(args.fileId);

              if(!file){
                throw new ConvexError("File doesn't exists");
              }

              if(!file.orgId) return ;
               // i was getting error in file.orgId so i checked up for if(!file.orgId) return;              
              const hasAccess = await hasAccessToOrg(ctx , identity.tokenIdentifier, file.orgId );

             if(!hasAccess){
                 throw new ConvexError('You are not authorized to this Organization');
             }
       
              await ctx.db.delete(args.fileId);

          }
   })




  



