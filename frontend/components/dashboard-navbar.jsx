"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, LogOut, Store, Home, LayoutDashboard } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"


export default function DashboardNavbar() {
  const router = useRouter()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if(userData) {
      try {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
      } catch (error) {
        console.error("user not found");
        setUser(null)
      }
    }
  }, [])

  const handleLogout = async () => {
    try {
      // Call logout API
      await fetch("/api/auth/signout", {
        method: "POST",
        credentials: "include",
      })
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      // Clear local storage and state
      localStorage.removeItem("user")
      localStorage.removeItem("token")
      setUser(null)
      
      // Redirect to home
      router.push("/")
    }
  }

  return (
    <nav className="fixed top-0 z-50 w-full bg-black/95 backdrop-blur-md border-b border-green-500/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="relative w-10 h-10 transform hover:scale-110 transition-transform duration-300">
              <Image src="/logo.png" alt="SUJHAV Logo" fill className="object-contain" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-green-400">SUJHAV</h1>
              <p className="text-xs text-gray-400">Dashboard</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="flex items-center space-x-2 text-gray-300 hover:text-green-400 px-3 py-2 text-sm font-medium transition-colors duration-300 hover:bg-green-500/10 rounded-lg"
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            <Link
              href="/store"
              className="flex items-center space-x-2 text-gray-300 hover:text-green-400 px-3 py-2 text-sm font-medium transition-colors duration-300 hover:bg-green-500/10 rounded-lg"
            >
              <Store className="h-4 w-4" />
              <span>Store</span>
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center space-x-2 text-green-400 px-3 py-2 text-sm font-medium bg-green-500/10 rounded-lg"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
          </div>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-green-500/30 hover:border-green-400/50 transition-colors">
                  <Image
                    src={user?.avatar || "/placeholder.svg"}
                    alt={user?.name || "User"}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-black/90 backdrop-blur-xl border border-green-500/20 text-white">
              <div className="flex items-center space-x-2 p-2">
                <div className="relative w-8 h-8 rounded-full overflow-hidden">
                  <Image
                    src={user?.avatar || "/placeholder.svg"}
                    alt={user?.name || "User"}
                    fill
                    className="object-cover"
                    sizes="32px"
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium text-green-400">{user?.fullName}</p>
                  <p className="text-xs text-gray-400">{user?.email}</p>
                </div>
              </div>
              <DropdownMenuSeparator className="bg-green-500/20" />
              <DropdownMenuItem className="text-gray-300 hover:text-green-400 hover:bg-green-500/10">
              <Link href="/profile" className="flex">
                <User className="mr-2 h-4 w-4" />
                Profile Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-gray-300 hover:text-green-400 hover:bg-green-500/10">
                <Link href="/store" className="flex items-center w-full">
                  <Store className="mr-2 h-4 w-4" />
                  SUJHAV Store
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-green-500/20" />
              <DropdownMenuItem onClick={handleLogout} className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
                <LogOut className="mr-2 h-4 w-4" />
                LogOut
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  )
}
