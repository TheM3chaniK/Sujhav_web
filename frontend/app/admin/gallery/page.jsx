"use client"

import { useEffect, useMemo, useState } from "react"
import { toast } from "@/hooks/use-toast"
import { validateImageUrl } from "@/lib/utils"
import FileUploadInput from "@/components/admin/file-upload-input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"

function GalleryForm({ initial, onSave }) {
  const [form, setForm] = useState(
    initial || {
      title: "",
      description: "",
      imageUrl: "",
      category: "CAMPUS",
      isActive: true,
      order: 0,
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
      <div className="grid gap-2">
        <FileUploadInput
          label="Image URL *"
          value={form.imageUrl || ""}
          onChange={(url) => update("imageUrl", url)}
          accept="image/jpeg,image/png,image/gif,image/webp"
          multiple={false}
          bucket="sujhav"
          folder="gallery"
          maxSize={10}
        />
      </div>
      <div className="grid gap-2">
        <Label>Category *</Label>
        <Select value={form.category} onValueChange={(v) => update("category", v)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="CAMPUS">Campus</SelectItem>
            <SelectItem value="EVENTS">Events</SelectItem>
            <SelectItem value="ACHIEVEMENTS">Achievements</SelectItem>
            <SelectItem value="FACILITIES">Facilities</SelectItem>
            <SelectItem value="STUDENTS">Students</SelectItem>
            <SelectItem value="FACULTY">Faculty</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label>Display Order</Label>
        <Input type="number" value={form.order} onChange={(e) => update("order", Number(e.target.value))} />
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

export default function AdminGalleryPage() {
  
  const [items, setItems] = useState([])
  const [q, setQ] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [loading, setLoading] = useState(false)

  const load = useMemo(
    () => async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (q) params.append("q", q)
        if (categoryFilter) params.append("category", categoryFilter)
        const res = await fetch(`/api/admin/gallery?${params}`)
        const data = await res.json()
        setItems(data.items || [])
      } finally {
        setLoading(false)
      }
    },
    [q, categoryFilter],
  )

  useEffect(() => {
    load()
  }, [load])

  async function createItem(payload) {
    if (!validateGalleryPayload(payload)) return
    const res = await fetch("/api/admin/gallery", { method: "POST", body: JSON.stringify(payload) })
    if (res.ok) await load()
  }

  async function updateItem(id, updates) {
    if (!validateGalleryPayload(updates)) return
    const res = await fetch("/api/admin/gallery", { method: "PATCH", body: JSON.stringify({ id, ...updates }) })
    if (res.ok) await load()
  }

  async function deleteItem(id) {
    if (!confirm("Delete this gallery image?")) return
    const res = await fetch(`/api/admin/gallery?id=${id}`, { method: "DELETE" })
    if (res.ok) await load()
  }

  function validateGalleryPayload(payload) {
    if (!payload || typeof payload !== 'object') {
      toast({ title: 'Invalid payload', description: 'Payload must be an object', variant: 'destructive' })
      return false
    }
    if (!payload.imageUrl || String(payload.imageUrl).trim() === '') {
      toast({ title: 'Image required', description: 'Gallery image URL cannot be empty', variant: 'destructive' })
      return false
    }
    const check = validateImageUrl(payload.imageUrl)
    if (!check.isValid) {
      toast({ title: 'Invalid image URL', description: check.error, variant: 'destructive' })
      return false
    }
    return true
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Gallery Images</CardTitle>
        <div className="flex gap-2">
          <Input placeholder="Search..." value={q} onChange={(e) => setQ(e.target.value)} className="w-[200px]" />
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All</SelectItem>
              <SelectItem value="CAMPUS">Campus</SelectItem>
              <SelectItem value="EVENTS">Events</SelectItem>
              <SelectItem value="ACHIEVEMENTS">Achievements</SelectItem>
              <SelectItem value="FACILITIES">Facilities</SelectItem>
              <SelectItem value="STUDENTS">Students</SelectItem>
              <SelectItem value="FACULTY">Faculty</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={load} disabled={loading}>
            {loading ? "Loading..." : "Search"}
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">New Image</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add Gallery Image</DialogTitle>
              </DialogHeader>
              <GalleryForm onSave={createItem} />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-muted-foreground">
            <tr>
              <th className="py-2 pr-4">Image</th>
              <th className="py-2 pr-4">Title</th>
              <th className="py-2 pr-4">Category</th>
              <th className="py-2 pr-4">Order</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2 pr-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((img) => (
              <tr key={img.id} className="border-t">
                <td className="py-2 pr-4">
                  <div className="relative w-16 h-16 rounded overflow-hidden">
                    <Image src={img.imageUrl} alt={img.title} fill className="object-cover" sizes="64px" />
                  </div>
                </td>
                <td className="py-2 pr-4">{img.title}</td>
                <td className="py-2 pr-4">
                  <Badge variant="outline">{img.category}</Badge>
                </td>
                <td className="py-2 pr-4">{img.order}</td>
                <td className="py-2 pr-4">
                  <Badge variant={img.isActive ? "default" : "secondary"}>{img.isActive ? "Active" : "Inactive"}</Badge>
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
                        <DialogTitle>Edit Gallery Image</DialogTitle>
                      </DialogHeader>
                      <GalleryForm
                        initial={img}
                        onSave={async (form) => {
                          await updateItem(img.id, form)
                          const closeBtn = document.querySelector("[data-state='open'] button[aria-label='Close']")
                          closeBtn?.click()
                        }}
                      />
                    </DialogContent>
                  </Dialog>
                  <Button size="sm" variant="destructive" className="ml-2" onClick={() => deleteItem(img.id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td className="py-6 text-center text-muted-foreground" colSpan={6}>
                  No gallery images found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </CardContent>
    </Card>
  )
}

