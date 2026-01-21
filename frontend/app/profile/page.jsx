"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  User,
  Calendar,
  GraduationCap,
  BookOpen,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState(null)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    class: "",
    stream: "",
    currentPassword: "",
    newPassword: "",
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        window.location.href = "/"
        return
      }

      const response = await fetch("/api/user/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        setFormData({
          fullName: data.user.fullName || "",
          phone: data.user.phone || "",
          class: data.user.class || "",
          stream: data.user.stream || "",
          currentPassword: "",
          newPassword: "",
        })
      } else {
        throw new Error("Failed to fetch profile")
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
      setMessage({ type: "error", text: "Failed to load profile" })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setUser(data.user)
        setMessage({ type: "success", text: data.message })

        // Update localStorage with new user data
        const currentUserData = JSON.parse(localStorage.getItem("user") || "{}")
        const updatedUserData = { ...currentUserData, ...data.user }
        localStorage.setItem("user", JSON.stringify(updatedUserData))

        // Clear password fields
        setFormData((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
        }))
      } else {
        setMessage({ type: "error", text: data.error })
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      setMessage({ type: "error", text: "Failed to update profile" })
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-green-400 mx-auto" />
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertCircle className="h-16 w-16 text-red-400 mx-auto" />
          <h2 className="text-2xl font-bold text-red-400">Access Denied</h2>
          <p className="text-gray-400">Please sign in to view your profile.</p>
          <Link href="/">
            <Button className="bg-green-500 hover:bg-green-600 text-black">Go to Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold">
            <span className="bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent">
              Profile Settings
            </span>
          </h1>
          <p className="text-xl text-gray-400">Manage your account information and preferences</p>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg border ${
              message.type === "success"
                ? "bg-green-500/10 border-green-500/30 text-green-400"
                : "bg-red-500/10 border-red-500/30 text-red-400"
            }`}
          >
            <div className="flex items-center space-x-2">
              {message.type === "success" ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
              <span>{message.text}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Overview */}
          <div className="lg:col-span-1">
            <Card className="bg-white/5 backdrop-blur-xl border border-green-500/20">
              <CardHeader className="text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-green-400 to-green-500 flex items-center justify-center text-black font-bold text-2xl mx-auto mb-4">
                  {user.fullName
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2) || "U"}
                </div>
                <CardTitle className="text-green-400">{user.fullName}</CardTitle>
                <p className="text-gray-400">{user.email}</p>
                {user.isSujhavStudent && (
                  <Badge className="mt-2 bg-green-500/20 text-green-400 border-green-500/30">SUJHAV Student</Badge>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3 text-sm text-gray-400">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
                {user.lastLoginAt && (
                  <div className="flex items-center space-x-3 text-sm text-gray-400">
                    <User className="h-4 w-4" />
                    <span>Last login {new Date(user.lastLoginAt).toLocaleDateString()}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2">
            <Card className="bg-white/5 backdrop-blur-xl border border-green-500/20">
              <CardHeader>
                <CardTitle className="text-green-400">Edit Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                      <User className="h-5 w-5" />
                      <span>Basic Information</span>
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName" className="text-gray-300">
                          Full Name *
                        </Label>
                        <Input
                          id="fullName"
                          value={formData.fullName}
                          onChange={(e) => handleInputChange("fullName", e.target.value)}
                          className="bg-white/10 border-gray-600 text-white"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-300">
                          Email Address
                        </Label>
                        <Input
                          id="email"
                          value={user.email}
                          disabled
                          className="bg-gray-800 border-gray-600 text-gray-400"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-gray-300">
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className="bg-white/10 border-gray-600 text-white"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>

                  {/* SUJHAV Student Information */}
                  {user.isSujhavStudent && (
                    <>
                      <Separator className="bg-gray-700" />
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                          <GraduationCap className="h-5 w-5" />
                          <span>Academic Information</span>
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-gray-300">Class</Label>
                            <RadioGroup
                              value={formData.class}
                              onValueChange={(value) => handleInputChange("class", value)}
                              className="flex flex-wrap gap-4"
                            >
                              {["11", "12"].map((cls) => (
                                <div key={cls} className="flex items-center space-x-2">
                                  <RadioGroupItem value={cls} id={`class-${cls}`} />
                                  <Label htmlFor={`class-${cls}`} className="text-gray-300">
                                    Class {cls}
                                  </Label>
                                </div>
                              ))}
                            </RadioGroup>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-gray-300">Stream</Label>
                            <RadioGroup
                              value={formData.stream}
                              onValueChange={(value) => handleInputChange("stream", value)}
                              className="flex flex-wrap gap-4"
                            >
                              {["Science", "Commerce", "Arts"].map((stream) => (
                                <div key={stream} className="flex items-center space-x-2">
                                  <RadioGroupItem value={stream} id={`stream-${stream}`} />
                                  <Label htmlFor={`stream-${stream}`} className="text-gray-300">
                                    {stream}
                                  </Label>
                                </div>
                              ))}
                            </RadioGroup>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Password Change */}
                  <Separator className="bg-gray-700" />
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                      <BookOpen className="h-5 w-5" />
                      <span>Change Password</span>
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword" className="text-gray-300">
                          Current Password
                        </Label>
                        <div className="relative">
                          <Input
                            id="currentPassword"
                            type={showCurrentPassword ? "text" : "password"}
                            value={formData.currentPassword}
                            onChange={(e) => handleInputChange("currentPassword", e.target.value)}
                            className="bg-white/10 border-gray-600 text-white pr-10"
                            placeholder="Enter current password"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          >
                            {showCurrentPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-400" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-400" />
                            )}
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="newPassword" className="text-gray-300">
                          New Password
                        </Label>
                        <div className="relative">
                          <Input
                            id="newPassword"
                            type={showNewPassword ? "text" : "password"}
                            value={formData.newPassword}
                            onChange={(e) => handleInputChange("newPassword", e.target.value)}
                            className="bg-white/10 border-gray-600 text-white pr-10"
                            placeholder="Enter new password"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          >
                            {showNewPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-400" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-400" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-gray-500">
                      Leave password fields empty if you don't want to change your password.
                    </p>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={saving}
                      className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-black font-semibold px-8"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
