"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Eye, EyeOff, Loader2, User, Mail, Phone, GraduationCap } from 'lucide-react'
import { Alert, AlertDescription } from "@/components/ui/alert"
import { isBackendReady } from "@/lib/utils"

export default function LoginModal({ isOpen, onClose }) {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Login form state
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  })

  // Signup form state
  const [signupData, setSignupData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phone: "",
    isSujhavStudent: "",
    studentClass: "",
    stream: "",
  })

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (!isBackendReady()) {
      setError("Authentication is temporarily unavailable")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Login failed")
      }

      // Store user data in localStorage
      localStorage.setItem("user", JSON.stringify(data.user))
      localStorage.setItem("token", data.token)

      setSuccess("Login successful! Redirecting...")
      
      // Close modal
      onClose()

      // Redirect based on SUJHAV student status
      setTimeout(() => {
        if (data.user.isSujhavStudent) {
          router.push("/dashboard")
        } else {
          router.push("/")
          // Refresh the page to update navbar
          window.location.reload()
        }
      }, 1000)

    } catch (error) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (!isBackendReady()) {
      setError("Registration is temporarily unavailable")
      setIsLoading(false)
      return
    }

    // Validation
    if (signupData.password !== signupData.confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (signupData.password.length < 6) {
      setError("Password must be at least 6 characters long")
      setIsLoading(false)
      return
    }

    if (!signupData.isSujhavStudent) {
      setError("Please select whether you are a SUJHAV Institute student")
      setIsLoading(false)
      return
    }

    if (signupData.isSujhavStudent === "yes" && !signupData.studentClass) {
      setError("Please select your class")
      setIsLoading(false)
      return
    }

    if (
      signupData.isSujhavStudent === "yes" &&
      (signupData.studentClass === "11" || signupData.studentClass === "12") &&
      !signupData.stream
    ) {
      setError("Please select your stream")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...signupData,
          isSujhavStudent: signupData.isSujhavStudent === "yes",
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Signup failed")
      }

      setSuccess("Account created successfully! Please login to continue.")
      
      // Reset signup form
      setSignupData({
        email: "",
        password: "",
        confirmPassword: "",
        fullName: "",
        phone: "",
        isSujhavStudent: "",
        studentClass: "",
        stream: "",
      })

      // Switch to login tab after successful signup
      setTimeout(() => {
        const loginTab = document.querySelector('[data-value="login"]')
        if (loginTab) loginTab.click()
      }, 1500)

    } catch (error) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setLoginData({ email: "", password: "" })
    setSignupData({
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
      phone: "",
      isSujhavStudent: "",
      studentClass: "",
      stream: "",
    })
    setError("")
    setSuccess("")
    setShowPassword(false)
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-gray-900/95 backdrop-blur-xl border border-green-500/20 text-white">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent">
            Welcome to SUJHAV
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-800/50">
            <TabsTrigger value="login" className="data-[state=active]:bg-green-600 data-[state=active]:text-black">
              Login
            </TabsTrigger>
            <TabsTrigger value="signup" className="data-[state=active]:bg-green-600 data-[state=active]:text-black">
              Sign Up
            </TabsTrigger>
          </TabsList>

          {error && (
            <Alert className="border-red-500/20 bg-red-500/10">
              <AlertDescription className="text-red-400">{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-500/20 bg-green-500/10">
              <AlertDescription className="text-green-400">{success}</AlertDescription>
            </Alert>
          )}

          <TabsContent value="login" className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email" className="text-gray-300">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="Enter your email"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    className="pl-10 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-green-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password" className="text-gray-300">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    className="pr-10 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-green-500"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-black font-semibold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup" className="space-y-4">
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name" className="text-gray-300">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="Enter your full name"
                    value={signupData.fullName}
                    onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
                    className="pl-10 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-green-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-email" className="text-gray-300">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="Enter your email"
                    value={signupData.email}
                    onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                    className="pl-10 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-green-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-phone" className="text-gray-300">
                  Phone Number
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="signup-phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={signupData.phone}
                    onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })}
                    className="pl-10 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-green-500"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-gray-300 flex items-center">
                  <GraduationCap className="mr-2 h-4 w-4" />
                  Are you a SUJHAV Institute student?
                </Label>
                <RadioGroup
                  value={signupData.isSujhavStudent}
                  onValueChange={(value) =>
                    setSignupData({
                      ...signupData,
                      isSujhavStudent: value,
                      studentClass: "",
                      stream: "",
                    })
                  }
                  className="flex space-x-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="yes" className="border-green-500 text-green-500" />
                    <Label htmlFor="yes" className="text-gray-300">
                      Yes, I study at SUJHAV
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="no" className="border-green-500 text-green-500" />
                    <Label htmlFor="no" className="text-gray-300">
                      No
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {signupData.isSujhavStudent === "yes" && (
                <div className="space-y-4 p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                  <div className="space-y-2">
                    <Label htmlFor="class" className="text-gray-300">
                      Class
                    </Label>
                    <select
                      id="class"
                      value={signupData.studentClass}
                      onChange={(e) =>
                        setSignupData({
                          ...signupData,
                          studentClass: e.target.value,
                          stream: "",
                        })
                      }
                      className="w-full p-2 bg-gray-800/50 border border-gray-600 rounded-md text-white focus:border-green-500 focus:outline-none"
                      required
                    >
                      <option value="">Select your class</option>
                      <option value="4">Class 4</option>
                      <option value="5">Class 5</option>
                      <option value="6">Class 6</option>
                      <option value="7">Class 7</option>
                      <option value="8">Class 8</option>
                      <option value="9">Class 9</option>
                      <option value="10">Class 10</option>
                      <option value="11">Class 11</option>
                      <option value="12">Class 12</option>
                    </select>
                  </div>

                  {(signupData.studentClass === "11" || signupData.studentClass === "12") && (
                    <div className="space-y-2">
                      <Label htmlFor="stream" className="text-gray-300">
                        Stream
                      </Label>
                      <select
                        id="stream"
                        value={signupData.stream}
                        onChange={(e) => setSignupData({ ...signupData, stream: e.target.value })}
                        className="w-full p-2 bg-gray-800/50 border border-gray-600 rounded-md text-white focus:border-green-500 focus:outline-none"
                        required
                      >
                        <option value="">Select your stream</option>
                        <option value="science">Science</option>
                        <option value="commerce">Commerce</option>
                        <option value="arts">Arts</option>
                      </select>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="signup-password" className="text-gray-300">
                  Password
                </Label>
                <Input
                  id="signup-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={signupData.password}
                  onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                  className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-green-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-gray-300">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={signupData.confirmPassword}
                    onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                    className="pr-10 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-green-500"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-black font-semibold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
