"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTodos } from "@/hooks/use-todos"
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis, ResponsiveContainer } from "recharts"

export default function AnalyticsPage() {
  const { todos } = useTodos()
  const data = [
    { name: "Total", value: todos.length },
    { name: "Completed", value: todos.filter((t) => t.completed).length },
    { name: "Active", value: todos.filter((t) => !t.completed).length },
  ]

  return (
    <main className="container mx-auto max-w-3xl p-4">
      <h1 className="text-2xl font-semibold mb-4">Analytics</h1>
      <Card>
        <CardHeader>
          <CardTitle>Productivity Overview</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="currentColor" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </main>
  )
}
