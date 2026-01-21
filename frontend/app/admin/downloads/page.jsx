"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminDownloadsPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)

  const load = useMemo(
    () => async () => {
      setLoading(true)
      try {
        const res = await fetch("/api/admin/downloads")
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
        <CardTitle>Downloads</CardTitle>
        <Button onClick={load} disabled={loading}>
          {loading ? "Loading..." : "Refresh"}
        </Button>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-muted-foreground">
            <tr>
              <th className="py-2 pr-4">User</th>
              <th className="py-2 pr-4">Email</th>
              <th className="py-2 pr-4">Note</th>
              <th className="py-2 pr-4">Subject</th>
              <th className="py-2 pr-4">File URL</th>
              <th className="py-2 pr-4">IP Address</th>
              <th className="py-2 pr-4">Downloaded At</th>
            </tr>
          </thead>
          <tbody>
            {items.map((download) => (
              <tr key={download.id} className="border-t">
                <td className="py-2 pr-4">{download.user?.fullName || "-"}</td>
                <td className="py-2 pr-4">{download.user?.email || "-"}</td>
                <td className="py-2 pr-4">{download.note?.title || "-"}</td>
                <td className="py-2 pr-4">{download.note?.subject || "-"}</td>
                <td className="py-2 pr-4">
                  <a
                    href={download.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    View File
                  </a>
                </td>
                <td className="py-2 pr-4">{download.ipAddress || "-"}</td>
                <td className="py-2 pr-4">{new Date(download.downloadedAt).toLocaleString()}</td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td className="py-6 text-center text-muted-foreground" colSpan={7}>
                  No downloads found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </CardContent>
    </Card>
  )
}

