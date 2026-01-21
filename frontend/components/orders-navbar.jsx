"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Home, Store, LayoutDashboard, ShoppingCart, User, Settings, LogOut, Package, ChevronDown } from "lucide-react"

export default function OrdersNavbar() {
  const [user, setUser] = useState(null)
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    // Get user from localStorage
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)

        // Fetch cart count
        fetchCartCount(parsedUser.id)
      } catch (error) {
        console.error("Error parsing user data:", error)
        setUser(null)
      }
    }
  }, [])

  const fetchCartCount = async (userId) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/cart?userId=${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        const totalItems = data.items?.reduce((sum, item) => sum + item.quantity, 0) || 0
        setCartCount(totalItems)
      }
    } catch (error) {
      console.error("Error fetching cart count:", error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    window.location.href = "/"
  }

  const getInitials = (name) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-green-500/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="relative w-10 h-10">
              <Image src="/logo.png" alt="SUJHAV Logo" fill className="object-contain" sizes="40px" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-green-400">SUJHAV</span>
              <span className="text-xs text-gray-400 -mt-1">My Orders</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2 text-gray-300 hover:text-green-400 transition-colors">
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            <Link
              href="/store"
              className="flex items-center space-x-2 text-gray-300 hover:text-green-400 transition-colors relative"
            >
              <Store className="h-4 w-4" />
              <span>Store</span>
              {cartCount > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-green-500 text-black text-xs min-w-[1.25rem] h-5 flex items-center justify-center p-0">
                  {cartCount}
                </Badge>
              )}
            </Link>
            {user?.isSujhavStudent && (
              <Link
                href="/dashboard"
                className="flex items-center space-x-2 text-gray-300 hover:text-green-400 transition-colors"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            )}
            <Link href="/orders" className="flex items-center space-x-2 text-green-400 font-medium">
              <Package className="h-4 w-4" />
              <span>My Orders</span>
            </Link>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-3 hover:bg-white/10 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-green-500 flex items-center justify-center text-black font-semibold text-sm">
                      {getInitials(user.fullName || user.full_name)}
                    </div>
                    <div className="hidden sm:block text-left">
                      <div className="text-sm font-medium text-white">{user.fullName || user.full_name || "User"}</div>
                      <div className="text-xs text-gray-400">{user.email}</div>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-gray-900 border-gray-700">
                  <div className="px-3 py-2 border-b border-gray-700">
                    <p className="text-sm font-medium text-white">{user.fullName || user.full_name || "User"}</p>
                    <p className="text-xs text-gray-400">{user.email}</p>
                    {user.isSujhavStudent && (
                      <Badge className="mt-1 bg-green-500/20 text-green-400 border-green-500/30">SUJHAV Student</Badge>
                    )}
                  </div>

                  {user.isSujhavStudent && (
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="flex items-center space-x-2 cursor-pointer">
                        <LayoutDashboard className="h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center space-x-2 cursor-pointer">
                      <Settings className="h-4 w-4" />
                      <span>Profile Settings</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link href="/store" className="flex items-center space-x-2 cursor-pointer">
                      <ShoppingCart className="h-4 w-4" />
                      <span>SUJHAV Store</span>
                      {cartCount > 0 && <Badge className="ml-auto bg-green-500 text-black text-xs">{cartCount}</Badge>}
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="bg-gray-700" />

                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  className="text-gray-300 hover:text-green-400 hover:bg-white/10"
                  onClick={() => (window.location.href = "/")}
                >
                  <User className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
