"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"

export default function AdminAnalyticsPage() {
  const [data, setData] = useState(null)

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/admin/summary", { cache: "no-store" })
      const d = await res.json()
      setData(d)
    }
    load()
  }, [])

  if (!data) return <div className="text-muted-foreground">Loading...</div>

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>7-Day Revenue</CardTitle>
        </CardHeader>
        <CardContent className="h-[280px]">
          <ChartContainer config={{ revenue: { label: "Revenue", color: "hsl(var(--chart-1))" } }} className="h-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.sales7d || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="revenue" stroke="var(--color-revenue)" />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>KPIs</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3">
          <div>
            <div className="text-sm text-muted-foreground">Users</div>
            <div className="text-2xl font-semibold">{data.usersCount}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Orders</div>
            <div className="text-2xl font-semibold">{data.ordersCount}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Products</div>
            <div className="text-2xl font-semibold">{data.productsCount}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Notes</div>
            <div className="text-2xl font-semibold">{data.notesCount}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
