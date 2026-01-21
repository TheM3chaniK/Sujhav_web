"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

function ContactForm({ initial, onSave }) {
  const [form, setForm] = useState(
    initial || {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      courseInterest: "",
      message: "",
      status: "new",
    },
  )
  const update = (k, v) => setForm((s) => ({ ...s, [k]: v }))
  return (
    <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
      <div className="grid grid-cols-2 gap-2">
        <div className="grid gap-2">
          <Label>First Name *</Label>
          <Input value={form.firstName} onChange={(e) => update("firstName", e.target.value)} required />
        </div>
        <div className="grid gap-2">
          <Label>Last Name *</Label>
          <Input value={form.lastName} onChange={(e) => update("lastName", e.target.value)} required />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="grid gap-2">
          <Label>Email *</Label>
          <Input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} required />
        </div>
        <div className="grid gap-2">
          <Label>Phone *</Label>
          <Input type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} required />
        </div>
      </div>
      <div className="grid gap-2">
        <Label>Course Interest</Label>
        <Input value={form.courseInterest} onChange={(e) => update("courseInterest", e.target.value)} />
      </div>
      <div className="grid gap-2">
        <Label>Message *</Label>
        <textarea
          className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label>Status</Label>
        <Select value={form.status} onValueChange={(v) => update("status", v)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="contacted">Contacted</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button onClick={() => onSave(form)}>Save</Button>
    </div>
  )
}

export default function AdminContactsPage() {
  const [items, setItems] = useState([])
  const [q, setQ] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [loading, setLoading] = useState(false)

  const load = useMemo(
    () => async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (q) params.append("q", q)
        if (statusFilter) params.append("status", statusFilter)
        const res = await fetch(`/api/admin/contacts?${params}`)
        const data = await res.json()
        setItems(data.items || [])
      } finally {
        setLoading(false)
      }
    },
    [q, statusFilter],
  )

  useEffect(() => {
    load()
  }, [load])

  async function createItem(payload) {
    const res = await fetch("/api/admin/contacts", { method: "POST", body: JSON.stringify(payload) })
    if (res.ok) await load()
  }

  async function updateItem(id, updates) {
    const res = await fetch("/api/admin/contacts", { method: "PATCH", body: JSON.stringify({ id, ...updates }) })
    if (res.ok) await load()
  }

  async function deleteItem(id) {
    if (!confirm("Delete this contact submission?")) return
    const res = await fetch(`/api/admin/contacts?id=${id}`, { method: "DELETE" })
    if (res.ok) await load()
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Contact Submissions</CardTitle>
        <div className="flex gap-2">
          <Input placeholder="Search..." value={q} onChange={(e) => setQ(e.target.value)} className="w-[200px]" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={load} disabled={loading}>
            {loading ? "Loading..." : "Search"}
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">New Contact</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Contact Submission</DialogTitle>
              </DialogHeader>
              <ContactForm onSave={createItem} />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-muted-foreground">
            <tr>
              <th className="py-2 pr-4">Name</th>
              <th className="py-2 pr-4">Email</th>
              <th className="py-2 pr-4">Phone</th>
              <th className="py-2 pr-4">Course Interest</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2 pr-4">Date</th>
              <th className="py-2 pr-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="py-2 pr-4">
                  {c.firstName} {c.lastName}
                </td>
                <td className="py-2 pr-4">{c.email}</td>
                <td className="py-2 pr-4">{c.phone}</td>
                <td className="py-2 pr-4">{c.courseInterest || "-"}</td>
                <td className="py-2 pr-4">
                  <Badge
                    variant={c.status === "resolved" ? "default" : c.status === "contacted" ? "secondary" : "outline"}
                  >
                    {c.status}
                  </Badge>
                </td>
                <td className="py-2 pr-4">{new Date(c.createdAt).toLocaleDateString()}</td>
                <td className="py-2 pr-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline">
                        View/Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Contact Submission Details</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">Name:</span> {c.firstName} {c.lastName}
                          </div>
                          <div>
                            <span className="text-muted-foreground">Email:</span> {c.email}
                          </div>
                          <div>
                            <span className="text-muted-foreground">Phone:</span> {c.phone}
                          </div>
                          <div>
                            <span className="text-muted-foreground">Course Interest:</span> {c.courseInterest || "-"}
                          </div>
                          <div>
                            <span className="text-muted-foreground">Status:</span> {c.status}
                          </div>
                          <div>
                            <span className="text-muted-foreground">Date:</span>{" "}
                            {new Date(c.createdAt).toLocaleString()}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">Message:</div>
                          <div className="p-3 bg-muted/50 rounded text-sm">{c.message}</div>
                        </div>
                        <div className="flex gap-2">
                          <Select
                            value={c.status}
                            onValueChange={(status) => updateItem(c.id, { status })}
                          >
                            <SelectTrigger className="w-[200px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="new">New</SelectItem>
                              <SelectItem value="contacted">Contacted</SelectItem>
                              <SelectItem value="resolved">Resolved</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button variant="destructive" onClick={() => deleteItem(c.id)}>
                            Delete
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td className="py-6 text-center text-muted-foreground" colSpan={7}>
                  No contact submissions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </CardContent>
    </Card>
  )
}

