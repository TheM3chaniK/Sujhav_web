"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import FileUploadInput from "@/components/admin/file-upload-input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

function NoteForm({ initial, onSave }) {
  const [form, setForm] = useState(
    initial || {
      title: "",
      description: "",
      class: "",
      subject: "",
      fileUrl: "",
      fileName: "",
      fileSize: 0,
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
          <Input
            value={form.class}
            onChange={(e) => update("class", e.target.value)}
            placeholder="e.g., 11, 12"
            required
          />
        </div>
        <div className="grid gap-2">
          <Label>Subject *</Label>
          <Input
            value={form.subject}
            onChange={(e) => update("subject", e.target.value)}
            placeholder="e.g., Physics, Chemistry"
            required
          />
        </div>
      </div>
      <div className="grid gap-2">
        <FileUploadInput
          label="File URL *"
          value={form.fileUrl || ""}
          onChange={(v) => {
            // support v being either a string URL or an object {url,name,size}
            if (v && typeof v === 'object' && v.url) {
              update('fileUrl', v.url)
              if (v.name) update('fileName', v.name)
              if (v.size) update('fileSize', v.size)
            } else {
              update('fileUrl', v || "")
            }
          }}
          accept="application/pdf,.pdf"
          multiple={false}
          bucket="sujhav"
          folder="notes"
          maxSize={50}
          emitMeta={true}
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="grid gap-2">
          <Label>File Name *</Label>
          <Input
            value={form.fileName}
            onChange={(e) => update("fileName", e.target.value)}
            placeholder="e.g., physics-notes.pdf"
            required
          />
        </div>
        <div className="grid gap-2">
          <Label>File Size (bytes)</Label>
          <Input
            type="number"
            value={form.fileSize}
            onChange={(e) => update("fileSize", Number(e.target.value))}
            placeholder="e.g., 1024000"
          />
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

export default function AdminNotesPage() {
  const [items, setItems] = useState([])
  const [q, setQ] = useState("")
  const [loading, setLoading] = useState(false)

  const load = useMemo(
    () => async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/admin/notes?q=${encodeURIComponent(q)}`)
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
    const res = await fetch("/api/admin/notes", { method: "POST", body: JSON.stringify(payload) })
    if (res.ok) await load()
  }
  async function updateItem(id, payload) {
    const res = await fetch(`/api/admin/notes/${id}`, { method: "PATCH", body: JSON.stringify(payload) })
    if (res.ok) await load()
  }
  async function deleteItem(id) {
    if (!confirm("Delete this note?")) return
    const res = await fetch(`/api/admin/notes/${id}`, { method: "DELETE" })
    if (res.ok) await load()
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Notes</CardTitle>
        <div className="flex gap-2">
          <Input placeholder="Search..." value={q} onChange={(e) => setQ(e.target.value)} />
          <Button onClick={load} disabled={loading}>
            {loading ? "Loading..." : "Search"}
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">New Note</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Note</DialogTitle>
              </DialogHeader>
              <NoteForm onSave={createItem} />
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
              <th className="py-2 pr-4">File Name</th>
              <th className="py-2 pr-4">Size</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2 pr-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((n) => (
              <tr key={n.id} className="border-t">
                <td className="py-2 pr-4">{n.title}</td>
                <td className="py-2 pr-4">{n.class}</td>
                <td className="py-2 pr-4">{n.subject}</td>
                <td className="py-2 pr-4">{n.fileName}</td>
                <td className="py-2 pr-4">{n.fileSize ? `${(n.fileSize / 1024).toFixed(0)} KB` : "-"}</td>
                <td className="py-2 pr-4">
                  <Badge variant={n.isActive ? "default" : "secondary"}>{n.isActive ? "Active" : "Inactive"}</Badge>
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
                        <DialogTitle>Edit Note</DialogTitle>
                      </DialogHeader>
                      <NoteForm
                        initial={n}
                        onSave={async (form) => {
                          await updateItem(n.id, form)
                          const closeBtn = document.querySelector("[data-state='open'] button[aria-label='Close']")
                          closeBtn?.click()
                        }}
                      />
                    </DialogContent>
                  </Dialog>
                  <Button size="sm" variant="destructive" className="ml-2" onClick={() => deleteItem(n.id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td className="py-6 text-center text-muted-foreground" colSpan={7}>
                  No notes.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </CardContent>
    </Card>
  )
}
