"use client"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import SingleSR from "./singleSR"
import AllSR from "./allSR"


export default function ServiceRequesReport() {

  return (
    <div className="flex w-full flex-col gap-6">
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="single">Single</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <AllSR />
        </TabsContent>
        <TabsContent value="single">
          <SingleSR />
        </TabsContent>
      </Tabs>
    </div>
  )
}
