"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

function StatusForm({ initialStatus, onSave }) {
  const [status, setStatus] = useState(initialStatus || "PENDING")
  return (
    <div className="space-y-3">
      <Label>Status</Label>
      <Select value={status} onValueChange={setStatus}>
        <SelectTrigger>
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="PENDING">PENDING</SelectItem>
          <SelectItem value="CONFIRMED">CONFIRMED</SelectItem>
          <SelectItem value="PROCESSING">PROCESSING</SelectItem>
          <SelectItem value="SHIPPED">SHIPPED</SelectItem>
          <SelectItem value="DELIVERED">DELIVERED</SelectItem>
          <SelectItem value="CANCELLED">CANCELLED</SelectItem>
        </SelectContent>
      </Select>
      <Button onClick={() => onSave({ status })}>Save</Button>
    </div>
  )
}

export default function AdminOrdersPage() {
  const [items, setItems] = useState([])
  const [status, setStatus] = useState("") // Empty means all statuses
  const [loading, setLoading] = useState(false)
  const [detail, setDetail] = useState(null)

  const load = useMemo(
    () => async () => {
      setLoading(true)
      try {
        const url = `/api/admin/orders${status ? `?status=${encodeURIComponent(status)}` : ""}`
        const res = await fetch(url)
        const data = await res.json()
        setItems(data.items || [])
      } finally {
        setLoading(false)
      }
    },
    [status],
  )

  useEffect(() => {
    load()
  }, [load])

  async function openDetail(id) {
    const res = await fetch(`/api/admin/orders/${id}`)
    const data = await res.json()
    if (res.ok) setDetail(data.order)
  }

  async function updateStatus(id, updates) {
    const res = await fetch(`/api/admin/orders/${id}`, { method: "PATCH", body: JSON.stringify(updates) })
    if (res.ok) {
      await load()
      setDetail(null)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Orders</CardTitle>
        <div className="flex gap-2">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="PENDING">PENDING</SelectItem>
              <SelectItem value="CONFIRMED">CONFIRMED</SelectItem>
              <SelectItem value="PROCESSING">PROCESSING</SelectItem>
              <SelectItem value="SHIPPED">SHIPPED</SelectItem>
              <SelectItem value="DELIVERED">DELIVERED</SelectItem>
              <SelectItem value="CANCELLED">CANCELLED</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={load} disabled={loading}>
            {loading ? "Loading..." : "Refresh"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-muted-foreground">
            <tr>
              <th className="py-2 pr-4">ID</th>
              <th className="py-2 pr-4">User</th>
              <th className="py-2 pr-4">Total</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2 pr-4">Created</th>
              <th className="py-2 pr-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((o) => (
              <tr key={o.id} className="border-t">
                <td className="py-2 pr-4 text-xs">{o.id.substring(0, 8)}...</td>
                <td className="py-2 pr-4">{o.user?.fullName || o.user?.email || "-"}</td>
                <td className="py-2 pr-4">₹{Number(o.totalAmount || 0).toLocaleString()}</td>
                <td className="py-2 pr-4">
                  <Badge
                    variant={
                      o.status === "DELIVERED"
                        ? "default"
                        : o.status === "CANCELLED"
                          ? "destructive"
                          : "secondary"
                    }
                  >
                    {o.status}
                  </Badge>
                </td>
                <td className="py-2 pr-4">{new Date(o.createdAt).toLocaleString()}</td>
                <td className="py-2 pr-4">
                  <Button size="sm" variant="outline" onClick={() => openDetail(o.id)}>
                    View
                  </Button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td className="py-6 text-center text-muted-foreground" colSpan={6}>
                  No orders.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </CardContent>

      <Dialog open={!!detail} onOpenChange={(open) => !open && setDetail(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order Detail</DialogTitle>
          </DialogHeader>
          {detail && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Order ID:</span> {detail.id}
                </div>
                <div>
                  <span className="text-muted-foreground">Status:</span>{" "}
                  <Badge
                    variant={
                      detail.status === "DELIVERED"
                        ? "default"
                        : detail.status === "CANCELLED"
                          ? "destructive"
                          : "secondary"
                    }
                  >
                    {detail.status}
                  </Badge>
                </div>
                <div>
                  <span className="text-muted-foreground">User:</span> {detail.user?.fullName || detail.user?.email || "-"}
                </div>
                <div>
                  <span className="text-muted-foreground">Email:</span> {detail.user?.email || "-"}
                </div>
                <div>
                  <span className="text-muted-foreground">Phone:</span> {detail.user?.phone || "-"}
                </div>
                <div>
                  <span className="text-muted-foreground">Total:</span> ₹
                  {Number(detail.totalAmount || 0).toLocaleString()}
                </div>
                <div>
                  <span className="text-muted-foreground">Payment Method:</span> {detail.paymentMethod || "-"}
                </div>
                <div>
                  <span className="text-muted-foreground">Payment Status:</span> {detail.paymentStatus || "-"}
                </div>
                <div>
                  <span className="text-muted-foreground">Created:</span> {new Date(detail.createdAt).toLocaleString()}
                </div>
                {detail.paidAt && (
                  <div>
                    <span className="text-muted-foreground">Paid At:</span> {new Date(detail.paidAt).toLocaleString()}
                  </div>
                )}
              </div>
              <div>
                <div className="font-medium mb-2">Order Items</div>
                <div className="rounded border">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left p-2">Product</th>
                        <th className="text-left p-2">Qty</th>
                        <th className="text-left p-2">Price</th>
                        <th className="text-left p-2">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detail.orderItems?.map((it) => {
                        const productName = it.product?.name || "-"
                        return (
                          <tr key={it.id} className="border-t">
                            <td className="p-2">{productName}</td>
                            <td className="p-2">{it.quantity || 1}</td>
                            <td className="p-2">₹{Number(it.price || 0).toLocaleString()}</td>
                            <td className="p-2">₹{Number((it.price || 0) * (it.quantity || 1)).toLocaleString()}</td>
                          </tr>
                        )
                      })}
                      {(!detail.orderItems || detail.orderItems.length === 0) && (
                        <tr>
                          <td className="p-3 text-center text-muted-foreground" colSpan={4}>
                            No items.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="pt-2">
                <StatusForm initialStatus={detail.status} onSave={(payload) => updateStatus(detail.id, payload)} />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  )
}
