"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

function TestForm({ initial, onSave }) {
  const [form, setForm] = useState(
    initial || {
      title: "",
      description: "",
      class: "",
      subject: "",
      totalMarks: 100,
      duration: 60,
      isActive: true,
    },
  )
  const update = (k, v) => setForm((s) => ({ ...s, [k]: v }))
  return (
    <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
      <div className="grid gap-2">
        <Label>Title *</Label>
        <Input value={form.title} onChange={(e) => update("title", e.target.value)} required />
      </div>
      <div className="grid gap-2">
        <Label>Description</Label>
        <textarea
          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="grid gap-2">
          <Label>Class *</Label>
          <Input value={form.class} onChange={(e) => update("class", e.target.value)} placeholder="e.g., 11, 12" required />
        </div>
        <div className="grid gap-2">
          <Label>Subject *</Label>
          <Input value={form.subject} onChange={(e) => update("subject", e.target.value)} placeholder="e.g., Physics" required />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="grid gap-2">
          <Label>Total Marks *</Label>
          <Input type="number" value={form.totalMarks} onChange={(e) => update("totalMarks", Number(e.target.value))} required />
        </div>
        <div className="grid gap-2">
          <Label>Duration (minutes) *</Label>
          <Input type="number" value={form.duration} onChange={(e) => update("duration", Number(e.target.value))} required />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <input
          id="isActive"
          type="checkbox"
          checked={!!form.isActive}
          onChange={(e) => update("isActive", e.target.checked)}
        />
        <Label htmlFor="isActive">Active</Label>
      </div>
      <Button onClick={() => onSave(form)}>Save</Button>
    </div>
  )
}

export default function AdminTestsPage() {
  const [items, setItems] = useState([])
  const [q, setQ] = useState("")
  const [loading, setLoading] = useState(false)

  const load = useMemo(
    () => async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (q) params.append("q", q)
        const res = await fetch(`/api/admin/tests?${params}`)
        const data = await res.json()
        setItems(data.items || [])
      } finally {
        setLoading(false)
      }
    },
    [q],
  )

  useEffect(() => {
    load()
  }, [load])

  async function createItem(payload) {
    const res = await fetch("/api/admin/tests", { method: "POST", body: JSON.stringify(payload) })
    if (res.ok) await load()
  }

  async function updateItem(id, updates) {
    const res = await fetch("/api/admin/tests", { method: "PATCH", body: JSON.stringify({ id, ...updates }) })
    if (res.ok) await load()
  }

  async function deleteItem(id) {
    if (!confirm("Delete this test? This will also delete all associated questions and results.")) return
    const res = await fetch(`/api/admin/tests?id=${id}`, { method: "DELETE" })
    if (res.ok) await load()
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Tests</CardTitle>
        <div className="flex gap-2">
          <Input placeholder="Search..." value={q} onChange={(e) => setQ(e.target.value)} className="w-[200px]" />
          <Button onClick={load} disabled={loading}>
            {loading ? "Loading..." : "Search"}
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">New Test</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Test</DialogTitle>
              </DialogHeader>
              <TestForm onSave={createItem} />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-muted-foreground">
            <tr>
              <th className="py-2 pr-4">Title</th>
              <th className="py-2 pr-4">Class</th>
              <th className="py-2 pr-4">Subject</th>
              <th className="py-2 pr-4">Marks</th>
              <th className="py-2 pr-4">Duration</th>
              <th className="py-2 pr-4">Questions</th>
              <th className="py-2 pr-4">Attempts</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2 pr-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((test) => (
              <tr key={test.id} className="border-t">
                <td className="py-2 pr-4">{test.title}</td>
                <td className="py-2 pr-4">{test.class}</td>
                <td className="py-2 pr-4">{test.subject}</td>
                <td className="py-2 pr-4">{test.totalMarks}</td>
                <td className="py-2 pr-4">{test.duration} min</td>
                <td className="py-2 pr-4">{test._count?.questions || 0}</td>
                <td className="py-2 pr-4">{test._count?.testResults || 0}</td>
                <td className="py-2 pr-4">
                  <Badge variant={test.isActive ? "default" : "secondary"}>{test.isActive ? "Active" : "Inactive"}</Badge>
                </td>
                <td className="py-2 pr-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Edit Test</DialogTitle>
                      </DialogHeader>
                      <TestForm
                        initial={test}
                        onSave={async (form) => {
                          await updateItem(test.id, form)
                          const closeBtn = document.querySelector("[data-state='open'] button[aria-label='Close']")
                          closeBtn?.click()
                        }}
                      />
                    </DialogContent>
                  </Dialog>
                  <Button size="sm" variant="destructive" className="ml-2" onClick={() => deleteItem(test.id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td className="py-6 text-center text-muted-foreground" colSpan={9}>
                  No tests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </CardContent>
    </Card>
  )
}

