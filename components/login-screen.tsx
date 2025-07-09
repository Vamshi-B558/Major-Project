"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Train, User, Shield } from "lucide-react"
import { Layout } from "./layout"

// Demo user credentials - Initialize with more users and store in localStorage
const initializeDemoUsers = () => {
  const demoUsers = {
    admin_organizer: { password: "metro123", type: "organizer", name: "Admin Organizer" },
    demo_user: { password: "metro123", type: "cloud_user", name: "Demo User" },
    organizer1: { password: "admin123", type: "organizer", name: "Organizer One" },
    user1: { password: "user123", type: "cloud_user", name: "User One" },
    testuser: { password: "test123", type: "cloud_user", name: "Test User" },
    admin: { password: "admin", type: "organizer", name: "System Admin" },
    user: { password: "user", type: "cloud_user", name: "Test User" },
  }

  // Store in localStorage for persistence
  localStorage.setItem("demoUsers", JSON.stringify(demoUsers))
  return demoUsers
}

// Get demo users from localStorage or initialize
const getDemoUsers = () => {
  const stored = localStorage.getItem("demoUsers")
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch (error) {
      console.error("Error parsing demo users:", error)
    }
  }
  return initializeDemoUsers()
}

interface LoginScreenProps {
  onLogin?: (userType: string, userData: any) => void
  initialUserType?: "organizer" | "cloud_user"
}

export function LoginScreen({ onLogin, initialUserType }: LoginScreenProps) {
  const [userType, setUserType] = useState<"organizer" | "cloud_user">(initialUserType || "organizer")
  const [credentials, setCredentials] = useState({ username: "", password: "" })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Set initial user type if provided via props
  useEffect(() => {
    if (initialUserType) {
      setUserType(initialUserType)
    }
  }, [initialUserType])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Simulate loading delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const { username, password } = credentials

    // Get demo users (initialize if needed)
    const demoUsers = getDemoUsers()

    // Also check registered users from registration
    const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")

    // Find user in demo users first
    let user = demoUsers[username as keyof typeof demoUsers]

    // If not found in demo users, check registered users
    if (!user) {
      const registeredUser = registeredUsers.find((u: any) => u.username === username)
      if (registeredUser) {
        user = {
          password: registeredUser.password,
          type: registeredUser.userType,
          name: registeredUser.fullName,
          userData: registeredUser,
        }
      }
    }

    // Add debug logging for organizer login
    console.log("Login attempt:", { username, userType, foundUser: !!user })

    if (!user) {
      setError("Username not found. Try: admin_organizer, demo_user, admin, or user")
      setIsLoading(false)
      return
    }

    if (user.password !== password) {
      setError("Invalid password")
      setIsLoading(false)
      return
    }

    if (user.type !== userType) {
      setError(`User type mismatch. This user is a ${user.type === "organizer" ? "Organizer" : "Cloud User"}`)
      setIsLoading(false)
      return
    }

    // Success - store user data and redirect
    const userData = {
      username,
      name: user.name,
      type: user.type,
      loginTime: new Date().toISOString(),
      userData: user.userData || null,
    }

    localStorage.setItem("currentUser", JSON.stringify(userData))

    if (onLogin) {
      onLogin(user.type, userData)
    }

    setIsLoading(false)
  }

  return (
    <Layout>
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md bg-slate-800/50 border-cyan-500/30 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center">
              <Train className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-cyan-400">Metro Flow Dashboard</CardTitle>
            <p className="text-slate-300">Login as Organizer or Cloud User</p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* User Type Selection */}
            <div className="flex space-x-2">
              <Button
                type="button"
                variant={userType === "organizer" ? "default" : "outline"}
                onClick={() => setUserType("organizer")}
                className={`flex-1 ${
                  userType === "organizer"
                    ? "bg-cyan-600 hover:bg-cyan-700 text-white"
                    : "border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10"
                }`}
              >
                <Shield className="w-4 h-4 mr-2" />
                Organizer
              </Button>
              <Button
                type="button"
                variant={userType === "cloud_user" ? "default" : "outline"}
                onClick={() => setUserType("cloud_user")}
                className={`flex-1 ${
                  userType === "cloud_user"
                    ? "bg-purple-600 hover:bg-purple-700 text-white"
                    : "border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
                }`}
              >
                <User className="w-4 h-4 mr-2" />
                Cloud User
              </Button>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-slate-300">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={credentials.username}
                  onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-cyan-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-cyan-500"
                  required
                />
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-600/20 border border-red-500/30 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className={`w-full ${
                  userType === "organizer"
                    ? "bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800"
                    : "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                } text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 shadow-lg disabled:opacity-50`}
              >
                {isLoading ? "Logging in..." : `Login as ${userType === "organizer" ? "Organizer" : "Cloud User"}`}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="bg-slate-700/30 p-4 rounded-lg">
              <h4 className="text-slate-300 font-semibold mb-2">Demo Credentials:</h4>
              <div className="text-xs text-slate-400 space-y-1">
                {userType === "organizer" ? (
                  <div className="space-y-1">
                    <div>
                      <strong className="text-cyan-400">Organizer 1:</strong> admin_organizer / metro123
                    </div>
                    <div>
                      <strong className="text-cyan-400">Organizer 2:</strong> admin / admin
                    </div>
                    <div>
                      <strong className="text-cyan-400">Organizer 3:</strong> organizer1 / admin123
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div>
                      <strong className="text-purple-400">Cloud User 1:</strong> demo_user / metro123
                    </div>
                    <div>
                      <strong className="text-purple-400">Cloud User 2:</strong> user / user
                    </div>
                    <div>
                      <strong className="text-purple-400">Cloud User 3:</strong> user1 / user123
                    </div>
                  </div>
                )}
              </div>
            </div>

            {userType === "cloud_user" && (
              <div className="text-center">
                <p className="text-slate-400 text-sm">
                  Don't have an account?{" "}
                  <a href="/register" className="text-purple-400 hover:text-purple-300 underline">
                    Register here
                  </a>
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
