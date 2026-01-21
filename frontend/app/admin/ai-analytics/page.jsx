"use client"

import { useEffect, useMemo, useState } from "react"
import { isBackendReady } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function AdminAIAnalyticsPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedAnalytics, setSelectedAnalytics] = useState(null)

  const load = useMemo(
    () => async () => {
      setLoading(true)
      try {
        if (!isBackendReady()) {
          // Backend not ready: show empty list
          setItems([])
          return
        }
        const res = await fetch("/api/admin/ai-analytics")
        const data = await res.json()
        setItems(data.items || [])
      } finally {
        setLoading(false)
      }
    },
    [],
  )

  useEffect(() => {
    if (isBackendReady()) load()
  }, [load])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>AI Analytics</CardTitle>
        <Button onClick={load} disabled={loading}>
          {loading ? "Loading..." : "Refresh"}
        </Button>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-muted-foreground">
            <tr>
              <th className="py-2 pr-4">User</th>
              <th className="py-2 pr-4">Analysis Type</th>
              <th className="py-2 pr-4">Insights</th>
              <th className="py-2 pr-4">Recommendations</th>
              <th className="py-2 pr-4">Date</th>
              <th className="py-2 pr-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((analytics) => (
              <tr key={analytics.id} className="border-t">
                <td className="py-2 pr-4">{analytics.user?.fullName || analytics.user?.email || "-"}</td>
                <td className="py-2 pr-4">
                  <Badge variant="outline">{analytics.analysisType}</Badge>
                </td>
                <td className="py-2 pr-4">{analytics.insights?.length || 0} insights</td>
                <td className="py-2 pr-4">{analytics.recommendations?.length || 0} recommendations</td>
                <td className="py-2 pr-4">{new Date(analytics.createdAt).toLocaleDateString()}</td>
                <td className="py-2 pr-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline" onClick={() => setSelectedAnalytics(analytics)}>
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>AI Analytics Details</DialogTitle>
                      </DialogHeader>
                      {selectedAnalytics && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-muted-foreground">User:</span>{" "}
                              {selectedAnalytics.user?.fullName || "-"}
                            </div>
                            <div>
                              <span className="text-muted-foreground">Email:</span>{" "}
                              {selectedAnalytics.user?.email || "-"}
                            </div>
                            <div>
                              <span className="text-muted-foreground">Analysis Type:</span>{" "}
                              {selectedAnalytics.analysisType}
                            </div>
                            <div>
                              <span className="text-muted-foreground">Date:</span>{" "}
                              {new Date(selectedAnalytics.createdAt).toLocaleString()}
                            </div>
                          </div>
                          {selectedAnalytics.data && (
                            <div>
                              <div className="font-medium mb-2">Data</div>
                              <div className="p-3 bg-muted/50 rounded text-xs">
                                <pre className="whitespace-pre-wrap">
                                  {JSON.stringify(selectedAnalytics.data, null, 2)}
                                </pre>
                              </div>
                            </div>
                          )}
                          {selectedAnalytics.insights && selectedAnalytics.insights.length > 0 && (
                            <div>
                              <div className="font-medium mb-2">Insights</div>
                              <ul className="list-disc list-inside space-y-1 text-sm">
                                {selectedAnalytics.insights.map((insight, idx) => (
                                  <li key={idx}>{insight}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {selectedAnalytics.recommendations && selectedAnalytics.recommendations.length > 0 && (
                            <div>
                              <div className="font-medium mb-2">Recommendations</div>
                              <ul className="list-disc list-inside space-y-1 text-sm">
                                {selectedAnalytics.recommendations.map((rec, idx) => (
                                  <li key={idx}>{rec}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td className="py-6 text-center text-muted-foreground" colSpan={6}>
                  No AI analytics found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </CardContent>
    </Card>
  )
}

