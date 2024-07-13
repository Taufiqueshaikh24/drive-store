import { Button } from "@/components/ui/button"
import { Form ,  FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, SearchIcon } from "lucide-react"
import { Dispatch, SetStateAction, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Image from "next/image"



const formSchema = z.object({
    query: z.string().min(1).max(50),
    
   
})



export default function SearchBar({query , setQuery}: { query:string , setQuery:Dispatch<SetStateAction<string>>}){


   


    const form = useForm<z.infer<typeof formSchema>>({
        resolver : zodResolver(formSchema),
        defaultValues :{
            query : "",
        }

  })


    async function onSubmit(values:z.infer<typeof formSchema>){

                    if(values.query === undefined){
                          return (
                              <>NO Files found</>
                          )
                    }
                    setQuery(values.query)
                    
                    
              
    }

    return (
         <> 
           <div>

           
           <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center gap-1 ">
        <FormField
          control={form.control}
          name="query"

          render={({ field }) => (
            <FormItem className="hover:cursor-pointer" >
              <FormControl>
                <Input placeholder="Search your files" {...field} className="focus-visible:ring-transparent" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="flex gap-1"  disabled={form.formState.isSubmitting} >
          {form.formState.isSubmitting && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
          <SearchIcon className="flex gap-1" />
        </Button>
      </form>
    </Form>
    </div>
         </>
    )

}