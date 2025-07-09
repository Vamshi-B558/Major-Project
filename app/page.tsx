"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LoginScreen } from "@/components/login-screen"
import { RegisterScreen } from "@/components/register-screen"
import { OrganizerDashboard } from "@/components/organizer-dashboard"
import { UserDashboard } from "@/components/user-dashboard"
import { ResultsScreen } from "@/components/results-screen"
import { Layout } from "@/components/layout"
import { Shield, User, UserPlus } from "lucide-react"

export default function Page() {
  const [currentScreen, setCurrentScreen] = useState("home")
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check for existing login on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser")
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        setCurrentUser(userData)
        // Auto-redirect to appropriate dashboard
        if (userData.type === "organizer") {
          setCurrentScreen("organizer")
        } else {
          setCurrentScreen("user")
        }
      } catch (error) {
        localStorage.removeItem("currentUser")
      }
    }
    setIsLoading(false)
  }, [])

  const handleLogin = (userType: string, userData: any) => {
    setCurrentUser(userData)
    // Redirect to appropriate dashboard
    if (userType === "organizer") {
      setCurrentScreen("organizer")
    } else {
      setCurrentScreen("user")
    }
  }

  const handleRegister = (userData: any) => {
    setCurrentUser(userData)
    setCurrentScreen("user") // Always redirect to user dashboard for new registrations
  }

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    setCurrentUser(null)
    setCurrentScreen("home")
  }

  const screens = [
    { id: "login", label: "🔐 Login", component: LoginScreen, userType: "both", icon: User },
    { id: "register", label: "📝 Register", component: RegisterScreen, userType: "cloud_user", icon: UserPlus },
    { id: "organizer", label: "📊 Organizer Dashboard", component: OrganizerDashboard, userType: "organizer" },
    { id: "user", label: "📈 User Dashboard", component: UserDashboard, userType: "cloud_user" },
    { id: "results", label: "📥 Results Screen", component: ResultsScreen, userType: "both" },
  ]

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
            <p className="text-slate-300">Loading...</p>
          </div>
        </div>
      </Layout>
    )
  }

  if (currentScreen === "login") {
    return <LoginScreen onLogin={handleLogin} />
  }

  if (currentScreen === "register") {
    return <RegisterScreen onRegister={handleRegister} onBackToLogin={() => setCurrentScreen("login")} />
  }

  if (currentScreen !== "home") {
    const ScreenComponent = screens.find((s) => s.id === currentScreen)?.component
    if (ScreenComponent) {
      return (
        <div>
          <div className="fixed top-4 left-4 z-50 flex space-x-2">
            <Button
              onClick={() => setCurrentScreen("home")}
              className="bg-slate-800/80 hover:bg-slate-700 text-white border border-slate-600"
            >
              ← Back to Menu
            </Button>
            {currentUser && (
              <Button
                onClick={handleLogout}
                className="bg-red-600/80 hover:bg-red-700 text-white border border-red-500"
              >
                Logout ({currentUser.name})
              </Button>
            )}
          </div>
          <ScreenComponent currentUser={currentUser} />
        </div>
      )
    }
  }

  return (
    <Layout title="Metro System Dashboard - AFFN Powered">
      <div className="min-h-screen p-6">
        <div className="max-w-6xl mx-auto">
          {/* User Info Bar */}
          {currentUser && (
            <div className="mb-6 flex justify-between items-center bg-slate-800/50 p-4 rounded-lg border border-slate-600">
              <div className="text-white">
                Welcome back, <span className="font-semibold text-cyan-400">{currentUser.name}</span>
                <span className="text-slate-400 ml-2">
                  ({currentUser.type === "organizer" ? "Organizer" : "Cloud User"})
                </span>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="border-red-500/50 text-red-400 hover:bg-red-500/10"
              >
                Logout
              </Button>
            </div>
          )}

          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-4">
              Metro Flow Prediction System
            </h1>
            <p className="text-xl text-slate-300 mb-2">Powered by Adaptive Feature Fusion Networks (AFFN)</p>
            <p className="text-slate-400">Advanced passenger flow prediction with real-time analytics</p>
          </div>

          {/* Show different options based on login status */}
          {!currentUser ? (
            // Not logged in - show login/register options
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card
                className="bg-slate-800/50 border-cyan-500/50 hover:border-cyan-400 transition-all duration-200 cursor-pointer group"
                onClick={() => setCurrentScreen("login")}
              >
                <CardHeader>
                  <CardTitle className="text-lg text-white group-hover:text-cyan-400 transition-colors flex items-center">
                    <Shield className="w-5 h-5 mr-2" />🔐 Organizer Login
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-400 text-sm mb-4">
                    Access the admin dashboard with dataset management, accuracy metrics, and system analytics
                  </p>
                  <Button className="w-full bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white">
                    Login as Organizer
                  </Button>
                </CardContent>
              </Card>

              <Card
                className="bg-slate-800/50 border-purple-500/50 hover:border-purple-400 transition-all duration-200 cursor-pointer group"
                onClick={() => setCurrentScreen("login")}
              >
                <CardHeader>
                  <CardTitle className="text-lg text-white group-hover:text-purple-400 transition-colors flex items-center">
                    <User className="w-5 h-5 mr-2" />🔐 Cloud User Login
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-400 text-sm mb-4">
                    Access the prediction interface with flow analytics and downloadable results
                  </p>
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white">
                    Login as Cloud User
                  </Button>
                </CardContent>
              </Card>

              <Card
                className="bg-slate-800/50 border-green-500/50 hover:border-green-400 transition-all duration-200 cursor-pointer group"
                onClick={() => setCurrentScreen("register")}
              >
                <CardHeader>
                  <CardTitle className="text-lg text-white group-hover:text-green-400 transition-colors flex items-center">
                    <UserPlus className="w-5 h-5 mr-2" />📝 New User Registration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-400 text-sm mb-4">
                    Join the system with profile management and prediction capabilities
                  </p>
                  <Button className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white">
                    Register Now
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            // Logged in - show dashboard options based on user type
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Show appropriate dashboard based on user type */}
              {currentUser.type === "organizer" ? (
                // Organizer options
                <>
                  <Card
                    className="bg-slate-800/50 border-cyan-500/50 hover:border-cyan-400 transition-all duration-200 cursor-pointer group"
                    onClick={() => setCurrentScreen("organizer")}
                  >
                    <CardHeader>
                      <CardTitle className="text-lg text-white group-hover:text-cyan-400 transition-colors">
                        📊 Organizer Dashboard
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-400 text-sm mb-4">
                        Access dataset management, accuracy metrics, and system analytics
                      </p>
                      <Button className="w-full bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white">
                        Go to Dashboard
                      </Button>
                    </CardContent>
                  </Card>

                  <Card
                    className="bg-slate-800/50 border-purple-500/50 hover:border-purple-400 transition-all duration-200 cursor-pointer group"
                    onClick={() => setCurrentScreen("results")}
                  >
                    <CardHeader>
                      <CardTitle className="text-lg text-white group-hover:text-purple-400 transition-colors">
                        📥 View Results
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-400 text-sm mb-4">
                        View comprehensive prediction results with filtering and export options
                      </p>
                      <Button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white">
                        View Results
                      </Button>
                    </CardContent>
                  </Card>
                </>
              ) : (
                // Cloud User options
                <>
                  <Card
                    className="bg-slate-800/50 border-purple-500/50 hover:border-purple-400 transition-all duration-200 cursor-pointer group"
                    onClick={() => setCurrentScreen("user")}
                  >
                    <CardHeader>
                      <CardTitle className="text-lg text-white group-hover:text-purple-400 transition-colors">
                        📈 User Dashboard
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-400 text-sm mb-4">
                        Access prediction interface with flow analytics and user profile
                      </p>
                      <Button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white">
                        Go to Dashboard
                      </Button>
                    </CardContent>
                  </Card>

                  <Card
                    className="bg-slate-800/50 border-cyan-500/50 hover:border-cyan-400 transition-all duration-200 cursor-pointer group"
                    onClick={() => setCurrentScreen("results")}
                  >
                    <CardHeader>
                      <CardTitle className="text-lg text-white group-hover:text-cyan-400 transition-colors">
                        📥 View Results
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-400 text-sm mb-4">
                        View your prediction results with filtering and export options
                      </p>
                      <Button className="w-full bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white">
                        View Results
                      </Button>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          )}

          <div className="mt-12 text-center">
            <Card className="bg-slate-800/30 border-slate-600">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-cyan-400 mb-4">System Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
                  <div>
                    <h3 className="text-purple-400 font-semibold mb-2">🔐 Authentication</h3>
                    <p className="text-slate-400 text-sm">Secure login for organizers and cloud users</p>
                  </div>
                  <div>
                    <h3 className="text-cyan-400 font-semibold mb-2">📊 Analytics</h3>
                    <p className="text-slate-400 text-sm">Real-time passenger flow visualization</p>
                  </div>
                  <div>
                    <h3 className="text-green-400 font-semibold mb-2">🤖 AI Prediction</h3>
                    <p className="text-slate-400 text-sm">AFFN-powered flow prediction</p>
                  </div>
                  <div>
                    <h3 className="text-yellow-400 font-semibold mb-2">📈 Reporting</h3>
                    <p className="text-slate-400 text-sm">Comprehensive data export and analysis</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  )
}
