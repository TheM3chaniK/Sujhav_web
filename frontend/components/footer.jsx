"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-black to-gray-900 border-t border-green-500/20">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-green-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-green-400/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
            {/* Company Info */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="relative w-12 h-12">
                  <Image src="/logo.png" alt="SUJHAV Logo" fill className="object-contain" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-green-400">SUJHAV</h3>
                  <p className="text-sm text-gray-400">Coaching Institute</p>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Synchronise your Understanding, do Justice to your HardWork, and let others Admire your Victory.
              </p>
              <div className="flex space-x-4">
                <Link
                  href=""
                  size="sm"
                  variant="outline"
                  className="bg-white rounded-lg border-green-500/30 text-green-400 hover:bg-green-500/10 p-2"
                >
                  <Facebook className="h-4 w-4" />
                </Link>
                <Link
                  href="https://www.instagram.com/sujhav_institute?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                  size="sm"
                  className="bg-white rounded-lg border-green-500/30 text-green-400 hover:bg-green-500/10 p-2"
                >
                  <Instagram className="h-4 w-4" />
                </Link>
                <Link
                  href=""
                  size="sm"
                  className="border-green-500/30 text-green-400 bg-white rounded-lg hover:bg-green-500/10 p-2"
                >
                  <Linkedin className="h-4 w-4" />
                </Link>
                <Link
                  size="sm"
                  className="border-green-500/30 bg-white rounded-lg text-green-400 hover:bg-green-500/10 p-2"
                  href="https://www.youtube.com/@SUJHAV_INSTITUTE"
                >
                  <Youtube className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-green-400">Quick Links</h4>
              <div className="space-y-3">
                <Link href="/" className="block text-gray-400 hover:text-green-400 transition-colors duration-300">
                  Home
                </Link>
                <Link href="/about" className="block text-gray-400 hover:text-green-400 transition-colors duration-300">
                  About Us
                </Link>
                <Link
                  href="#services"
                  className="block text-gray-400 hover:text-green-400 transition-colors duration-300"
                >
                  What We Offer
                </Link>
                <Link
                  href="#founder"
                  className="block text-gray-400 hover:text-green-400 transition-colors duration-300"
                >
                  Founder
                </Link>
                <Link
                  href="#contact"
                  className="block text-gray-400 hover:text-green-400 transition-colors duration-300"
                >
                  Contact
                </Link>
                <Link
                  href="/gallery"
                  className="block text-gray-400 hover:text-green-400 transition-colors duration-300"
                >
                  Gallery
                </Link>
              </div>
            </div>

            {/* Services */}
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-green-400">Our Services</h4>
              <div className="space-y-3">
                <div className="text-gray-400 hover:text-green-400 transition-colors duration-300 cursor-pointer">
                  Class 4-10 All Subjects
                </div>
                <div className="text-gray-400 hover:text-green-400 transition-colors duration-300 cursor-pointer">
                  Class 11-12 Boards
                </div>
                <div className="text-gray-400 hover:text-green-400 transition-colors duration-300 cursor-pointer">
                  JEE Preparation
                </div>
                <div className="text-gray-400 hover:text-green-400 transition-colors duration-300 cursor-pointer">
                  NEET Preparation
                </div>
                <div className="text-gray-400 hover:text-green-400 transition-colors duration-300 cursor-pointer">
                  Career Guidance
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-green-400">Contact Info</h4>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-green-400" />
                  <div className="text-gray-400">
                    <div>7003091196</div>
                    <div>7439059335</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-green-400" />
                  <div className="text-gray-400">info@sujhav.co.in</div>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-green-400 mt-1" />
                  <div className="text-gray-400">
                    SUJHAV Coaching Institute
                    <br />
                    1/4 Gopal Ram Pathak Road, near Radhe Govind Weight Bridge, Liluah, Howrah - 711204.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      

        {/* Bottom Bar */}
        <div className="border-t border-green-500/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div className="text-gray-400 text-sm">
                © {new Date().getFullYear()} SUJHAV Coaching Institute. All rights reserved.
              </div>
              <div className="flex space-x-6 text-sm">
                <Link href="#" className="text-gray-400 hover:text-green-400 transition-colors duration-300">
                  Privacy Policy
                </Link>
                <Link href="#" className="text-gray-400 hover:text-green-400 transition-colors duration-300">
                  Terms of Service
                </Link>
                <Link href="#" className="text-gray-400 hover:text-green-400 transition-colors duration-300">
                  Cookie Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
