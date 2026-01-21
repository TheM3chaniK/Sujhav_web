"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminCartItemsPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)

  const load = useMemo(
    () => async () => {
      setLoading(true)
      try {
        const res = await fetch("/api/admin/cart-items")
        const data = await res.json()
        setItems(data.items || [])
      } finally {
        setLoading(false)
      }
    },
    [],
  )

  useEffect(() => {
    load()
  }, [load])

  async function deleteItem(id) {
    if (!confirm("Delete this cart item?")) return
    const res = await fetch(`/api/admin/cart-items?id=${id}`, { method: "DELETE" })
    if (res.ok) await load()
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Cart Items</CardTitle>
        <Button onClick={load} disabled={loading}>
          {loading ? "Loading..." : "Refresh"}
        </Button>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-muted-foreground">
            <tr>
              <th className="py-2 pr-4">User</th>
              <th className="py-2 pr-4">Email</th>
              <th className="py-2 pr-4">Product</th>
              <th className="py-2 pr-4">Price</th>
              <th className="py-2 pr-4">Quantity</th>
              <th className="py-2 pr-4">Total</th>
              <th className="py-2 pr-4">Added</th>
              <th className="py-2 pr-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="py-2 pr-4">{item.user?.fullName || "-"}</td>
                <td className="py-2 pr-4">{item.user?.email || "-"}</td>
                <td className="py-2 pr-4">{item.product?.name || "-"}</td>
                <td className="py-2 pr-4">₹{item.product?.price || 0}</td>
                <td className="py-2 pr-4">{item.quantity}</td>
                <td className="py-2 pr-4">₹{(item.product?.price || 0) * item.quantity}</td>
                <td className="py-2 pr-4">{new Date(item.createdAt).toLocaleDateString()}</td>
                <td className="py-2 pr-4">
                  <Button size="sm" variant="destructive" onClick={() => deleteItem(item.id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td className="py-6 text-center text-muted-foreground" colSpan={8}>
                  No cart items found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </CardContent>
    </Card>
  )
}

