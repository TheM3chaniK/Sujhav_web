"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X, User, LogOut, Settings } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import LoginModal from "./login-modal"

export default function Navbar() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [user, setUser] = useState(null)

  const navItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Gallery", href: "/gallery" },
    { name: "Store", href: "/store" },
    { name: "Contact", href: "/#contact" },
  ]

  useEffect(() => {
    // Check for user in localStorage on component mount
    const userData = localStorage.getItem("user")
    if (userData) {
      try {
        setUser(JSON.parse(userData))
      } catch (error) {
        console.error("Error parsing user data:", error)
        localStorage.removeItem("user")
        localStorage.removeItem("token")
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

  const handleDashboardClick = () => {
    if (user?.isSujhavStudent) {
      router.push("/dashboard")
    } else {
      // This shouldn't happen if UI is correct, but just in case
      router.push("/")
    }
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-xl border-b border-green-500/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="relative w-10 h-10">
                <Image src="/logo.png" alt="SUJHAV Logo" fill className="object-contain" sizes="40px" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent">
                SUJHAV
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-300 hover:text-green-400 transition-colors duration-300 font-medium"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <>
                  {/* Dashboard Button - Only show for SUJHAV students */}
                  {user.isSujhavStudent && (
                    <Button
                      onClick={handleDashboardClick}
                      className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-black font-semibold"
                    >
                      Dashboard
                    </Button>
                  )}

                  {/* User Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="border-green-500/30 text-green-400 hover:bg-green-500/10 hover:border-green-400 bg-transparent"
                      >
                        <User className="mr-2 h-4 w-4" />
                        {user.fullName?.split(" ")[0] || "User"}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 bg-gray-900/95 backdrop-blur-xl border border-green-500/20">
                      <div className="px-2 py-1.5 text-sm text-gray-400">
                        <div className="font-medium text-green-400">{user.fullName}</div>
                        <div className="text-xs">{user.email}</div>
                        {user.isSujhavStudent && (
                          <div className="text-xs text-green-300">
                            SUJHAV Student {user.class && `- Class ${user.class}`}
                          </div>
                        )}
                      </div>
                      <DropdownMenuSeparator className="bg-green-500/20" />
                      {user.isSujhavStudent && (
                        <>
                          <DropdownMenuItem
                            onClick={handleDashboardClick}
                            className="text-gray-300 hover:text-green-400 hover:bg-green-500/10 cursor-pointer"
                          >
                            <Settings className="mr-2 h-4 w-4" />
                            Dashboard
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-green-500/20" />
                        </>
                      )}
                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <Button
                  onClick={() => setShowLoginModal(true)}
                  variant="outline"
                  className="border-green-500/30 text-green-400 hover:bg-green-500/10 hover:border-green-400 bg-transparent"
                >
                  <User className="mr-2 h-4 w-4" />
                  Login
                </Button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-300 hover:text-green-400"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 bg-black/95 backdrop-blur-xl border-t border-green-500/20">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block px-3 py-2 text-gray-300 hover:text-green-400 transition-colors duration-300 font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                
                <div className="pt-4 space-y-2">
                  {user ? (
                    <>
                      <div className="px-3 py-2 text-sm text-gray-400 border-b border-green-500/20">
                        <div className="font-medium text-green-400">{user.fullName}</div>
                        <div className="text-xs">{user.email}</div>
                        {user.isSujhavStudent && (
                          <div className="text-xs text-green-300">
                            SUJHAV Student {user.class && `- Class ${user.class}`}
                          </div>
                        )}
                      </div>
                      
                      {user.isSujhavStudent && (
                        <Button
                          onClick={() => {
                            handleDashboardClick()
                            setIsOpen(false)
                          }}
                          className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-black font-semibold"
                        >
                          Dashboard
                        </Button>
                      )}
                      
                      <Button
                        onClick={() => {
                          handleLogout()
                          setIsOpen(false)
                        }}
                        variant="outline"
                        className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-400 bg-transparent"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={() => {
                        setShowLoginModal(true)
                        setIsOpen(false)
                      }}
                      variant="outline"
                      className="w-full border-green-500/30 text-green-400 hover:bg-green-500/10 hover:border-green-400 bg-transparent"
                    >
                      <User className="mr-2 h-4 w-4" />
                      Login
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </>
  )
}
