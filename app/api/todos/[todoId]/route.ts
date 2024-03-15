import { getServerSession } from "next-auth"
import * as z from "zod"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { todoPatchSchema } from "@/lib/validations/todo"
import { Todo } from "@prisma/client"

const routeContextSchema = z.object({
  params: z.object({
    todoId: z.string(),
  }),
})

interface TodoProps {
  todo: Pick<Todo, "id" | "title" | "complete" >
}

const routeContextPatchSchema = z.object({
  params: z.object({
    id: z.string(),
    title: z.string(),
    complete: z.boolean(), 
    createdAt: z.date(), 
    updatedAt: z.date(),
    userId: z.string()
  }),
})

export async function DELETE(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    const { params } = routeContextSchema.parse(context)

    // Check if the user has access to this post.
    // if (!(await verifyCurrentUserHasAccessToPost(params.todoId))) {
    //   return new Response(null, { status: 403 })
    // }

  
    await db.todo.delete({
      where: {
        id: params.todoId as string,
      },
    })

    return new Response(null, { status: 204 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(null, { status: 500 })
  }
}


// export async function PATCH(
//   req: Request,
//   { todo }: TodoProps 
// ) {
//   try {
//     // Validate route params.
//     const { id, title, complete } = routeContextPatchSchema.parse(todo).params
    
//     // // Check if the user has access to this post.
//     // if (!(await verifyCurrentUserHasAccessToPost(params.todoId))) {
//     //   return new Response(null, { status: 403 })
//     // }

//     // Get the request body and validate it.
//     const json = await req.json()
//     console.log('jsob', json)
//     const body = todoPatchSchema.parse(json)
//     console.log('body', body)

//     // Update the task
//     await db.todo.update({
//       where: {
//         id: id,
//       },
//       data: {
//         complete: body.complete,
//       },
//     })

//     return new Response(null, { status: 200 })
//   } catch (error) {
//     if (error instanceof z.ZodError) {
//       return new Response(JSON.stringify(error.issues), { status: 422 })
//     }

//     return new Response(null, { status: 500 })
//   }
// }

export async function PATCH(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    // Validate route params.
    const { params } = routeContextSchema.parse(context)
    console.log('params', params)
    // // Check if the user has access to this post.
    // if (!(await verifyCurrentUserHasAccessToPost(params.todoId))) {
    //   return new Response(null, { status: 403 })
    // }

   // Get the request body and validate it.
    const json = await req.json()
    console.log('jsob', json)
    const body = todoPatchSchema.parse(json)
    console.log('body', body)

    // Update the task
    await db.todo.update({
      where: {
        id: params.todoId,
      },
      data: {
        complete: body.complete,
      },
    })

    return new Response(null, { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(null, { status: 500 })
  }
}

// async function verifyCurrentUserHasAccessToPost(todoId: string) {
//   const session = await getServerSession(authOptions)
//   const count = await db.todo.count({
//     where: {
//       id: todoId,
//     },
//   })

//   return count > 0
// }

// export async function PATCH(
//   req: Request,
//   { params: { id } }: { params: { id: string } }
// ) {
//   const { complete } = await req.json();

//   await db.todo.update({
//     where: {
//       id: id,
//     },
//     data: {
//       complete: complete,
//     },
//   });
//   return new Response(null, { status: 200 })
// }


// export async function PATCH(
//   req: Request,
//   { params: { id } }: { params: { id: string } }
// ) {
//   const { completed } = await req.json();

//   await db.todo.update({
//     where: {
//       id: id,
//     },
//     data: {
//       complete: completed,
//     },
//   });
//   return new Response(null, { status: 200 })
// }