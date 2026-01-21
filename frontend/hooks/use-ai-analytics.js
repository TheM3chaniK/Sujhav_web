"use client"

import { useState, useEffect } from "react"
import { isBackendReady } from "@/lib/utils"

export function useAIAnalytics() {
  const [analytics, setAnalytics] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (isBackendReady()) {
      fetchAnalytics()
    } else {
      // Backend not ready: surface a benign state
      setIsLoading(false)
      setAnalytics(null)
      setError(null)
    }
  }, [])

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true)
      setError(null)

      if (!isBackendReady()) {
        setError("Backend unavailable")
        return
      }

      const token = localStorage.getItem("token")
      if (!token) {
        setError("Authentication required")
        return
      }

      const response = await fetch("/api/ai/get-analytics", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setAnalytics(data.analytics)
      } else if (response.status === 404) {
        // No analytics available yet
        setAnalytics(null)
      } else {
        const errorData = await response.json()
        setError(errorData.error || "Failed to fetch analytics")
      }
    } catch (error) {
      console.error("Fetch analytics error:", error)
      setError("Network error")
    } finally {
      setIsLoading(false)
    }
  }

  const generateAnalytics = async () => {
    try {
      setIsLoading(true)
      setError(null)

      if (!isBackendReady()) {
        setError("Backend unavailable")
        return { success: false, error: "Backend unavailable" }
      }

      const token = localStorage.getItem("token")
      if (!token) {
        setError("Authentication required")
        return { success: false, error: "Authentication required" }
      }

      const response = await fetch("/api/ai/generate-analytics", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (response.ok) {
        setAnalytics(data.analytics)
        return { success: true, analytics: data.analytics }
      } else {
        setError(data.error || "Failed to generate analytics")
        return { success: false, error: data.error }
      }
    } catch (error) {
      console.error("Generate analytics error:", error)
      setError("Network error")
      return { success: false, error: "Network error" }
    } finally {
      setIsLoading(false)
    }
  }

  const refreshAnalytics = async () => {
    await generateAnalytics()
  }

  return {
    analytics,
    isLoading,
    error,
    generateAnalytics,
    refreshAnalytics,
    fetchAnalytics,
  }
}
