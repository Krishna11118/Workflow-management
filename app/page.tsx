"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import toast, { Toaster } from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate authentication
    setTimeout(() => {
      // Store user info in localStorage or sessionStorage based on remember me
      const storage = rememberMe ? localStorage : sessionStorage
      storage.setItem("user", JSON.stringify({ email }))

      toast.success("Login successful!")

      // Redirect to dashboard
      setTimeout(() => {
        router.push("/dashboard")
      }, 1000)

      setLoading(false)
    }, 1000)
  }

  return (
    <div className="relative min-h-screen flex flex-col md:flex-row overflow-hidden">
      <Toaster position="top-right" />

      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/background-img.png"
          alt="Background"
          fill
          className="object-cover bg-black bg-opacity-500"
          priority
        />
      </div>
      <div className="absolute inset-0 bg-black opacity-0 z-10"></div>


      {/* Left side - Branding and text */}
      <div className="relative z-10 w-full md:w-1/2 flex flex-col justify-center p-8 md:p-16 text-white">
        <div className="mb-12">
          <div className="w-48 h-48 relative mb-16">
            <Image
              src="/logo.png"
              alt="HighBridge Logo"
              width={400}
              height={300}
              className="object-contain"
            />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6">Building the Future...</h1>
          <p className="text-lg max-w-md">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua.
          </p>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="relative z-10 w-full md:w-1/2 flex justify-center items-center p-4 md:p-8">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">
          <div className="mb-8">
            <h2 className="text-lg font-bold uppercase">WELCOME BACK!</h2>
            <h1 className="text-2xl font-bold">Log In to your Account</h1>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Type here..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Type here..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <Label htmlFor="remember" className="text-sm">
                  Remember me
                </Label>
              </div>
              <Link href="#" className="text-sm text-blue-600 hover:underline">
                Forgot Password?
              </Link>
            </div>

            <Button type="submit" className="w-full bg-red-500 hover:bg-red-600 text-white" disabled={loading}>
              {loading ? "Logging in..." : "Log In"}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or</span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
                onClick={() => toast.error("Google login not implemented")}
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Log In with Google
              </Button>

              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
                onClick={() => toast.error("Facebook login not implemented")}
              >
                <svg className="h-5 w-5" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M9.19795 21.5H13.198V13.4901H16.8021L17.198 9.50977H13.198V7.5C13.198 6.94772 13.6457 6.5 14.198 6.5H17.198V2.5H14.198C11.4365 2.5 9.19795 4.73858 9.19795 7.5V9.50977H7.19795L6.80206 13.4901H9.19795V21.5Z" />
                </svg>
                Log In with Facebook
              </Button>

              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
                onClick={() => toast.error("Apple login not implemented")}
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16.7023 0C15.0734 0.0807 13.2299 1.13216 12.1651 2.5129C11.2057 3.77216 10.4909 5.56839 10.8432 7.31908C12.6247 7.39216 14.4486 6.30908 15.4966 4.92312C16.4461 3.65908 17.0954 1.86285 16.7023 0Z" />
                  <path d="M21.9431 8.1323C20.6475 6.4997 18.7853 5.56934 17.0039 5.56934C14.7232 5.56934 13.6585 6.64765 11.9178 6.64765C10.1363 6.64765 8.82446 5.56934 6.87633 5.56934C4.92821 5.56934 2.82373 6.86219 1.52807 9.04219C-0.385254 12.2684 -0.0737305 18.2741 3.05373 22.9237C3.88504 24.2366 5.0083 25.7591 6.46985 25.7784C7.77829 25.7977 8.24336 24.9664 10.1363 24.9471C12.0292 24.9278 12.4535 25.7977 13.7619 25.7784C15.2235 25.7591 16.3467 24.1073 17.178 22.7944C18.2021 21.1619 18.6264 19.5681 18.6672 19.4681C18.6264 19.4488 15.7699 18.2934 15.7291 14.7526C15.7291 11.7366 18.0146 10.3844 18.1369 10.3073C16.7878 8.32578 14.6833 8.09647 13.9685 8.09647C11.7285 8.09647 9.91696 9.37505 8.82446 9.37505C7.85317 9.37505 6.24504 8.1323 4.59821 8.1323" />
                </svg>
                Log In with Apple
              </Button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm">
              New User?{" "}
              <Link href="#" className="font-bold">
                SIGN UP HERE
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

