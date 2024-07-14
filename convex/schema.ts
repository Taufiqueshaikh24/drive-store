import { defineTable , defineSchema } from "convex/server";
import { v } from "convex/values";


export const fileTypes = v.union( 
    v.literal("csv") ,
    v.literal("pdf") , 
    v.literal("zip") , 
    v.literal('iso'),
    v.literal('mp3'),
    v.literal("mp4"),
    v.literal("jpeg"),
    v.literal("jpg"),
    v.literal("css"),
    v.literal("html"),
    v.literal("js"),
    v.literal("doc"),
    v.literal("docx"),
    v.literal("png"),
    v.literal("xls"),
    v.literal("xlsx"),
    v.literal("rar"),
    v.literal("txt"),

)
export const roles =  v.union( v.literal("admin") , v.literal("member") )

export default defineSchema({

    files: defineTable({  
         name: v.string()  ,
         type : fileTypes,
         orgId:  v.string() , 
          fileId : v.id("_storage"),
          shouldDelete : v.optional(v.boolean())
        })
    .index("by_orgId" , ["orgId"])
    .index("by_shouleDelete" , ["shouldDelete"]),
    
    favourites : defineTable({
        //   this fileid key is connected to files table using "files"
           fileId: v.id("files"),
                   //   this fileid key is connected to users table using "users"
           userId : v.id("users"),
           orgId: v.string()
    }).index("by_userId_orgId_fileId" , ["userId" , "orgId"  , "fileId"]),
    users : defineTable({
            tokenIdentifier : v.string(),
            orgIds : v.array(v.object({
                 orgId: v.string(),
                 role : roles, 
            })),
            name : v.optional(v.string()),
            image: v.optional(v.string())
    }).index("by_tokenIdentifier" , ["tokenIdentifier"])
    
})