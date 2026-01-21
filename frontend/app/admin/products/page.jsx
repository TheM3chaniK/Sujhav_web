"use client"

import { useEffect, useMemo, useState } from "react"
import { toast } from "@/hooks/use-toast"
import { validateImageUrl, validateMultipleImageUrls } from "@/lib/utils"
import FileUploadInput from "@/components/admin/file-upload-input"
import { Button } from "@/components/ui/button"
import {Badge} from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

function ProductForm({ initial, onSave }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: 0,
    originalPrice: 0,
    category: "",
    imageUrl: "",
    images: [],
    subject: "",
    class: "",
    stream: "",
    fileUrl: "",
    isFree: false,
    isActive: true,
    rating: 0,
    studentCount: 0,
  })

  // Normalize initial values when editing
  useEffect(() => {
    if (initial) {
      setForm({
        name: initial.name || "",
        description: initial.description || "",
        price: initial.price ?? 0,
        originalPrice: initial.originalPrice ?? 0,
        category: initial.category || "",
        imageUrl: initial.imageUrl || "",
        images: Array.isArray(initial.images) ? initial.images : [],
        subject: initial.subject || "",
        class: initial.class || "",
        stream: initial.stream || "",
        fileUrl: initial.fileUrl || "",
        isFree: !!initial.isFree,
        isActive: initial.isActive ?? true,
        rating: initial.rating ?? 0,
        studentCount: initial.studentCount ?? 0,
      })
    }
  }, [initial])

  const update = (k, v) => setForm((s) => ({ ...s, [k]: v }))

  

  function validateFormImages() {
    const mainCheck = validateImageUrl(form.imageUrl)
    if (!mainCheck.isValid) {
      toast({ title: "Invalid image URL", description: mainCheck.error, variant: "destructive" })
      return false
    }
    const multiCheck = validateMultipleImageUrls(form.images || [])
    if (!multiCheck.isValid) {
      const e = multiCheck.errors[0]
      toast({ title: `Invalid image at line ${e.index + 1}`, description: e.message, variant: "destructive" })
      return false
    }
    return true
  }

  return (
    <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
      <div className="grid gap-2">
        <Label>Name *</Label>
        <Input value={form.name || ""} onChange={(e) => update("name", e.target.value)} required />
      </div>
      <div className="grid gap-2">
        <Label>Description</Label>
        <textarea
          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={form.description || ""}
          onChange={(e) => update("description", e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="grid gap-2">
          <Label>Price (₹) *</Label>
          <Input
            type="number"
            value={form.price ?? 0}
            onChange={(e) => update("price", Number(e.target.value))}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label>Original Price (₹)</Label>
          <Input
            type="number"
            value={form.originalPrice ?? 0}
            onChange={(e) => update("originalPrice", Number(e.target.value))}
          />
        </div>
      </div>
      <div className="grid gap-2">
        <Label>Category *</Label>
        <Input
          value={form.category || ""}
          onChange={(e) => update("category", e.target.value)}
          placeholder="e.g., Study Material, Merchandise"
          required
        />
      </div>
      <div className="grid gap-2">
        <FileUploadInput
          label="Main Image URL"
          value={form.imageUrl || ""}
          onChange={(url) => update("imageUrl", url)}
          accept="image/*"
          multiple={false}
          bucket="sujhav"
          folder="products"
          maxSize={10}
        />
      </div>
      <div className="grid gap-2">
        <FileUploadInput
          label="Additional Images"
          value={form.images || []}
          onChange={(urls) => update("images", urls)}
          accept="image/*"
          multiple={true}
          bucket="sujhav"
          folder="products"
          maxSize={10}
        />
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="grid gap-2">
          <Label>Subject</Label>
          <Input value={form.subject || ""} onChange={(e) => update("subject", e.target.value)} placeholder="e.g., Physics" />
        </div>
        <div className="grid gap-2">
          <Label>Class</Label>
          <Input value={form.class || ""} onChange={(e) => update("class", e.target.value)} placeholder="e.g., 11, 12" />
        </div>
        <div className="grid gap-2">
          <Label>Stream</Label>
          <Input value={form.stream || ""} onChange={(e) => update("stream", e.target.value)} placeholder="e.g., Science" />
        </div>
      </div>
      <div className="grid gap-2">
        <Label>File URL (for digital products)</Label>
        <Input value={form.fileUrl || ""} onChange={(e) => update("fileUrl", e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="grid gap-2">
          <Label>Rating (0-5)</Label>
          <Input
            type="number"
            step="0.1"
            min="0"
            max="5"
            value={form.rating ?? 0}
            onChange={(e) => update("rating", Number(e.target.value))}
          />
        </div>
        <div className="grid gap-2">
          <Label>Student Count</Label>
          <Input
            type="number"
            value={form.studentCount ?? 0}
            onChange={(e) => update("studentCount", Number(e.target.value))}
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <input
            id="isFree"
            type="checkbox"
            checked={!!form.isFree}
            onChange={(e) => update("isFree", e.target.checked)}
          />
          <Label htmlFor="isFree">Free</Label>
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
      </div>
      <Button onClick={() => { if (validateFormImages()) onSave(form) }}>Save</Button>
    </div>
  )
}

export default function AdminProductsPage() {

  const [items, setItems] = useState([])
  const [q, setQ] = useState("")
  const [loading, setLoading] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingItemId, setEditingItemId] = useState(null)

  const load = useMemo(
    () => async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/admin/products?q=${encodeURIComponent(q)}`)
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
    // validate payload before sending
    if (!validateProductPayload(payload)) return
    try {
      const res = await fetch("/api/admin/products", { method: "POST", body: JSON.stringify(payload) })
      if (res.ok) {
        setIsCreateDialogOpen(false)
        await load()
      } else {
        const data = await res.json().catch(() => ({}))
        toast({
          title: "Failed to create product",
          description: data.error || "An error occurred while creating the product",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Network error",
        description: "Failed to connect to the server. Please try again.",
        variant: "destructive"
      })
    }
  }
  async function updateItem(id, payload) {
    if (!validateProductPayload(payload)) return
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "PATCH", body: JSON.stringify(payload) })
      if (res.ok) {
        setEditingItemId(null)
        await load()
      } else {
        const data = await res.json().catch(() => ({}))
        toast({
          title: "Failed to update product",
          description: data.error || "An error occurred while updating the product",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Network error",
        description: "Failed to connect to the server. Please try again.",
        variant: "destructive"
      })
    }
  }
  async function deleteItem(id) {
    if (!confirm("Delete this product?")) return
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" })
    if (res.ok) await load()
  }

  function validateProductPayload(payload) {
    const mainCheck = validateImageUrl(payload.imageUrl)
    if (!mainCheck.isValid) {
      toast({ title: "Invalid image URL", description: mainCheck.error, variant: "destructive" })
      return false
    }
    const multiCheck = validateMultipleImageUrls(payload.images || [])
    if (!multiCheck.isValid) {
      const e = multiCheck.errors[0]
      toast({ title: `Invalid image at line ${e.index + 1}`, description: e.message, variant: "destructive" })
      return false
    }
    return true
  }

  const editingItem = items.find((p) => p.id === editingItemId)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Products</CardTitle>
        <div className="flex gap-2">
          <Input placeholder="Search..." value={q} onChange={(e) => setQ(e.target.value)} />
          <Button onClick={load} disabled={loading}>
            {loading ? "Loading..." : "Search"}
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">New Product</Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Create Product</DialogTitle>
              </DialogHeader>
              <ProductForm onSave={createItem} />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-muted-foreground">
            <tr>
              <th className="py-2 pr-4">Name</th>
              <th className="py-2 pr-4">Category</th>
              <th className="py-2 pr-4">Price</th>
              <th className="py-2 pr-4">Subject/Class</th>
              <th className="py-2 pr-4">Rating</th>
              <th className="py-2 pr-4">Students</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2 pr-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="py-2 pr-4">{p.name}</td>
                <td className="py-2 pr-4">{p.category}</td>
                <td className="py-2 pr-4">
                  {p.isFree ? (
                    <Badge className="bg-green-500">FREE</Badge>
                  ) : (
                    <>
                      ₹{Number(p.price).toLocaleString()}
                      {p.originalPrice && p.originalPrice > p.price && (
                        <span className="text-xs text-muted-foreground line-through ml-1">
                          ₹{Number(p.originalPrice).toLocaleString()}
                        </span>
                      )}
                    </>
                  )}
                </td>
                <td className="py-2 pr-4">
                  {p.subject || p.class ? `${p.subject || ""} ${p.class || ""}`.trim() : "-"}
                </td>
                <td className="py-2 pr-4">{p.rating ? `⭐ ${p.rating}` : "-"}</td>
                <td className="py-2 pr-4">{p.studentCount || 0}</td>
                <td className="py-2 pr-4">
                  <Badge variant={p.isActive ? "default" : "secondary"}>{p.isActive ? "Active" : "Inactive"}</Badge>
                </td>
                <td className="py-2 pr-4">
                  <Button size="sm" variant="outline" onClick={() => setEditingItemId(p.id)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="destructive" className="ml-2" onClick={() => deleteItem(p.id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td className="py-6 text-center text-muted-foreground" colSpan={8}>
                  No products.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </CardContent>
      <Dialog open={editingItemId !== null} onOpenChange={(open) => setEditingItemId(open ? editingItemId : null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          {editingItem && (
            <ProductForm
              initial={editingItem}
              onSave={(form) => updateItem(editingItem.id, form)}
            />
          )}
        </DialogContent>
      </Dialog>
    </Card>
  )
}
