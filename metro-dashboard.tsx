"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LoginScreen } from "./components/login-screen"
import { RegisterScreen } from "./components/register-screen"
import { OrganizerDashboard } from "./components/organizer-dashboard"
import { UserDashboard } from "./components/user-dashboard"
import { ResultsScreen } from "./components/results-screen"
import { Layout } from "./components/layout"

export default function MetroDashboard() {
  const [currentScreen, setCurrentScreen] = useState("home")

  const screens = [
    { id: "login", label: "🔐 Login Screen", component: LoginScreen },
    { id: "register", label: "📝 Register Screen", component: RegisterScreen },
    { id: "organizer", label: "📊 Organizer Dashboard", component: OrganizerDashboard },
    { id: "user", label: "📈 User Dashboard", component: UserDashboard },
    { id: "results", label: "📥 Results Screen", component: ResultsScreen },
  ]

  if (currentScreen !== "home") {
    const ScreenComponent = screens.find((s) => s.id === currentScreen)?.component
    if (ScreenComponent) {
      return (
        <div>
          <div className="fixed top-4 left-4 z-50">
            <Button
              onClick={() => setCurrentScreen("home")}
              className="bg-slate-800/80 hover:bg-slate-700 text-white border border-slate-600"
            >
              ← Back to Menu
            </Button>
          </div>
          <ScreenComponent />
        </div>
      )
    }
  }

  return (
    <Layout title="Metro System Dashboard - AFFN Powered">
      <div className="min-h-screen p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-4">
              Metro Flow Prediction System
            </h1>
            <p className="text-xl text-slate-300 mb-2">Powered by Adaptive Feature Fusion Networks (AFFN)</p>
            <p className="text-slate-400">Advanced passenger flow prediction with real-time analytics</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {screens.map((screen) => (
              <Card
                key={screen.id}
                className="bg-slate-800/50 border-slate-600 hover:border-cyan-500/50 transition-all duration-200 cursor-pointer group"
                onClick={() => setCurrentScreen(screen.id)}
              >
                <CardHeader>
                  <CardTitle className="text-lg text-white group-hover:text-cyan-400 transition-colors">
                    {screen.label}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-400 text-sm mb-4">
                    {screen.id === "login" &&
                      "Secure authentication for organizers and cloud users with metro-themed interface"}
                    {screen.id === "register" &&
                      "User registration with profile management and image upload capabilities"}
                    {screen.id === "organizer" &&
                      "Admin dashboard with dataset management, accuracy metrics, and system analytics"}
                    {screen.id === "user" && "Prediction interface with flow analytics and downloadable results"}
                    {screen.id === "results" && "Comprehensive results display with filtering and export options"}
                  </p>
                  <Button className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white">
                    View Screen
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

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
