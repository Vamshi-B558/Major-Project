"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { User, TrendingUp, Download, Search, LogOut } from "lucide-react"
import { Layout } from "./layout"

const flowData = [
  { name: "High Flow", value: 35, color: "#EF4444" },
  { name: "Medium Flow", value: 45, color: "#F59E0B" },
  { name: "Low Flow", value: 20, color: "#10B981" },
]

const stationData = [
  { station: "Central", flow: 4200 },
  { station: "North", flow: 3100 },
  { station: "South", flow: 2800 },
  { station: "East", flow: 3500 },
  { station: "West", flow: 2200 },
]

export function UserDashboard() {
  const [activeSection, setActiveSection] = useState("predict")
  const [predictionForm, setPredictionForm] = useState({
    fid: "",
    tripId: "",
    metroName: "",
    city: "",
    source: "",
    destination: "",
    date: "",
    time: "",
    boardings: "",
  })

  const [predictionResult, setPredictionResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showResult, setShowResult] = useState(false)

  const sidebarItems = [
    { id: "predict", label: "Predict Flow", icon: TrendingUp },
    { id: "profile", label: "View Profile", icon: User },
    { id: "results", label: "Download Results", icon: Download },
    { id: "analytics", label: "Flow Analytics", icon: Search },
  ]

  const handleInputChange = (field: string, value: string) => {
    setPredictionForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setShowResult(false)

    // Validate required fields
    const requiredFields = ["fid", "tripId", "metroName", "city", "source", "destination", "date", "time", "boardings"]
    const missingFields = requiredFields.filter((field) => !predictionForm[field])

    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(", ")}`)
      setIsLoading(false)
      return
    }

    // Simulate AFFN prediction processing
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Generate realistic prediction based on input
    const boardings = Number.parseInt(predictionForm.boardings)
    const hour = Number.parseInt(predictionForm.time.split(":")[0])

    // Peak hour multiplier
    let multiplier = 1
    if ((hour >= 7 && hour <= 10) || (hour >= 17 && hour <= 20)) {
      multiplier = 1.5 // Peak hours
    } else if (hour >= 11 && hour <= 16) {
      multiplier = 0.8 // Off-peak
    } else {
      multiplier = 0.6 // Late night/early morning
    }

    const basePrediction = boardings * multiplier * (Math.random() * 0.4 + 0.8) // ±20% variation
    const predictedFlow = Math.round(basePrediction)

    let flowType = "Low"
    if (predictedFlow > 400) flowType = "High"
    else if (predictedFlow > 200) flowType = "Medium"

    const accuracy = 85 + Math.random() * 10 // 85-95% accuracy

    const result = {
      fid: predictionForm.fid,
      tripId: predictionForm.tripId,
      route: `${predictionForm.source} → ${predictionForm.destination}`,
      predictedFlow,
      flowType,
      accuracy: accuracy.toFixed(1),
      timestamp: new Date().toLocaleString(),
      processingTime: "3.2 seconds",
      modelUsed: "AFFN v2.1",
      confidence: (accuracy / 100).toFixed(2),
    }

    setPredictionResult(result)
    setIsLoading(false)
    setShowResult(true)
  }

  return (
    <Layout title="Metro Flow Dashboard - Cloud User">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-slate-800/50 border-r border-purple-500/20 backdrop-blur-sm">
          <div className="p-4">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Cloud User</h2>
                <p className="text-sm text-slate-400">Prediction Portal</p>
              </div>
            </div>

            <nav className="space-y-2">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    activeSection === item.id
                      ? "bg-purple-600/20 text-purple-400 border border-purple-500/30"
                      : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="absolute bottom-4 left-4 right-4">
            <Button variant="outline" className="w-full border-red-500/50 text-red-400 hover:bg-red-500/10">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            {activeSection === "predict" && (
              <div className="space-y-6">
                <Card className="bg-slate-800/50 border-purple-500/30">
                  <CardHeader>
                    <CardTitle className="text-purple-400">Passenger Flow Prediction</CardTitle>
                    <p className="text-slate-400">Enter trip details to predict passenger flow using AFFN</p>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fid" className="text-slate-300">
                          FID
                        </Label>
                        <div className="flex space-x-2">
                          <Input
                            id="fid"
                            placeholder="Enter FID (e.g., F001)"
                            value={predictionForm.fid}
                            onChange={(e) => handleInputChange("fid", e.target.value)}
                            className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500"
                          />
                          <Button
                            type="button"
                            onClick={() => {
                              const randomFid = `F${String(Math.floor(Math.random() * 999) + 1).padStart(3, "0")}`
                              handleInputChange("fid", randomFid)
                            }}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-3"
                          >
                            Auto
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="tripId" className="text-slate-300">
                          Trip ID
                        </Label>
                        <div className="flex space-x-2">
                          <Input
                            id="tripId"
                            placeholder="Enter Trip ID (e.g., T001)"
                            value={predictionForm.tripId}
                            onChange={(e) => handleInputChange("tripId", e.target.value)}
                            className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500"
                          />
                          <Button
                            type="button"
                            onClick={() => {
                              const randomTripId = `T${String(Math.floor(Math.random() * 999) + 1).padStart(3, "0")}`
                              handleInputChange("tripId", randomTripId)
                            }}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-3"
                          >
                            Auto
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="metroName" className="text-slate-300">
                          Metro Name
                        </Label>
                        <Select onValueChange={(value) => handleInputChange("metroName", value)}>
                          <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white focus:border-purple-500">
                            <SelectValue placeholder="Select Metro" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-slate-600">
                            <SelectItem value="hyderabad-metro" className="text-white hover:bg-slate-700">
                              Hyderabad Metro
                            </SelectItem>
                            <SelectItem value="delhi-metro" className="text-white hover:bg-slate-700">
                              Delhi Metro
                            </SelectItem>
                            <SelectItem value="mumbai-metro" className="text-white hover:bg-slate-700">
                              Mumbai Metro
                            </SelectItem>
                            <SelectItem value="bangalore-metro" className="text-white hover:bg-slate-700">
                              Bangalore Metro
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="city" className="text-slate-300">
                          City
                        </Label>
                        <Select onValueChange={(value) => handleInputChange("city", value)}>
                          <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white focus:border-purple-500">
                            <SelectValue placeholder="Select City" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-slate-600">
                            <SelectItem value="delhi" className="text-white hover:bg-slate-700">
                              Delhi
                            </SelectItem>
                            <SelectItem value="mumbai" className="text-white hover:bg-slate-700">
                              Mumbai
                            </SelectItem>
                            <SelectItem value="bangalore" className="text-white hover:bg-slate-700">
                              Bangalore
                            </SelectItem>
                            <SelectItem value="hyderabad" className="text-white hover:bg-slate-700">
                              Hyderabad
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="source" className="text-slate-300">
                          Source Station
                        </Label>
                        <Select onValueChange={(value) => handleInputChange("source", value)}>
                          <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white focus:border-purple-500">
                            <SelectValue placeholder="Select source station" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-slate-600">
                            <SelectItem value="secunderabad" className="text-white hover:bg-slate-700">
                              Secunderabad
                            </SelectItem>
                            <SelectItem value="paradise" className="text-white hover:bg-slate-700">
                              Paradise
                            </SelectItem>
                            <SelectItem value="rasoolpura" className="text-white hover:bg-slate-700">
                              Rasoolpura
                            </SelectItem>
                            <SelectItem value="prakash-nagar" className="text-white hover:bg-slate-700">
                              Prakash Nagar
                            </SelectItem>
                            <SelectItem value="begumpet" className="text-white hover:bg-slate-700">
                              Begumpet
                            </SelectItem>
                            <SelectItem value="mathura-nagar" className="text-white hover:bg-slate-700">
                              Mathura Nagar
                            </SelectItem>
                            <SelectItem value="lakdi-ka-pul" className="text-white hover:bg-slate-700">
                              Lakdi Ka Pul
                            </SelectItem>
                            <SelectItem value="assembly" className="text-white hover:bg-slate-700">
                              Assembly
                            </SelectItem>
                            <SelectItem value="nampally" className="text-white hover:bg-slate-700">
                              Nampally
                            </SelectItem>
                            <SelectItem value="gandhi-bhavan" className="text-white hover:bg-slate-700">
                              Gandhi Bhavan
                            </SelectItem>
                            <SelectItem value="osmania-medical" className="text-white hover:bg-slate-700">
                              Osmania Medical
                            </SelectItem>
                            <SelectItem value="mg-bus-station" className="text-white hover:bg-slate-700">
                              MG Bus Station
                            </SelectItem>
                            <SelectItem value="malakpet" className="text-white hover:bg-slate-700">
                              Malakpet
                            </SelectItem>
                            <SelectItem value="new-market" className="text-white hover:bg-slate-700">
                              New Market
                            </SelectItem>
                            <SelectItem value="musarambagh" className="text-white hover:bg-slate-700">
                              Musarambagh
                            </SelectItem>
                            <SelectItem value="dilsukhnagar" className="text-white hover:bg-slate-700">
                              Dilsukhnagar
                            </SelectItem>
                            <SelectItem value="chaitanyapuri" className="text-white hover:bg-slate-700">
                              Chaitanyapuri
                            </SelectItem>
                            <SelectItem value="victoria-memorial" className="text-white hover:bg-slate-700">
                              Victoria Memorial
                            </SelectItem>
                            <SelectItem value="lb-nagar" className="text-white hover:bg-slate-700">
                              LB Nagar
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="destination" className="text-slate-300">
                          Destination Station
                        </Label>
                        <Select onValueChange={(value) => handleInputChange("destination", value)}>
                          <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white focus:border-purple-500">
                            <SelectValue placeholder="Select destination station" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-slate-600">
                            <SelectItem value="secunderabad" className="text-white hover:bg-slate-700">
                              Secunderabad
                            </SelectItem>
                            <SelectItem value="paradise" className="text-white hover:bg-slate-700">
                              Paradise
                            </SelectItem>
                            <SelectItem value="rasoolpura" className="text-white hover:bg-slate-700">
                              Rasoolpura
                            </SelectItem>
                            <SelectItem value="prakash-nagar" className="text-white hover:bg-slate-700">
                              Prakash Nagar
                            </SelectItem>
                            <SelectItem value="begumpet" className="text-white hover:bg-slate-700">
                              Begumpet
                            </SelectItem>
                            <SelectItem value="mathura-nagar" className="text-white hover:bg-slate-700">
                              Mathura Nagar
                            </SelectItem>
                            <SelectItem value="lakdi-ka-pul" className="text-white hover:bg-slate-700">
                              Lakdi Ka Pul
                            </SelectItem>
                            <SelectItem value="assembly" className="text-white hover:bg-slate-700">
                              Assembly
                            </SelectItem>
                            <SelectItem value="nampally" className="text-white hover:bg-slate-700">
                              Nampally
                            </SelectItem>
                            <SelectItem value="gandhi-bhavan" className="text-white hover:bg-slate-700">
                              Gandhi Bhavan
                            </SelectItem>
                            <SelectItem value="osmania-medical" className="text-white hover:bg-slate-700">
                              Osmania Medical
                            </SelectItem>
                            <SelectItem value="mg-bus-station" className="text-white hover:bg-slate-700">
                              MG Bus Station
                            </SelectItem>
                            <SelectItem value="malakpet" className="text-white hover:bg-slate-700">
                              Malakpet
                            </SelectItem>
                            <SelectItem value="new-market" className="text-white hover:bg-slate-700">
                              New Market
                            </SelectItem>
                            <SelectItem value="musarambagh" className="text-white hover:bg-slate-700">
                              Musarambagh
                            </SelectItem>
                            <SelectItem value="dilsukhnagar" className="text-white hover:bg-slate-700">
                              Dilsukhnagar
                            </SelectItem>
                            <SelectItem value="chaitanyapuri" className="text-white hover:bg-slate-700">
                              Chaitanyapuri
                            </SelectItem>
                            <SelectItem value="victoria-memorial" className="text-white hover:bg-slate-700">
                              Victoria Memorial
                            </SelectItem>
                            <SelectItem value="lb-nagar" className="text-white hover:bg-slate-700">
                              LB Nagar
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="date" className="text-slate-300">
                          Date
                        </Label>
                        <Input
                          id="date"
                          type="date"
                          value={predictionForm.date}
                          onChange={(e) => handleInputChange("date", e.target.value)}
                          className="bg-slate-700/50 border-slate-600 text-white focus:border-purple-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="time" className="text-slate-300">
                          Time
                        </Label>
                        <Input
                          id="time"
                          type="time"
                          value={predictionForm.time}
                          onChange={(e) => handleInputChange("time", e.target.value)}
                          className="bg-slate-700/50 border-slate-600 text-white focus:border-purple-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="boardings" className="text-slate-300">
                          Number of Boardings
                        </Label>
                        <Input
                          id="boardings"
                          type="number"
                          placeholder="Enter boarding count"
                          value={predictionForm.boardings}
                          onChange={(e) => handleInputChange("boardings", e.target.value)}
                          className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500"
                        />
                      </div>

                      <div className="md:col-span-2 lg:col-span-3 pt-4">
                        <Button
                          type="submit"
                          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-lg"
                        >
                          <TrendingUp className="w-4 h-4 mr-2" />
                          Predict Passenger Flow
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>

                {/* Prediction Results */}
                {isLoading && (
                  <Card className="bg-slate-800/50 border-cyan-500/30 mt-6">
                    <CardContent className="p-6">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
                        <h3 className="text-cyan-400 text-lg font-semibold mb-2">Processing Prediction...</h3>
                        <p className="text-slate-400">AFFN model is analyzing passenger flow patterns</p>
                        <div className="mt-4 bg-slate-700/50 p-3 rounded-lg">
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-300">Status:</span>
                            <span className="text-cyan-400">Analyzing data...</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {showResult && predictionResult && (
                  <Card className="bg-slate-800/50 border-green-500/30 mt-6">
                    <CardHeader>
                      <CardTitle className="text-green-400 flex items-center">
                        <TrendingUp className="w-5 h-5 mr-2" />
                        Prediction Results
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-slate-700/30 p-4 rounded-lg">
                          <h4 className="text-cyan-400 font-semibold mb-2">Trip Details</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-slate-300">FID:</span>
                              <span className="text-white font-mono">{predictionResult.fid}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-300">Route:</span>
                              <span className="text-white">{predictionResult.route}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-300">Processed:</span>
                              <span className="text-white">{predictionResult.timestamp}</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-slate-700/30 p-4 rounded-lg">
                          <h4 className="text-purple-400 font-semibold mb-2">Prediction Metrics</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-slate-300">Model:</span>
                              <span className="text-white">{predictionResult.modelUsed}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-300">Processing Time:</span>
                              <span className="text-white">{predictionResult.processingTime}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-300">Confidence:</span>
                              <span className="text-green-400">{predictionResult.confidence}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-purple-600/20 to-cyan-600/20 p-6 rounded-lg border border-purple-500/30">
                        <div className="text-center">
                          <h3 className="text-2xl font-bold text-white mb-2">Predicted Passenger Flow</h3>
                          <div className="flex items-center justify-center space-x-4">
                            <div className="text-center">
                              <p className="text-4xl font-bold text-cyan-400">{predictionResult.predictedFlow}</p>
                              <p className="text-slate-300 text-sm">Passengers</p>
                            </div>
                            <div className="text-center">
                              <span
                                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                  predictionResult.flowType === "High"
                                    ? "bg-red-600/20 text-red-400"
                                    : predictionResult.flowType === "Medium"
                                      ? "bg-yellow-600/20 text-yellow-400"
                                      : "bg-green-600/20 text-green-400"
                                }`}
                              >
                                {predictionResult.flowType} Flow
                              </span>
                              <p className="text-slate-300 text-sm mt-1">Classification</p>
                            </div>
                            <div className="text-center">
                              <p className="text-2xl font-bold text-green-400">{predictionResult.accuracy}%</p>
                              <p className="text-slate-300 text-sm">Accuracy</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-3">
                        <Button
                          onClick={() => setActiveSection("results")}
                          className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          View All Results
                        </Button>
                        <Button
                          onClick={() => {
                            setShowResult(false)
                            setPredictionForm({
                              fid: "",
                              tripId: "",
                              metroName: "",
                              city: "",
                              source: "",
                              destination: "",
                              date: "",
                              time: "",
                              boardings: "",
                            })
                          }}
                          variant="outline"
                          className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
                        >
                          New Prediction
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {activeSection === "analytics" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-slate-800/50 border-slate-600">
                    <CardHeader>
                      <CardTitle className="text-purple-400">Passenger Flow Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={flowData}
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            dataKey="value"
                            label={({ name, value }) => `${name}: ${value}%`}
                          >
                            {flowData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-800/50 border-slate-600">
                    <CardHeader>
                      <CardTitle className="text-cyan-400">Station-wise Flow</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={stationData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="station" stroke="#9CA3AF" />
                          <YAxis stroke="#9CA3AF" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#1F2937",
                              border: "1px solid #374151",
                              borderRadius: "8px",
                            }}
                          />
                          <Bar dataKey="flow" fill="#8B5CF6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {activeSection === "profile" && (
              <div className="space-y-6">
                <Card className="bg-slate-800/50 border-purple-500/30">
                  <CardHeader>
                    <CardTitle className="text-purple-400">User Profile</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <User className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white">John Doe</h3>
                        <p className="text-slate-400">john.doe@example.com</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                      <div className="space-y-2">
                        <Label className="text-slate-300">Mobile Number</Label>
                        <p className="text-white">+1 234 567 8900</p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-300">Date of Birth</Label>
                        <p className="text-white">January 15, 1990</p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-300">Address</Label>
                        <p className="text-white">123 Metro Street, City Center</p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-300">PIN Code</Label>
                        <p className="text-white">110001</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
