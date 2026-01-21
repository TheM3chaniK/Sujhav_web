"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function AdminTestResultsPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedResult, setSelectedResult] = useState(null)

  const load = useMemo(
    () => async () => {
      setLoading(true)
      try {
        const res = await fetch("/api/admin/test-results")
        const data = await res.json()
        setItems(data.items || [])
      } finally {
        setLoading(false)
      }
    },
    [],
  )

  useEffect(() => {
    load()
  }, [load])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Test Results</CardTitle>
        <Button onClick={load} disabled={loading}>
          {loading ? "Loading..." : "Refresh"}
        </Button>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-muted-foreground">
            <tr>
              <th className="py-2 pr-4">Student</th>
              <th className="py-2 pr-4">Test</th>
              <th className="py-2 pr-4">Subject</th>
              <th className="py-2 pr-4">Score</th>
              <th className="py-2 pr-4">Percentage</th>
              <th className="py-2 pr-4">Time Spent</th>
              <th className="py-2 pr-4">Date</th>
              <th className="py-2 pr-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((result) => (
              <tr key={result.id} className="border-t">
                <td className="py-2 pr-4">{result.user?.fullName || result.user?.email || "-"}</td>
                <td className="py-2 pr-4">{result.test?.title || "-"}</td>
                <td className="py-2 pr-4">{result.test?.subject || "-"}</td>
                <td className="py-2 pr-4">
                  {result.score}/{result.totalMarks}
                </td>
                <td className="py-2 pr-4">
                  <Badge
                    variant={
                      result.percentage >= 75 ? "default" : result.percentage >= 50 ? "secondary" : "destructive"
                    }
                  >
                    {result.percentage.toFixed(2)}%
                  </Badge>
                </td>
                <td className="py-2 pr-4">{result.timeSpent} min</td>
                <td className="py-2 pr-4">{new Date(result.createdAt).toLocaleDateString()}</td>
                <td className="py-2 pr-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline" onClick={() => setSelectedResult(result)}>
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Test Result Details</DialogTitle>
                      </DialogHeader>
                      {selectedResult && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-muted-foreground">Student:</span>{" "}
                              {selectedResult.user?.fullName || "-"}
                            </div>
                            <div>
                              <span className="text-muted-foreground">Email:</span> {selectedResult.user?.email || "-"}
                            </div>
                            <div>
                              <span className="text-muted-foreground">Test:</span> {selectedResult.test?.title || "-"}
                            </div>
                            <div>
                              <span className="text-muted-foreground">Subject:</span>{" "}
                              {selectedResult.test?.subject || "-"}
                            </div>
                            <div>
                              <span className="text-muted-foreground">Class:</span> {selectedResult.test?.class || "-"}
                            </div>
                            <div>
                              <span className="text-muted-foreground">Topic:</span> {selectedResult.topic || "-"}
                            </div>
                            <div>
                              <span className="text-muted-foreground">Score:</span> {selectedResult.score}/
                              {selectedResult.totalMarks}
                            </div>
                            <div>
                              <span className="text-muted-foreground">Percentage:</span>{" "}
                              {selectedResult.percentage.toFixed(2)}%
                            </div>
                            <div>
                              <span className="text-muted-foreground">Time Spent:</span> {selectedResult.timeSpent}{" "}
                              minutes
                            </div>
                            <div>
                              <span className="text-muted-foreground">Date:</span>{" "}
                              {new Date(selectedResult.createdAt).toLocaleString()}
                            </div>
                          </div>
                          {selectedResult.answers && (
                            <div>
                              <div className="font-medium mb-2">Answers</div>
                              <div className="p-3 bg-muted/50 rounded text-xs">
                                <pre className="whitespace-pre-wrap">
                                  {JSON.stringify(selectedResult.answers, null, 2)}
                                </pre>
                              </div>
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
                <td className="py-6 text-center text-muted-foreground" colSpan={8}>
                  No test results found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </CardContent>
    </Card>
  )
}

