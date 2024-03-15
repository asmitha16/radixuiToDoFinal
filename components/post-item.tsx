"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Todo } from "@prisma/client"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@radix-ui/react-alert-dialog"
import * as z from "zod"

import { cn } from "@/lib/utils"
import { todoPatchSchema } from "@/lib/validations/todo"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"

import { AlertDialogFooter, AlertDialogHeader } from "./ui/alert-dialog"
import { buttonVariants } from "./ui/button"
import { Skeleton } from "./ui/skeleton"

interface TodoItemProps {
  todo: Pick<Todo, "id" | "title" | "complete">
}

type data = z.infer<typeof todoPatchSchema>

async function deleteTodo(todoId: string) {
  const response = await fetch(`/api/todos/${todoId}`, {
    method: "DELETE",
  })

  if (!response?.ok) {
    toast({
      title: "Something went wrong.",
      description: "Your post was not deleted. Please try again.",
      variant: "destructive",
    })
  }
  return true
}

export function PostItem({ todo }: TodoItemProps) {
  const router = useRouter()

  async function updateTodo(todoId: string) {
    const response = await fetch(`/api/todos/${todoId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        complete: !todo.complete,
      }),
    })

    if (!response?.ok) {
      toast({
        title: "Something went wrong.",
        description: "Your post was not deleted. Please try again.",
        variant: "destructive",
      })
    }
    return true
  }

  return (
    <>
      <span className="flex flex-1 gap-2 p-6">
        <Checkbox
          onCheckedChange={async (event) => {
            const edited = await updateTodo(todo.id)

            if (edited) {
              router.refresh()
            }
          }}
          checked={todo.complete}
        />{" "}
        {todo.title}
      </span>

      <button
        className="mr-3 text-slate-500 hover:text-slate-800"
        onClick={async (event) => {
          event.preventDefault()

          const deleted = await deleteTodo(todo.id)

          if (deleted) {
            router.refresh()
          }
        }}
      >
        <Icons.trash className="mr-2 h-4 w-4" />
      </button>
    </>
  )
}

PostItem.Skeleton = function PostItemSkeleton() {
  return (
    <div className="p-4">
      <div className="space-y-3">
        <Skeleton className="h-5 w-2/5" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  )
}
