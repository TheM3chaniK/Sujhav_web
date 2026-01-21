"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star } from "lucide-react"

function ReviewForm({ initial, onSave }) {
  const [form, setForm] = useState(
    initial || {
      userId: "",
      productId: "",
      rating: 5,
      comment: "",
      isVerified: false,
    },
  )
  const update = (k, v) => setForm((s) => ({ ...s, [k]: v }))
  return (
    <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
      <div className="grid gap-2">
        <Label>User ID *</Label>
        <Input value={form.userId} onChange={(e) => update("userId", e.target.value)} required />
      </div>
      <div className="grid gap-2">
        <Label>Product ID *</Label>
        <Input value={form.productId} onChange={(e) => update("productId", e.target.value)} required />
      </div>
      <div className="grid gap-2">
        <Label>Rating (1-5) *</Label>
        <Input
          type="number"
          min="1"
          max="5"
          value={form.rating}
          onChange={(e) => update("rating", Number(e.target.value))}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label>Comment</Label>
        <textarea
          className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={form.comment}
          onChange={(e) => update("comment", e.target.value)}
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          id="isVerified"
          type="checkbox"
          checked={!!form.isVerified}
          onChange={(e) => update("isVerified", e.target.checked)}
        />
        <Label htmlFor="isVerified">Verified Purchase</Label>
      </div>
      <Button onClick={() => onSave(form)}>Save</Button>
    </div>
  )
}

export default function AdminReviewsPage() {
  const [items, setItems] = useState([])
  const [verifiedFilter, setVerifiedFilter] = useState("")
  const [loading, setLoading] = useState(false)

  const load = useMemo(
    () => async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (verifiedFilter) params.append("isVerified", verifiedFilter)
        const res = await fetch(`/api/admin/reviews?${params}`)
        const data = await res.json()
        setItems(data.items || [])
      } finally {
        setLoading(false)
      }
    },
    [verifiedFilter],
  )

  useEffect(() => {
    load()
  }, [load])

  async function createItem(payload) {
    const res = await fetch("/api/admin/reviews", { method: "POST", body: JSON.stringify(payload) })
    if (res.ok) await load()
  }

  async function updateItem(id, updates) {
    const res = await fetch("/api/admin/reviews", { method: "PATCH", body: JSON.stringify({ id, ...updates }) })
    if (res.ok) await load()
  }

  async function deleteItem(id) {
    if (!confirm("Delete this review?")) return
    const res = await fetch(`/api/admin/reviews?id=${id}`, { method: "DELETE" })
    if (res.ok) await load()
  }

  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
          />
        ))}
      </div>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Product Reviews</CardTitle>
        <div className="flex gap-2">
          <Select value={verifiedFilter} onValueChange={setVerifiedFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Reviews" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All</SelectItem>
              <SelectItem value="true">Verified</SelectItem>
              <SelectItem value="false">Unverified</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={load} disabled={loading}>
            {loading ? "Loading..." : "Refresh"}
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">New Review</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add Review</DialogTitle>
              </DialogHeader>
              <ReviewForm onSave={createItem} />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-muted-foreground">
            <tr>
              <th className="py-2 pr-4">User</th>
              <th className="py-2 pr-4">Product</th>
              <th className="py-2 pr-4">Rating</th>
              <th className="py-2 pr-4">Comment</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2 pr-4">Date</th>
              <th className="py-2 pr-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((review) => (
              <tr key={review.id} className="border-t">
                <td className="py-2 pr-4">{review.user?.fullName || review.user?.email || "-"}</td>
                <td className="py-2 pr-4">{review.product?.name || "-"}</td>
                <td className="py-2 pr-4">{renderStars(review.rating)}</td>
                <td className="py-2 pr-4">
                  <div className="max-w-xs truncate">{review.comment || "-"}</div>
                </td>
                <td className="py-2 pr-4">
                  <Badge variant={review.isVerified ? "default" : "secondary"}>
                    {review.isVerified ? "Verified" : "Unverified"}
                  </Badge>
                </td>
                <td className="py-2 pr-4">{new Date(review.createdAt).toLocaleDateString()}</td>
                <td className="py-2 pr-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline">
                        View/Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Review Details</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">User:</span> {review.user?.fullName || "-"}
                          </div>
                          <div>
                            <span className="text-muted-foreground">Email:</span> {review.user?.email || "-"}
                          </div>
                          <div>
                            <span className="text-muted-foreground">Product:</span> {review.product?.name || "-"}
                          </div>
                          <div>
                            <span className="text-muted-foreground">Rating:</span> {review.rating}/5
                          </div>
                          <div>
                            <span className="text-muted-foreground">Status:</span>{" "}
                            {review.isVerified ? "Verified" : "Unverified"}
                          </div>
                          <div>
                            <span className="text-muted-foreground">Date:</span>{" "}
                            {new Date(review.createdAt).toLocaleString()}
                          </div>
                        </div>
                        {review.comment && (
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">Comment:</div>
                            <div className="p-3 bg-muted/50 rounded text-sm">{review.comment}</div>
                          </div>
                        )}
                        <div className="flex gap-2">
                          <Button
                            variant={review.isVerified ? "secondary" : "default"}
                            onClick={() => updateItem(review.id, { isVerified: !review.isVerified })}
                          >
                            {review.isVerified ? "Mark Unverified" : "Mark Verified"}
                          </Button>
                          <Button variant="destructive" onClick={() => deleteItem(review.id)}>
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
                  No reviews found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </CardContent>
    </Card>
  )
}

