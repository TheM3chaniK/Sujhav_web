"use client"

import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function AdminAccessGuard({ children }) {
  const [status, setStatus] = useState("loading")
  const [user, setUser] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let aborted = false
    async function check() {
      try {
        setStatus("loading")
        const res = await fetch("/api/admin/me", { cache: "no-store" })
        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          throw new Error(data?.error || "Access denied")
        }
        const data = await res.json()
        if (!aborted) {
          setUser(data.user)
          setStatus("ok")
        }
      } catch (e) {
        if (!aborted) {
          setError(e.message)
          setStatus("denied")
        }
      }
    }
    check()
    return () => {
      aborted = true
    }
  }, [])

  if (status === "loading") {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Verifying admin access...</span>
        </div>
      </div>
    )
  }

  if (status === "denied") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center space-y-3">
            <div className="text-lg font-semibold">Admin access required</div>
            <p className="text-sm text-muted-foreground">{error || "You do not have permission to view this page."}</p>
            <div className="pt-2">
              <Button onClick={() => (window.location.href = "/")}>Go Home</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}
