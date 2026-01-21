"use client"

import { useEffect, useState } from "react"
import { isBackendReady } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"

export default function AdminDashboardPage() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let ab = false
    async function load() {
      try {
        if (!isBackendReady()) {
          if (!ab) setError("Backend unavailable")
          return
        }
        const res = await fetch("/api/admin/summary", { cache: "no-store" })
        if (!res.ok) throw new Error("Failed to load summary")
        const d = await res.json()
        if (!ab) setData(d)
      } catch (e) {
        if (!ab) setError(e.message)
      }
    }
    load()
    return () => {
      ab = true
    }
  }, [])

  if (error) return <div className="text-red-600">Error: {error}</div>
  if (!data) return <div className="text-muted-foreground">Loading...</div>

  const KPI = ({ label, value }) => (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-muted-foreground">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  )

  return (
    <div className="grid gap-4">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPI label="Users" value={data.usersCount} />
        <KPI label="Products" value={data.productsCount} />
        <KPI label="Notes" value={data.notesCount} />
        <KPI label="Orders" value={data.ordersCount} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPI label="Contacts" value={data.contactsCount} />
        <KPI label="Gallery Images" value={data.galleryCount} />
        <KPI label="Achievements" value={data.achievementsCount} />
        <KPI label="Reviews" value={data.reviewsCount} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPI label="Tests" value={data.testsCount} />
        <KPI label="Test Results" value={data.testResultsCount} />
        <KPI label="AI Analytics" value={data.aiAnalyticsCount} />
        <KPI label="Cart Items" value={data.cartItemsCount} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPI label="Downloads" value={data.downloadsCount} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Total Revenue: ₹{Number(data.totalRevenue || 0).toLocaleString()}</CardTitle>
        </CardHeader>
        <CardContent className="h-[320px]">
          <ChartContainer
            config={{
              revenue: { label: "Revenue", color: "hsl(var(--chart-1))" },
            }}
            className="h-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.sales7d || []} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="revenue" stroke="var(--color-revenue)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
