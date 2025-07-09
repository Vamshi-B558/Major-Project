"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, User } from "lucide-react"
import { Layout } from "./layout"

interface RegisterScreenProps {
  onRegister?: (userData: any) => void
  onBackToLogin?: () => void
}

export function RegisterScreen({ onRegister, onBackToLogin }: RegisterScreenProps) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    mobile: "",
    address: "",
    dob: "",
    gender: "",
    pincode: "",
    profilePicture: null as File | null,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData((prev) => ({ ...prev, profilePicture: file }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Required fields
    if (!formData.username.trim()) newErrors.username = "Username is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    if (!formData.password) newErrors.password = "Password is required"
    if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm your password"
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    // Password validation
    if (formData.password && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    // Password confirmation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    // Username validation (check if already exists)
    const existingUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
    if (existingUsers.some((user: any) => user.username === formData.username)) {
      newErrors.username = "Username already exists"
    }

    // Email validation (check if already exists)
    if (existingUsers.some((user: any) => user.email === formData.email)) {
      newErrors.email = "Email already registered"
    }

    // Mobile validation (if provided)
    if (formData.mobile && !/^\d{10,15}$/.test(formData.mobile.replace(/\D/g, ""))) {
      newErrors.mobile = "Please enter a valid mobile number"
    }

    // PIN code validation (if provided)
    if (formData.pincode && !/^\d{5,6}$/.test(formData.pincode)) {
      newErrors.pincode = "Please enter a valid PIN code"
    }

    // Remove any gender validation since it's optional
    // The Select component will handle the empty state with placeholder

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (!validateForm()) {
      setIsLoading(false)
      return
    }

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    try {
      // Get existing users
      const existingUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")

      // Create new user object
      const newUser = {
        id: Date.now().toString(),
        username: formData.username,
        email: formData.email,
        password: formData.password, // In real app, this would be hashed
        firstName: formData.firstName,
        lastName: formData.lastName,
        fullName: `${formData.firstName} ${formData.lastName}`,
        mobile: formData.mobile,
        address: formData.address,
        dateOfBirth: formData.dob,
        gender: formData.gender,
        pinCode: formData.pincode,
        profilePicture: formData.profilePicture?.name || null,
        userType: "cloud_user",
        registeredAt: new Date().toISOString(),
        isActive: true,
      }

      // Add to existing users
      const updatedUsers = [...existingUsers, newUser]
      localStorage.setItem("registeredUsers", JSON.stringify(updatedUsers))

      // Also add to demo users for login
      const demoUsers = JSON.parse(localStorage.getItem("demoUsers") || "{}")
      demoUsers[formData.username] = {
        password: formData.password,
        type: "cloud_user",
        name: newUser.fullName,
        userData: newUser,
      }
      localStorage.setItem("demoUsers", JSON.stringify(demoUsers))

      setSuccess(true)

      // Auto-login the user
      const loginData = {
        username: formData.username,
        name: newUser.fullName,
        type: "cloud_user",
        loginTime: new Date().toISOString(),
        userData: newUser,
      }

      localStorage.setItem("currentUser", JSON.stringify(loginData))

      if (onRegister) {
        onRegister(loginData)
      }
    } catch (error) {
      setErrors({ general: "Registration failed. Please try again." })
    }

    setIsLoading(false)
  }

  if (success) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen p-4">
          <Card className="w-full max-w-md bg-slate-800/50 border-green-500/30 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-green-400 mb-4">Registration Successful!</h2>
              <p className="text-slate-300 mb-6">Welcome to Metro Flow Prediction System, {formData.firstName}!</p>
              <p className="text-slate-400 text-sm mb-6">
                You have been automatically logged in and can now access the prediction dashboard.
              </p>
              <Button
                onClick={() => window.location.reload()}
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
              >
                Go to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-4xl bg-slate-800/50 border-purple-500/30 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-purple-400">Cloud User Registration</CardTitle>
            <p className="text-slate-300">Join the Metro Flow Prediction System</p>
          </CardHeader>

          <CardContent className="space-y-6">
            {errors.general && (
              <div className="p-3 rounded-lg bg-red-600/20 border border-red-500/30 text-red-400 text-sm">
                {errors.general}
              </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-slate-300">
                  Username *
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Choose a username"
                  value={formData.username}
                  onChange={(e) => handleInputChange("username", e.target.value)}
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500"
                />
                {errors.username && <p className="text-red-400 text-sm">{errors.username}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500"
                />
                {errors.email && <p className="text-red-400 text-sm">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300">
                  Password *
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password (min 6 chars)"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500"
                />
                {errors.password && <p className="text-red-400 text-sm">{errors.password}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-slate-300">
                  Confirm Password *
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500"
                />
                {errors.confirmPassword && <p className="text-red-400 text-sm">{errors.confirmPassword}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-slate-300">
                  First Name *
                </Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="Enter your first name"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500"
                />
                {errors.firstName && <p className="text-red-400 text-sm">{errors.firstName}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-slate-300">
                  Last Name *
                </Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Enter your last name"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500"
                />
                {errors.lastName && <p className="text-red-400 text-sm">{errors.lastName}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobile" className="text-slate-300">
                  Mobile Number
                </Label>
                <Input
                  id="mobile"
                  type="tel"
                  placeholder="Enter mobile number"
                  value={formData.mobile}
                  onChange={(e) => handleInputChange("mobile", e.target.value)}
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500"
                />
                {errors.mobile && <p className="text-red-400 text-sm">{errors.mobile}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="dob" className="text-slate-300">
                  Date of Birth
                </Label>
                <Input
                  id="dob"
                  type="date"
                  value={formData.dob}
                  onChange={(e) => handleInputChange("dob", e.target.value)}
                  className="bg-slate-700/50 border-slate-600 text-white focus:border-purple-500"
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="address" className="text-slate-300">
                  Address
                </Label>
                <Input
                  id="address"
                  type="text"
                  placeholder="Enter your address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender" className="text-slate-300">
                  Gender
                </Label>
                <Select onValueChange={(value) => handleInputChange("gender", value)}>
                  <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white focus:border-purple-500">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    <SelectItem value="male" className="text-white hover:bg-slate-700">
                      Male
                    </SelectItem>
                    <SelectItem value="female" className="text-white hover:bg-slate-700">
                      Female
                    </SelectItem>
                    <SelectItem value="other" className="text-white hover:bg-slate-700">
                      Other
                    </SelectItem>
                    <SelectItem value="prefer-not-to-say" className="text-white hover:bg-slate-700">
                      Prefer not to say
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pincode" className="text-slate-300">
                  PIN Code
                </Label>
                <Input
                  id="pincode"
                  type="text"
                  placeholder="Enter PIN code"
                  value={formData.pincode}
                  onChange={(e) => handleInputChange("pincode", e.target.value)}
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500"
                />
                {errors.pincode && <p className="text-red-400 text-sm">{errors.pincode}</p>}
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="profile-picture" className="text-slate-300">
                  Profile Picture
                </Label>
                <div className="relative">
                  <Input
                    id="profile-picture"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="bg-slate-700/50 border-slate-600 text-white file:bg-purple-600 file:text-white file:border-0 file:rounded-md file:px-3 file:py-1 file:mr-3 focus:border-purple-500"
                  />
                  <Upload className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="md:col-span-2 pt-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating Account...
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </div>
            </form>

            <div className="text-center">
              <p className="text-slate-400 text-sm">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={onBackToLogin}
                  className="text-purple-400 hover:text-purple-300 underline"
                >
                  Login here
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
