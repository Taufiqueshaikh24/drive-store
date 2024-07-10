import { internalMutation, MutationCtx, QueryCtx } from "./_generated/server";
import { ConvexError, v } from "convex/values";



export async function getUser(
    ctx : QueryCtx | MutationCtx,
    tokenIdentifier : string
){

        const identity = ctx.auth.getUserIdentity();
        if(!identity){
             throw new ConvexError('You should be logged In')
        }

       const user  = await ctx.db
       .query("users")
       .withIndex('by_tokenIdentifier' ,  q => q.eq('tokenIdentifier' , tokenIdentifier)
       ).first();

       if(!user){
          throw new ConvexError('User is not defined');
       }

       return user ; 
}


export const createUser = internalMutation({
       args:{
             tokenIdentifier: v.string()
       },
       async handler(ctx  , args) {
           await ctx.db.insert('users' , {
                  tokenIdentifier : args.tokenIdentifier,
                  orgIds : []
           });
       }
})


export const addOrgIdToUser = internalMutation({
       args: { 
            tokenIdentifier : v.string(),
            orgId : v.string()
       },
       async handler(ctx, args) {
           const user  = await getUser(ctx , args.tokenIdentifier)
           if(!user) { 
               throw new ConvexError("User is not defined");
           } 
           await ctx.db.patch(user._id, {
                 orgIds : [...user.orgIds  , args.orgId ]
           })
       },
})