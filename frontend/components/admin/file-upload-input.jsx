"use client"

import React, { useState, useRef, useCallback, useMemo, useEffect } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Upload, X, Link as LinkIcon, Image as ImageIcon, FileText, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { cn, validateImageUrl } from "@/lib/utils"

/**
 * FileUploadInput
 * Dual-mode file upload and URL input component
 */
export default function FileUploadInput({
  value,
  onChange,
  accept = "image/*",
  multiple = false,
  bucket = process.env.NEXT_PUBLIC_SUPABASE_DEFAULT_BUCKET || "sujhav",
  folder = "general",
  label,
  maxSize = 10, // MB
  disabled = false,
  uploadUrl = "/api/admin/upload",
  emitMeta = false, // when true and multiple===false, emit {url,name,size} for single uploads/URL adds
}) {
  const { toast } = useToast()
  const [bucketWarning, setBucketWarning] = useState(null)
  const [activeTab, setActiveTab] = useState("upload")
  const [selectedFiles, setSelectedFiles] = useState([])
  const [previews, setPreviews] = useState([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [urlInput, setUrlInput] = useState("")
  const [error, setError] = useState(null)
  const fileRef = useRef(null)
  const multiUrlRef = useRef(null)
  const [dragging, setDragging] = useState(false)

  const maxBytes = maxSize * 1024 * 1024

  const isImageAccepting = accept.includes("image")
  const acceptParts = useMemo(() => accept.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean), [accept])
  const expectsPdf = acceptParts.includes("application/pdf") || acceptParts.includes(".pdf")

  const resetSelection = () => {
    // revoke object URLs
    previews.forEach((p) => p.url && URL.revokeObjectURL(p.url))
    setSelectedFiles([])
    setPreviews([])
    if (fileRef.current) fileRef.current.value = ''
  }

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 B"
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }

  const isImageFile = (file) => {
    return file?.type && file.type.startsWith("image/") && file.type !== "image/svg+xml"
  }

  const generatePreview = (file) => {
    try {
      return URL.createObjectURL(file)
    } catch (e) {
      return null
    }
  }

  const handleFileInput = (files) => {
    const arr = Array.from(files || [])
    // Validate
    // parse accept into patterns
    const acceptParts = accept.split(",").map((s) => s.trim()).filter(Boolean)
    function matchesAccept(f) {
      if (!acceptParts.length) return true
      const mime = f.type || ""
      const name = (f.name || "").toLowerCase()
      for (const part of acceptParts) {
        if (part.endsWith("/*")) {
          const prefix = part.replace("/*", "")
          if (mime.startsWith(prefix)) return true
        } else if (part.startsWith('.')) {
          if (name.endsWith(part.toLowerCase())) return true
        } else {
          if (mime === part) return true
        }
      }
      return false
    }

    for (const f of arr) {
      if (maxBytes && f.size > maxBytes) {
        toast({ title: "File too large", description: `${f.name} exceeds ${maxSize}MB`, variant: "destructive" })
        return
      }
      // validate against accept prop
      if (!matchesAccept(f)) {
        toast({ title: "Invalid file type", description: `${f.name} does not match accepted types`, variant: "destructive" })
        return
      }
    }

    const newPreviews = arr.map((f) => ({ name: f.name, url: generatePreview(f), size: f.size, file: f }))
    setSelectedFiles(multiple ? [...selectedFiles, ...arr] : arr)
    setPreviews(multiple ? [...previews, ...newPreviews] : newPreviews)
    setError(null)
  }

  const handleSelectClick = () => {
    if (disabled) return
    fileRef.current?.click()
  }

  const handleFileChange = (e) => {
    handleFileInput(e.target.files)
  }

  // revoke object URLs on unmount or when previews change
  useEffect(() => {
    return () => {
      previews.forEach((p) => p.url && URL.revokeObjectURL(p.url))
    }
  }, [previews])

  // Validate bucket existence on mount and when bucket prop changes
  useEffect(() => {
    let mounted = true
    // During the migration/transition phase the Next.js API route
    // `/api/admin/debug-buckets` is removed. Disable runtime calls
    // to that endpoint to avoid module-not-found / network errors.
    // The checkBucket function is intentionally a no-op for now.
    async function checkBucket() {
      // disabled: avoid calling deleted debug endpoint
      return
    }
    // Note: not invoking checkBucket() to prevent any network call
    return () => { mounted = false }
  }, [bucket])

  // Drag and drop handlers
  const onDragOver = (e) => {
    e.preventDefault()
    if (disabled) return
    setDragging(true)
  }
  const onDragLeave = (e) => {
    e.preventDefault()
    setDragging(false)
  }
  const onDrop = (e) => {
    e.preventDefault()
    if (disabled) return
    setDragging(false)
    const dt = e.dataTransfer
    if (dt && dt.files && dt.files.length) {
      handleFileInput(dt.files)
    }
  }

  const uploadSingle = (file, onProgress) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      const fd = new FormData()
      fd.append("file", file)
      fd.append("bucket", bucket)
      fd.append("folder", folder)
      xhr.open("POST", uploadUrl)
      xhr.upload.onprogress = (ev) => {
        if (ev.lengthComputable && onProgress) {
          onProgress(ev.loaded, ev.total)
        }
      }
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const res = JSON.parse(xhr.responseText)
            resolve(res)
          } catch (err) {
            reject(new Error("Invalid JSON response"))
          }
        } else {
          reject(new Error(xhr.responseText || `Upload failed with status ${xhr.status}`))
        }
      }
      xhr.onerror = () => reject(new Error("Network error during upload"))
      xhr.send(fd)
    })
  }

  const handleUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) return
    setUploading(true)
    setUploadProgress(0)
  try {
      const totalSize = selectedFiles.reduce((s, f) => s + (f.size || 0), 0)
      let uploadedSoFar = 0
      const urls = []
      for (const f of selectedFiles) {
        // per-file progress
        await uploadSingle(f, (loaded, total) => {
          const per = total ? (loaded / total) : 0
          const overall = Math.round(((uploadedSoFar + per * f.size) / totalSize) * 100)
          setUploadProgress(Math.min(100, overall || 0))
        }).then((res) => {
          urls.push(res.url)
          uploadedSoFar += f.size || 0
        })
      }

  // Update parent
      if (multiple) {
        const next = Array.isArray(value) ? [...value, ...urls] : [...urls]
        const deduped = Array.from(new Set(next))
        onChange?.(deduped)
      } else {
        const firstUrl = urls[0] || null
        if (emitMeta) {
          const f = selectedFiles && selectedFiles[0]
          onChange?.(firstUrl ? { url: firstUrl, name: f?.name, size: f?.size } : null)
        } else {
          onChange?.(firstUrl)
        }
      }
      toast({ title: "Upload complete", description: "Files uploaded successfully" })
      resetSelection()
    } catch (err) {
      console.error(err)
      // Try to parse bucket context from server response if available
      let msg = String(err.message || err)
      try {
        const parsed = typeof err === 'string' ? JSON.parse(err) : (err && err.message && JSON.parse(err.message))
        if (parsed && parsed.bucket) {
          msg = `${parsed.error || msg} (bucket: ${parsed.bucket})`
        }
      } catch (_) {}
      // Provide actionable suggestion when bucket-not-found is detected
      if (/Bucket .* not found/i.test(msg)) {
        msg = `${msg}. Check that the '${bucket}' bucket exists in your Supabase project (see docs/storage.md)`
      }
      toast({ title: "Upload failed", description: msg, variant: "destructive" })
      setError(msg)
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const isValidUrl = (u) => {
    try {
      new URL(u)
      return true
    } catch (e) {
      return false
    }
  }

  const handleUrlAdd = () => {
    if (!urlInput) return
    const trimmed = urlInput.trim()
    if (!isValidUrl(trimmed)) {
      toast({ title: "Invalid URL", description: "Please enter a valid URL", variant: "destructive" })
      return
    }
    // If image-accepting, run validateImageUrl to check host/https
    if (isImageAccepting) {
      const res = validateImageUrl(trimmed)
      if (!res.isValid) {
        toast({ title: "Invalid image URL", description: res.error, variant: "destructive" })
        return
      }
    } else if (expectsPdf) {
      // For PDF acceptors, ensure the URL points to a .pdf
      if (!/\.pdf(\?.*)?$/i.test(trimmed)) {
        toast({ title: 'Invalid PDF URL', description: 'Please provide a direct .pdf URL', variant: 'destructive' })
        return
      }
    }
    if (multiple) {
      const arr = Array.isArray(value) ? [...value, trimmed] : [trimmed]
      const deduped = Array.from(new Set(arr))
      onChange?.(deduped)
    } else {
      if (emitMeta) {
        // try to infer filename from URL
        let name
        try {
          const u = new URL(trimmed)
          name = decodeURIComponent((u.pathname || "").split("/").pop() || "")
        } catch (e) {
          name = undefined
        }
        onChange?.({ url: trimmed, name, size: undefined })
      } else {
        onChange?.(trimmed)
      }
    }
    setUrlInput("")
  }

  const handleUrlsAddFromTextarea = (text) => {
    const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)
    const good = []
    for (const ln of lines) {
      if (!isValidUrl(ln)) {
        toast({ title: "Invalid URL", description: `${ln} is not a valid URL`, variant: "destructive" })
        return
      }
      if (isImageAccepting) {
        const res = validateImageUrl(ln)
        if (!res.isValid) {
          toast({ title: "Invalid image URL", description: res.error, variant: "destructive" })
          return
        }
      } else if (expectsPdf) {
        if (!/\.pdf(\?.*)?$/i.test(ln)) {
          toast({ title: 'Invalid PDF URL', description: `${ln} is not a .pdf URL`, variant: "destructive" })
          return
        }
      }
      good.push(ln)
    }
  const arr = Array.isArray(value) ? [...value, ...good] : [...good]
    const deduped = Array.from(new Set(arr))
    onChange?.(deduped)
  }

  const handleRemove = (idxOrUrl) => {
    if (multiple) {
      if (!Array.isArray(value)) return
      const filtered = value.filter((v, i) => i !== idxOrUrl && v !== idxOrUrl)
      onChange?.(filtered)
    } else {
      onChange?.(null)
    }
  }

  const currentValues = useMemo(() => {
    if (multiple) return Array.isArray(value) ? value : []
    if (!value) return []
    // support value being an object when emitMeta is used
    if (emitMeta && typeof value === 'object' && value !== null && value.url) return [value.url]
    return [value]
  }, [value, multiple, emitMeta])

  return (
    <div>
      {label && <Label>{label}</Label>}
      {bucketWarning && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 my-2 text-sm text-yellow-800">⚠️ {bucketWarning}</div>
      )}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="upload">Upload</TabsTrigger>
          <TabsTrigger value="url">URL</TabsTrigger>
        </TabsList>

        <TabsContent value="upload">
          <input ref={fileRef} type="file" className="hidden" multiple={multiple} accept={accept} onChange={handleFileChange} />
          <div
            role="button"
            tabIndex={0}
            onClick={handleSelectClick}
            onKeyDown={(e) => e.key === "Enter" && handleSelectClick()}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            className={cn("border-2 border-dashed rounded-md p-4 text-center cursor-pointer", disabled && "opacity-60 pointer-events-none", dragging && "bg-muted/20")}
          >
            {previews.length === 0 ? (
              <div className="flex flex-col items-center gap-2">
                <Upload />
                <div className="text-sm text-muted-foreground">Click to select files or drag and drop</div>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                      {previews.map((p, i) => (
                  <div key={i} className="relative border rounded overflow-hidden">
                          {isImageFile(p.file) ? (
                            <img src={p.url} alt={p.name} className="object-cover w-full h-24" />
                          ) : (
                            <div className="flex items-center justify-center h-24"><FileText /></div>
                          )}
                          <button type="button" onClick={() => { URL.revokeObjectURL(p.url); const newP = previews.filter((_, idx) => idx !== i); setPreviews(newP); setSelectedFiles((s) => s.filter((_, idx) => idx !== i)); if (fileRef.current) fileRef.current.value = '' }} className="absolute top-1 right-1 bg-white rounded-full p-1"><X size={14} /></button>
                    <div className="p-1 text-xs truncate">{p.name}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 mt-2">
            <Button onClick={handleSelectClick} disabled={disabled || uploading} variant="outline" size="sm"><ImageIcon /> Select</Button>
            <Button onClick={handleUpload} disabled={disabled || uploading || selectedFiles.length === 0} size="sm">{uploading ? <><Loader2 className="animate-spin" /> Uploading...</> : <>Upload</>}</Button>
            <Button onClick={resetSelection} variant="ghost" size="sm">Clear</Button>
          </div>

          {uploading && <div className="mt-2"><Progress value={uploadProgress} /><div className="text-xs mt-1">{uploadProgress}%</div></div>}
          {error && <div className="text-sm text-destructive mt-2">{error}</div>}
        </TabsContent>

        <TabsContent value="url">
          {!multiple ? (
            <div className="flex gap-2">
              <Input placeholder="https://example.com/image.jpg" value={urlInput} onChange={(e) => setUrlInput(e.target.value)} disabled={disabled} />
              <Button onClick={handleUrlAdd} size="sm" disabled={disabled || !urlInput.trim()}><LinkIcon /></Button>
            </div>
          ) : (
            <div>
              <textarea ref={multiUrlRef} className="w-full rounded-md border p-2" placeholder="Enter one URL per line" rows={4} disabled={disabled} />
              <div className="flex gap-2 mt-2">
                <Button onClick={() => { handleUrlsAddFromTextarea(multiUrlRef.current?.value || '') }} disabled={disabled}>Add URLs</Button>
                <Button variant="ghost" onClick={() => { if (multiUrlRef.current) multiUrlRef.current.value = '' }} disabled={disabled}>Clear</Button>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Preview of current values */}
      <div className="mt-4">
        {currentValues.length === 0 ? (
          <div className="text-sm text-muted-foreground">No file selected</div>
        ) : (
          <div className="grid grid-cols-4 gap-2">
            {currentValues.map((v, i) => (
              <div key={i} className="relative border rounded overflow-hidden">
                {/* crude image detection by extension */}
                {/(\.jpg|\.jpeg|\.png|\.gif|\.webp)$/i.test(v) ? (
                  <img src={v} alt={`file-${i}`} className="object-cover w-full h-24" />
                ) : (
                  <div className="flex items-center justify-center h-24"><FileText /></div>
                )}
                <button type="button" onClick={() => handleRemove(i)} className="absolute top-1 right-1 bg-white rounded-full p-1"><X size={14} /></button>
                <div className="p-1 text-xs truncate">{v}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
