import { internalMutation, MutationCtx, query, QueryCtx } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { roles } from "./schema";


// export async function getUser(
//     ctx : QueryCtx | MutationCtx,
//     tokenIdentifier : string
// ){

//         const identity = ctx.auth.getUserIdentity();
//         if(!identity){
//              throw new ConvexError('You should be logged In')
//         }

//        const user  = await ctx.db
//        .query("users")
//        .withIndex('by_tokenIdentifier' ,  q => q.eq('tokenIdentifier' , tokenIdentifier)
//        ).first();

//        if(!user){
//           throw new ConvexError('User is not defined');
//        }

//        return user ; 
// }



export async function getUser(
    ctx: QueryCtx | MutationCtx,
    tokenIdentifier: string
  ) {
    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", tokenIdentifier)
      )
      .first();
  
    if (!user) {
      throw new ConvexError("expected user to be defined");
    }
  
    return user;
  }


export const createUser = internalMutation({
       args:{
             tokenIdentifier: v.string(),
             name : v.optional(v.string()), 
             image : v.optional(v.string())
       },
       async handler(ctx  , args) {
           await ctx.db.insert('users' , {
                  tokenIdentifier : args.tokenIdentifier,
                  orgIds : [],
                  name  :args.name , 
                  image : args.image
           });
       }
})

export const updateUser  = internalMutation({
       args: {
            tokenIdentifier: v.string(), 
            name : v.optional(v.string()), 
            image : v.optional(v.string())
       }, 
       async handler(ctx , args){
            const user = await ctx.db.query("users")
             .withIndex("by_tokenIdentifier" , q => q.eq("tokenIdentifier" , args.tokenIdentifier)).first();

             if(!user){ throw new ConvexError("Token Not Found")}

             await ctx.db.patch(user._id , {
                 name : args.name , 
                 image : args.image
             })
       }
})


export const addOrgIdToUser = internalMutation({
       args: { 
            tokenIdentifier : v.string(),
            orgId : v.string(),
            role : roles
       },
       async handler(ctx, args) {
           const user  = await getUser(ctx , args.tokenIdentifier)
           if(!user) { 
               throw new ConvexError("User is not defined");
           } 
           await ctx.db.patch(user._id, {
                 orgIds : [...user.orgIds  , {orgId : args.orgId , role:args.role } ]
           })
       },
})


export const updateRolesForUser = internalMutation({
  args: { 
    tokenIdentifier : v.string(),
    orgId : v.string(),
    role : roles
},
async handler(ctx, args) {
   const user  = await getUser(ctx , args.tokenIdentifier)
   if(!user) { 
       throw new ConvexError("User is not defined");
   } 

   const org = user.orgIds.find((org) => org.orgId === args.orgId);

     if(!org){   throw new ConvexError("Organization Id not Found")}

     org.role = args.role

   await ctx.db.patch(user._id, {
         orgIds : user.orgIds , 
   })
},
})


// export const getProfile = query({
//         args:{
//           userId :v.optional(v.id("users")),
//         }, 
//         async handler(ctx , args){
//               const identity = await ctx.auth.getUserIdentity();

//               if(!identity){ return null}

//           const userI = await ctx.db.query("users")
//               .withIndex("by_tokenIdentifier" , q => q.eq("tokenIdentifier" , identity?.tokenIdentifier)).first()

//               if(!userI){ return null }

//               const user = await ctx.db.get(userI._id);
//              return { 
//                  name : user?.name , 
//                  image : user?.image
//              }
//         }
// })