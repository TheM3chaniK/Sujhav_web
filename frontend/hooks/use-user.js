"use client"

import { useState, useEffect, useCallback } from "react"

// Supabase functionality removed. This hook now queries your Express backend
// for the current user profile (JWT-backed). It provides a minimal, stable
// replacement so builds won't fail while you migrate auth fully to the
// backend.
export function useUser() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/user/profile", { credentials: "include" })
      if (!res.ok) {
        setUser(null)
      } else {
        const data = await res.json()
        setUser(data?.user ?? data ?? null)
      }
    } catch (err) {
      // network or other error -> treat as unauthenticated
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProfile()
    // Note: previously Supabase provided real-time auth updates; if you need
    // that behavior with your Express backend, consider adding a small
    // polling loop or an SSE/websocket hook. For now we provide a manual
    // refresh via `fetchProfile` to keep the implementation minimal.
  }, [fetchProfile])

  return { user, loading, refresh: fetchProfile }
}
