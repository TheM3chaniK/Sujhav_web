"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

function UserForm({ initial, onSave, isEdit }) {
  const [form, setForm] = useState(
    initial || {
      fullName: "",
      email: "",
      password: "",
      phone: "",
      role: "USER",
      isSujhavStudent: false,
      class: "",
      stream: "",
      isActive: true,
    },
  )
  const [saving, setSaving] = useState(false)
  const update = (k, v) => setForm((s) => ({ ...s, [k]: v }))

  const handleSave = async () => {
    setSaving(true)
    try {
      await onSave(form)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
      <div className="grid gap-2">
        <Label>Full Name *</Label>
        <Input value={form.fullName} onChange={(e) => update("fullName", e.target.value)} required />
      </div>
      <div className="grid gap-2">
        <Label>Email *</Label>
        <Input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} required />
      </div>
      {!isEdit && (
        <div className="grid gap-2">
          <Label>Password *</Label>
          <Input
            type="password"
            value={form.password}
            onChange={(e) => update("password", e.target.value)}
            required
            placeholder="Enter password"
          />
        </div>
      )}
      {isEdit && (
        <div className="grid gap-2">
          <Label>New Password (leave blank to keep current)</Label>
          <Input
            type="password"
            value={form.password || ""}
            onChange={(e) => update("password", e.target.value)}
            placeholder="Enter new password"
          />
        </div>
      )}
      <div className="grid gap-2">
        <Label>Phone</Label>
        <Input type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
      </div>
      <div className="grid gap-2">
        <Label>Role</Label>
        <select
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={form.role}
          onChange={(e) => update("role", e.target.value)}
        >
          <option value="USER">USER</option>
          <option value="ADMIN">ADMIN</option>
        </select>
      </div>
      <div className="grid gap-2">
        <Label>Class</Label>
        <Input value={form.class} onChange={(e) => update("class", e.target.value)} placeholder="e.g., 11, 12" />
      </div>
      <div className="grid gap-2">
        <Label>Stream</Label>
        <Input value={form.stream} onChange={(e) => update("stream", e.target.value)} placeholder="e.g., Science, Commerce" />
      </div>
      <div className="flex items-center gap-2">
        <input
          id="isSujhavStudent"
          type="checkbox"
          checked={!!form.isSujhavStudent}
          onChange={(e) => update("isSujhavStudent", e.target.checked)}
        />
        <Label htmlFor="isSujhavStudent">Is Sujhav Student</Label>
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
      <Button onClick={handleSave} disabled={saving}>
        {saving ? "Saving..." : "Save"}
      </Button>
    </div>
  )
}

export default function AdminUsersPage() {
  const [items, setItems] = useState([])
  const [q, setQ] = useState("")
  const [loading, setLoading] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingUserId, setEditingUserId] = useState(null)

  const load = useMemo(
    () => async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/admin/users?q=${encodeURIComponent(q)}`)
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

  async function createUser(payload) {
    const res = await fetch("/api/admin/users", { method: "POST", body: JSON.stringify(payload) })
    if (res.ok) {
      await load()
      setIsCreateDialogOpen(false)
    }
  }

  async function updateUser(id, updates) {
    const res = await fetch("/api/admin/users", { method: "PATCH", body: JSON.stringify({ id, ...updates }) })
    if (res.ok) {
      await load()
      setEditingUserId(null)
    }
  }

  async function deleteUser(id) {
    if (!confirm("Delete this user?")) return
    const res = await fetch(`/api/admin/users?id=${id}`, { method: "DELETE" })
    if (res.ok) await load()
  }

  const editingUser = items.find((u) => u.id === editingUserId)

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Users</CardTitle>
          <div className="flex gap-2">
            <Input placeholder="Search..." value={q} onChange={(e) => setQ(e.target.value)} />
            <Button onClick={load} disabled={loading}>
              {loading ? "Loading..." : "Search"}
            </Button>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">New User</Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create User</DialogTitle>
                  <DialogDescription>Enter details and click save.</DialogDescription>
                </DialogHeader>
                <UserForm onSave={createUser} isEdit={false} />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-muted-foreground">
              <tr>
                <th className="py-2 pr-4">Full Name</th>
                <th className="py-2 pr-4">Email</th>
                <th className="py-2 pr-4">Phone</th>
                <th className="py-2 pr-4">Role</th>
                <th className="py-2 pr-4">Class/Stream</th>
                <th className="py-2 pr-4">Student</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((u) => (
                <tr key={u.id} className="border-t">
                  <td className="py-2 pr-4">{u.fullName || "-"}</td>
                  <td className="py-2 pr-4">{u.email}</td>
                  <td className="py-2 pr-4">{u.phone || "-"}</td>
                  <td className="py-2 pr-4">
                    <Badge variant={u.role === "ADMIN" ? "default" : "secondary"}>{u.role}</Badge>
                  </td>
                  <td className="py-2 pr-4">
                    {u.class || u.stream ? `${u.class || ""} ${u.stream || ""}`.trim() : "-"}
                  </td>
                  <td className="py-2 pr-4">{u.isSujhavStudent ? "Yes" : "No"}</td>
                  <td className="py-2 pr-4">
                    <Badge variant={u.isActive ? "default" : "secondary"}>{u.isActive ? "Active" : "Inactive"}</Badge>
                  </td>
                  <td className="py-2 pr-4">
                    <Button size="sm" variant="outline" onClick={() => setEditingUserId(u.id)}>
                      Edit
                    </Button>
                    <Button size="sm" variant="destructive" className="ml-2" onClick={() => deleteUser(u.id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td className="py-6 text-center text-muted-foreground" colSpan={8}>
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
      <Dialog open={editingUserId !== null && !!editingUser} onOpenChange={(open) => setEditingUserId(open ? editingUserId : null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          {editingUser && (
            <UserForm
              initial={editingUser}
              isEdit={true}
              onSave={async (form) => {
                await updateUser(editingUser.id, form)
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
