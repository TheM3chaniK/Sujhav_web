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

function AchievementForm({ initial, onSave }) {
  const [form, setForm] = useState(
    initial || {
      userId: "",
      type: "JEE_MAIN",
      title: "",
      description: "",
      examName: "",
      rank: "",
      percentile: "",
      score: "",
      year: new Date().getFullYear(),
      isVerified: false,
      imageUrl: "",
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
        <Label>Type *</Label>
        <Select value={form.type} onValueChange={(v) => update("type", v)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="JEE_MAIN">JEE Main</SelectItem>
            <SelectItem value="JEE_ADVANCED">JEE Advanced</SelectItem>
            <SelectItem value="NEET">NEET</SelectItem>
            <SelectItem value="BOARD_EXAM">Board Exam</SelectItem>
            <SelectItem value="SCHOLARSHIP">Scholarship</SelectItem>
            <SelectItem value="COMPETITION">Competition</SelectItem>
            <SelectItem value="OTHER">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label>Title *</Label>
        <Input value={form.title} onChange={(e) => update("title", e.target.value)} required />
      </div>
      <div className="grid gap-2">
        <Label>Description *</Label>
        <textarea
          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label>Exam Name</Label>
        <Input value={form.examName} onChange={(e) => update("examName", e.target.value)} />
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="grid gap-2">
          <Label>Rank</Label>
          <Input type="number" value={form.rank} onChange={(e) => update("rank", e.target.value)} />
        </div>
        <div className="grid gap-2">
          <Label>Percentile</Label>
          <Input
            type="number"
            step="0.01"
            value={form.percentile}
            onChange={(e) => update("percentile", e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label>Score</Label>
          <Input type="number" value={form.score} onChange={(e) => update("score", e.target.value)} />
        </div>
      </div>
      <div className="grid gap-2">
        <Label>Year *</Label>
        <Input type="number" value={form.year} onChange={(e) => update("year", e.target.value)} required />
      </div>
      <div className="grid gap-2">
        <FileUploadInput
          label="Image URL"
          value={form.imageUrl || ""}
          onChange={(url) => update("imageUrl", url)}
          accept="image/jpeg,image/png,image/gif,image/webp"
          multiple={false}
          bucket="sujhav"
          folder="achievements"
          maxSize={10}
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          id="isVerified"
          type="checkbox"
          checked={!!form.isVerified}
          onChange={(e) => update("isVerified", e.target.checked)}
        />
        <Label htmlFor="isVerified">Verified</Label>
      </div>
      <Button onClick={() => onSave(form)}>Save</Button>
    </div>
  )
}

export default function AdminAchievementsPage() {
  
  const [items, setItems] = useState([])
  const [q, setQ] = useState("")
  const [typeFilter, setTypeFilter] = useState("")
  const [verifiedFilter, setVerifiedFilter] = useState("")
  const [loading, setLoading] = useState(false)

  const load = useMemo(
    () => async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (q) params.append("q", q)
        if (typeFilter) params.append("type", typeFilter)
        if (verifiedFilter) params.append("isVerified", verifiedFilter)
        const res = await fetch(`/api/admin/achievements?${params}`)
        const data = await res.json()
        setItems(data.items || [])
      } finally {
        setLoading(false)
      }
    },
    [q, typeFilter, verifiedFilter],
  )

  useEffect(() => {
    load()
  }, [load])

  async function createItem(payload) {
    if (!validateAchievementPayload(payload)) return
    const res = await fetch("/api/admin/achievements", { method: "POST", body: JSON.stringify(payload) })
    if (res.ok) await load()
  }

  async function updateItem(id, updates) {
    if (!validateAchievementPayload(updates)) return
    const res = await fetch("/api/admin/achievements", { method: "PATCH", body: JSON.stringify({ id, ...updates }) })
    if (res.ok) await load()
  }

  async function deleteItem(id) {
    if (!confirm("Delete this achievement?")) return
    const res = await fetch(`/api/admin/achievements?id=${id}`, { method: "DELETE" })
    if (res.ok) await load()
  }

  function validateAchievementPayload(payload) {
    if (!payload || typeof payload !== 'object') {
      toast({ title: 'Invalid payload', description: 'Payload must be an object', variant: 'destructive' })
      return false
    }
    if (payload.imageUrl && String(payload.imageUrl).trim() !== '') {
      const check = validateImageUrl(payload.imageUrl)
      if (!check.isValid) {
        toast({ title: 'Invalid image URL', description: check.error, variant: 'destructive' })
        return false
      }
    }
    return true
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Achievements</CardTitle>
        <div className="flex gap-2">
          <Input placeholder="Search..." value={q} onChange={(e) => setQ(e.target.value)} className="w-[200px]" />
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All</SelectItem>
              <SelectItem value="JEE_MAIN">JEE Main</SelectItem>
              <SelectItem value="JEE_ADVANCED">JEE Advanced</SelectItem>
              <SelectItem value="NEET">NEET</SelectItem>
              <SelectItem value="BOARD_EXAM">Board Exam</SelectItem>
              <SelectItem value="SCHOLARSHIP">Scholarship</SelectItem>
              <SelectItem value="COMPETITION">Competition</SelectItem>
              <SelectItem value="OTHER">Other</SelectItem>
            </SelectContent>
          </Select>
          <Select value={verifiedFilter} onValueChange={setVerifiedFilter}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All</SelectItem>
              <SelectItem value="true">Verified</SelectItem>
              <SelectItem value="false">Unverified</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={load} disabled={loading}>
            {loading ? "Loading..." : "Search"}
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">New Achievement</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add Achievement</DialogTitle>
              </DialogHeader>
              <AchievementForm onSave={createItem} />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-muted-foreground">
            <tr>
              <th className="py-2 pr-4">Student</th>
              <th className="py-2 pr-4">Type</th>
              <th className="py-2 pr-4">Title</th>
              <th className="py-2 pr-4">Exam</th>
              <th className="py-2 pr-4">Rank/Score</th>
              <th className="py-2 pr-4">Year</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2 pr-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((ach) => (
              <tr key={ach.id} className="border-t">
                <td className="py-2 pr-4">{ach.user?.fullName || ach.user?.email || "-"}</td>
                <td className="py-2 pr-4">
                  <Badge variant="outline">{ach.type.replace("_", " ")}</Badge>
                </td>
                <td className="py-2 pr-4">{ach.title}</td>
                <td className="py-2 pr-4">{ach.examName || "-"}</td>
                <td className="py-2 pr-4">
                  {ach.rank ? `Rank ${ach.rank}` : ach.score ? `Score ${ach.score}` : "-"}
                </td>
                <td className="py-2 pr-4">{ach.year}</td>
                <td className="py-2 pr-4">
                  <Badge variant={ach.isVerified ? "default" : "secondary"}>
                    {ach.isVerified ? "Verified" : "Unverified"}
                  </Badge>
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
                        <DialogTitle>Edit Achievement</DialogTitle>
                      </DialogHeader>
                      <AchievementForm
                        initial={ach}
                        onSave={async (form) => {
                          await updateItem(ach.id, form)
                          const closeBtn = document.querySelector("[data-state='open'] button[aria-label='Close']")
                          closeBtn?.click()
                        }}
                      />
                    </DialogContent>
                  </Dialog>
                  <Button size="sm" variant="destructive" className="ml-2" onClick={() => deleteItem(ach.id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td className="py-6 text-center text-muted-foreground" colSpan={8}>
                  No achievements found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </CardContent>
    </Card>
  )
}

