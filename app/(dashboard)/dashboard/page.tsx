import { redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { DashboardHeader } from "@/components/header"
import { PostCreateButton } from "@/components/post-create-button"
import { PostItem } from "@/components/post-item"
import { DashboardShell } from "@/components/shell"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const metadata = {
  title: "Dashboard",
}

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login")
  }

  const todos = await db.todo.findMany({
    where: {
      userId: user.id,
    },
    select: {
      id: true,
      title: true,
      complete: true,
    },
  })

  return (
    <DashboardShell>
      <DashboardHeader
        heading="To Do"
        text="Create and manage your daily activities. "
      ></DashboardHeader>
    
      <section className="sm:container-sm md:container-md space-y-6 bg-slate-50 py-8 dark:bg-transparent md:py-12 lg:py-24">
        
      <div>
        <main className="grid items-center justify-center p-6">
        <Tabs className="TabsRoot" defaultValue="tab1">
    <TabsList className="TabsList" aria-label="Manage your account">
      <TabsTrigger className="TabsTrigger" value="tab1">
        Active
      </TabsTrigger>
      <TabsTrigger className="TabsTrigger" value="tab2">
        Completed
      </TabsTrigger>
    </TabsList>
    <TabsContent className="TabsContent" value="tab1">
    <div className="flex h-[400px] w-[450px] flex-col rounded-md py-6 text-slate-800 shadow-lg overflow-auto">
    
          <div className="mx-8 mb-6 mt-4">
            <PostCreateButton />
          </div>

          <ul className="px-6">
  {todos?.length ? (
    todos.map((todo) => (
      !todo.complete && (
        <li key={todo.id} className="flex px-4">
          <PostItem todo={todo} />
        </li>
      )
    ))
  ) : (
    <EmptyPlaceholder>
      <EmptyPlaceholder.Icon name="post" />
      <EmptyPlaceholder.Title>
        No tasks added.
      </EmptyPlaceholder.Title>
      <EmptyPlaceholder.Description>
        You don't have any tasks for today. Start adding them.
      </EmptyPlaceholder.Description>
    </EmptyPlaceholder>
  )}
</ul>

        </div>
      </TabsContent>
      <TabsContent className="TabsContent" value="tab2">
      <div className="flex h-[400px] w-[450px] flex-col rounded-md py-6 text-slate-800 shadow-lg overflow-auto">
        

      <ul className="px-6">
  {todos?.length && (
    todos.map((todo) => (
      todo.complete && (
        <li key={todo.id} className="flex px-4">
          <PostItem todo={todo} />
        </li>
      )
    ))
  ) }
</ul>

</div>
        </TabsContent>
    </Tabs>
          
        </main>
      </div>
      </section>
    </DashboardShell>
  )
}
