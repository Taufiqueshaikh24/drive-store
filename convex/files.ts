
import {internalMutation, mutation, MutationCtx, query, QueryCtx} from './_generated/server'
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
  orgId: string
) {

   const identity = await ctx.auth.getUserIdentity();

   if(!identity){  return null}

   const user = await ctx.db.query("users")
       .withIndex("by_tokenIdentifier", q => q.eq("tokenIdentifier" , identity.tokenIdentifier)).first();
       

      if(!user) { return null}

  // const user = await getUser(ctx, tokenIdentifier);

  const hasAccess =
    user.orgIds.some((item) => item.orgId === orgId) || user.tokenIdentifier.includes(orgId);

    if(!hasAccess){ return null}


    return { user }


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

        //  const user = await getUser(ctx , identity.tokenIdentifier);




          const hasAccess = await hasAccessToOrg(ctx , args.orgId)
          
     

          
          if(!hasAccess){
             throw new Error('You are not Authorized');
          }

          
   const user = await ctx.db.query("users")
   .withIndex("by_tokenIdentifier", q => q.eq("tokenIdentifier" , identity.tokenIdentifier)).first();
   

  if(!user) { return null}


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
       query : v.optional(v.string()),
       favourites: v.optional(v.boolean()),
       deletedOnly : v.optional(v.boolean())
     },
     async handler(ctx, args) {
       const identity = await ctx.auth.getUserIdentity();
   
       if (!identity) {
         return [];
       }
       

       const hasAccess = await hasAccessToOrg(ctx , args.orgId);

       if(!hasAccess){ return []; }
   
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


   
       

    if(args.favourites){
      const user = await ctx.db.query("users")
      .withIndex("by_tokenIdentifier" , q => q.eq("tokenIdentifier" , identity.tokenIdentifier)).first()

      if(!user){ return files ;}
 
        const favourite = await ctx.db.query("favourites")
           .withIndex("by_userId_orgId_fileId" , q => q.eq("userId" , user._id)
           .eq("orgId" , args.orgId)).collect()

           files = files.filter((file) => favourite.some((fav) =>  fav.fileId === file._id))
    }


      if(args.deletedOnly){
           files = files.filter((file)=> file.shouldDelete);
      }else {
           files = files.filter((file) => !file.shouldDelete);
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
            
             const access = await hasAccessToOrg(ctx , args.fileId);

             const file = await ctx.db.get(args.fileId);

             if(!file){  throw new ConvexError('file does not exists')}
             console.log(file.orgId);

             const isAdmin =   access?.user.orgIds.find((org) => org.orgId === file.orgId)?.role !== "admin";

               if(!isAdmin){ throw new ConvexError("You are not Authorized to delete this File"); }

              // await ctx.db.delete(args.fileId);

              await ctx.db.patch(args.fileId , {
                      shouldDelete : true 
              })

          }
   })



   export const deleteAllFiles = internalMutation({
    args: {},
     
  async handler(ctx , args){


    const files = await ctx.db.query("files")
       .withIndex("by_shouleDelete", q => q.eq("shouldDelete" , true)).collect();

      await Promise.all(files.map(async (file) =>{
          await ctx.storage.delete(file.fileId);
          return await ctx.db.delete(file._id);
      }))

  }
   })




   export const restoreFile = mutation({
    args: {
      fileId: v.id("files")
  }, 
  async handler(ctx , args){
    
     const access = await hasAccessToOrg(ctx , args.fileId);

     const file = await ctx.db.get(args.fileId);

     if(!file){  throw new ConvexError('file does not exists')}
     console.log(file.orgId);

     const isAdmin =   access?.user.orgIds.find((org) => org.orgId === file.orgId)?.role !== "admin";

       if(!isAdmin){ throw new ConvexError("You are not Authorized to delete this File"); }

      // await ctx.db.delete(args.fileId);

      await ctx.db.patch(args.fileId , {
              shouldDelete : false 
      })

  }
   })



   export const toggleFavourites = mutation({
          args :{
            fileId: v.id("files")
          },
          async handler(ctx , args){
                  const access = await hasAccessToFile(ctx , args.fileId)

                  if(!access){ return new ConvexError("You are not Authorized")}

                const favourite = await ctx.db.query("favourites")
                .withIndex("by_userId_orgId_fileId" , q =>  q.eq("userId" , access.user._id ).eq("orgId", access.file.orgId).eq("fileId", access.file._id)).first()


                if(!favourite){
                   await ctx.db.insert("favourites" , {
                        fileId : access.file._id , 
                        userId : access.user._id , 
                        orgId : access.file.orgId
                   })
                }else {
                     await ctx.db.delete(favourite._id);
                }

          }
   })



   export async function hasAccessToFile(ctx : MutationCtx | QueryCtx , fileId:Id<"files">){
    const identity  = await ctx.auth.getUserIdentity();
                

    if(!identity){
         return null
    }

    const file = await ctx.db.get(fileId)

    if(!file){ 
        return null
    }

    const hasAccess  = await hasAccessToOrg( ctx , file.orgId  )

    if(!hasAccess) { return null}

    const user  = await ctx.db.query("users")
    .withIndex("by_tokenIdentifier" , q=>q.eq("tokenIdentifier" , identity.tokenIdentifier)).first()

    if(!user) { 
         return null
    }

    return { user , file}

   }



   export const  getAllFavourties = query({
    args:{
      orgId: v.string(),
  }, 
  async handler(ctx , args){
          const access = await hasAccessToOrg(ctx , args.orgId);
          if(!access) { return []; }

           const favourites= await ctx.db.query("favourites")
              .withIndex("by_userId_orgId_fileId" , q=>q.eq("userId" , access.user._id).eq("orgId" , args.orgId)).collect();

          return favourites;
  }
   })



  



