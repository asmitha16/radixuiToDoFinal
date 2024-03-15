"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { cn } from "@/lib/utils"
import { ButtonProps, buttonVariants } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"

interface PostCreateButtonProps extends ButtonProps {}

export function PostCreateButton({
  className,
  variant,
  ...props
}: PostCreateButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [newItem, setNewItem] = React.useState("")
  async function onClick() {
    setIsLoading(true)

    const response = await fetch("/api/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: newItem,
        complete: false,
      }),
    })

    setIsLoading(false)

    if (!response?.ok) {
      return toast({
        title: "Something went wrong.",
        description: "Your task was not created. Please try again.",
        variant: "destructive",
      })
    }

    router.refresh()

    setNewItem("")
  }

  return (
    <form onSubmit={onClick} className="flex items-center gap-3">
      <input
        type="text"
        required
        value={newItem}
        onChange={(e) => setNewItem(e.target.value)}
        name="title"
        placeholder="New todo"
        className=" flex-1 rounded-full border-slate-400   px-2 py-1 outline-none placeholder:text-slate-300 focus-within:border-slate-100 focus-within:bg-slate-100"
      />
      <button
        onClick={onClick}
        className={cn(buttonVariants({ variant }), {
          "cursor-not-allowed opacity-60": isLoading,
        })}
        disabled={isLoading || newItem.trim() === ""}
        {...props}
      >
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.add className="h-4 w-4" />
        )}
      </button>
    </form>
  )
}
