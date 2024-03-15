import { db } from "@/lib/db";
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import * as z from "zod"

const todoCreateSchema = z.object({
  title: z.string(),
})

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new Response("Unauthorized", { status: 403 })
    }

    const { user } = session
    const posts = await db.todo.findMany({
      select: {
        id: true,
        title: true,
      },
      where: {
       userId: user.id,
      },
    })

    return new Response(JSON.stringify(posts))
  } catch (error) {
    return new Response(null, { status: 500 })
  }
}


export async function POST(req: Request) {

    try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new Response("Unauthorized", { status: 403 })
    }

    const json = await req.json()
    const body = todoCreateSchema.parse(json)

    const post = await db.todo.create({
      data: {
        title: body.title,
        complete: false, 
        userId: session.user.id 
      }
    })

    return new Response(JSON.stringify(post))
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(null, { status: 500 })
  }



}