
import {mutation, MutationCtx, query, QueryCtx} from './_generated/server'
import {ConvexError, v} from 'convex/values'
import { getUser } from './users';
import { connect } from 'http2';



export const generateUploadUrl = mutation(async (ctx) => {
      const identity = await ctx.auth.getUserIdentity();

      if(!identity){
          throw new ConvexError('You must be Logged in to upload a file')
      }

     return await ctx.storage.generateUploadUrl();
} )


async function hasAccessToOrg( 
  ctx: QueryCtx | MutationCtx , 
  tokenIdentifier : string , 
  orgId:string
){
     const user = await getUser(ctx , tokenIdentifier );
     const hasAccess = user.orgIds.includes(orgId) || user.tokenIdentifier.includes(orgId);
     return hasAccess;
}






export const createFile = mutation({


     args: {
          name : v.string(),
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
               orgId : args.orgId,
               fileId : args.fileId
              
        })
     } 
})


export const getFiles = query({
     args: {
       orgId: v.string(),
     },
     async handler(ctx, args) {
       const identity = await ctx.auth.getUserIdentity();
   
       if (!identity) {
         return [];
       }
   
   
       return ctx.db
         .query("files")
         .withIndex("by_orgId", (q) => q.eq("orgId", args.orgId))
         .collect();
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
                throw new ConvexError("File dostn't exists");
              }
              
              const hasAccess = await hasAccessToOrg(ctx , identity.tokenIdentifier, file.orgId? )

             if(!hasAccess){
                 throw new ConvexError('You are not authorized to this Organization');
             }
       
              await ctx.db.delete(args.fileId);

          }
   })
      