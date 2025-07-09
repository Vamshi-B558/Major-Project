"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import {
  Train,
  Database,
  BarChart3,
  Eye,
  Download,
  Users,
  TrendingUp,
  Activity,
  Settings,
  LogOut,
  FileText,
  Upload,
} from "lucide-react"
import { Layout } from "./layout"

const accuracyData = [
  { model: "AFFN", accuracy: 94.2 },
  { model: "LSTM", accuracy: 87.5 },
  { model: "CNN", accuracy: 82.1 },
  { model: "SVM", accuracy: 78.9 },
]

const predictionTrends = [
  { time: "06:00", passengers: 1200 },
  { time: "08:00", passengers: 3500 },
  { time: "10:00", passengers: 2100 },
  { time: "12:00", passengers: 2800 },
  { time: "14:00", passengers: 2200 },
  { time: "16:00", passengers: 3200 },
  { time: "18:00", passengers: 4100 },
  { time: "20:00", passengers: 2900 },
]

export function OrganizerDashboard() {
  const [activeSection, setActiveSection] = useState("overview")

  const sidebarItems = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "dataset", label: "Train & Test Dataset", icon: Database },
    { id: "accuracy", label: "View Accuracy", icon: TrendingUp },
    { id: "predictions", label: "Prediction Results", icon: Eye },
    { id: "download", label: "Download Dataset", icon: Download },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  return (
    <Layout title="Metro Flow Dashboard - Organizer">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-slate-800/50 border-r border-cyan-500/20 backdrop-blur-sm">
          <div className="p-4">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Train className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Organizer</h2>
                <p className="text-sm text-slate-400">Admin Panel</p>
              </div>
            </div>

            <nav className="space-y-2">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    activeSection === item.id
                      ? "bg-cyan-600/20 text-cyan-400 border border-cyan-500/30"
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
            {activeSection === "overview" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <Card className="bg-slate-800/50 border-cyan-500/30">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-slate-400 text-sm">Total Predictions</p>
                          <p className="text-2xl font-bold text-cyan-400">12,847</p>
                        </div>
                        <Activity className="w-8 h-8 text-cyan-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-800/50 border-purple-500/30">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-slate-400 text-sm">Model Accuracy</p>
                          <p className="text-2xl font-bold text-purple-400">94.2%</p>
                        </div>
                        <TrendingUp className="w-8 h-8 text-purple-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-800/50 border-green-500/30">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-slate-400 text-sm">Active Users</p>
                          <p className="text-2xl font-bold text-green-400">1,234</p>
                        </div>
                        <Users className="w-8 h-8 text-green-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-800/50 border-yellow-500/30">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-slate-400 text-sm">Dataset Size</p>
                          <p className="text-2xl font-bold text-yellow-400">2.4M</p>
                        </div>
                        <Database className="w-8 h-8 text-yellow-500" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-slate-800/50 border-slate-600">
                    <CardHeader>
                      <CardTitle className="text-cyan-400">Model Accuracy Comparison</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={accuracyData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="model" stroke="#9CA3AF" />
                          <YAxis stroke="#9CA3AF" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#1F2937",
                              border: "1px solid #374151",
                              borderRadius: "8px",
                            }}
                          />
                          <Bar dataKey="accuracy" fill="#06B6D4" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-800/50 border-slate-600">
                    <CardHeader>
                      <CardTitle className="text-purple-400">Passenger Flow Trends</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={predictionTrends}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="time" stroke="#9CA3AF" />
                          <YAxis stroke="#9CA3AF" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#1F2937",
                              border: "1px solid #374151",
                              borderRadius: "8px",
                            }}
                          />
                          <Line type="monotone" dataKey="passengers" stroke="#8B5CF6" strokeWidth={3} />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {activeSection === "dataset" && (
              <div className="space-y-6">
                {/* Real Dataset Information */}
                <Card className="bg-slate-800/50 border-green-500/30">
                  <CardHeader>
                    <CardTitle className="text-green-400 flex items-center">
                      <Database className="w-5 h-5 mr-2" />
                      Available Dataset: Metro Passenger Flow Data
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-slate-700/30 p-4 rounded-lg">
                        <h4 className="text-cyan-400 font-semibold mb-2">Dataset Overview</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-300">Records:</span>
                            <span className="text-white font-semibold">50,000+</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-300">Size:</span>
                            <span className="text-white font-semibold">12.5 MB</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-300">Format:</span>
                            <span className="text-white font-semibold">CSV</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-300">Features:</span>
                            <span className="text-white font-semibold">9 columns</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-slate-700/30 p-4 rounded-lg">
                        <h4 className="text-purple-400 font-semibold mb-2">Data Source</h4>
                        <div className="space-y-1">
                          <div className="text-sm text-slate-300">Metro passenger flow dataset</div>
                          <div className="text-sm text-slate-300">Real-world transportation data</div>
                          <div className="text-sm text-slate-300">Time-series passenger counts</div>
                          <div className="text-sm text-slate-300">Multi-route coverage</div>
                        </div>
                      </div>

                      <div className="bg-slate-700/30 p-4 rounded-lg">
                        <h4 className="text-yellow-400 font-semibold mb-2">Data Quality</h4>
                        <div className="space-y-2">
                          <div className="flex items-center text-sm">
                            <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                            <span className="text-slate-300">Complete Records</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                            <span className="text-slate-300">Temporal Data</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                            <span className="text-slate-300">Labeled Dataset</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-700/30 p-4 rounded-lg">
                      <h4 className="text-cyan-400 font-semibold mb-3">Dataset Features (9 Columns)</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        {[
                          "Fid - Flow Identifier",
                          "Tripid - Trip Identifier",
                          "Metro_Name - Metro Line Name",
                          "City - City Location",
                          "Source - Origin Station",
                          "Destination - Target Station",
                          "Date_Time - Timestamp",
                          "NumberOfBoardings - Passenger Count",
                          "Label - Classification Label",
                        ].map((feature, index) => (
                          <div key={index} className="flex items-center text-sm">
                            <div className="w-2 h-2 bg-cyan-400 rounded-full mr-2"></div>
                            <span className="text-slate-300">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <Button
                        onClick={() => {
                          alert(
                            "Dataset upload initiated!\n\nFile: Metro Passenger Flow Dataset\nURL: https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Datasets-AUC7i0812pSY5F1NQx8Uw4jzC2CeoX.csv\nSize: 12.5 MB\nRecords: 50,000+\n\nThis would process and upload the dataset for AFFN model training.",
                          )
                        }}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Dataset for Training
                      </Button>
                      <Button
                        onClick={() =>
                          window.open(
                            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Datasets-AUC7i0812pSY5F1NQx8Uw4jzC2CeoX.csv",
                            "_blank",
                          )
                        }
                        variant="outline"
                        className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        View Raw Data
                      </Button>
                      <Button
                        onClick={() => {
                          alert(
                            "Dataset Analysis Results:\n\n📊 Records: 50,000+\n📁 Size: 12.5 MB\n🏛️ Features: 9 columns\n📅 Includes temporal data\n👥 Passenger flow patterns\n🎯 Ready for AFFN training\n\nDataset is suitable for passenger flow prediction!",
                          )
                        }}
                        variant="outline"
                        className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
                      >
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Analyze Data
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Manual Upload Section */}
                <Card className="bg-slate-800/50 border-cyan-500/30">
                  <CardHeader>
                    <CardTitle className="text-cyan-400">Manual Dataset Upload</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="training-dataset" className="block text-slate-300 text-sm mb-1">
                          Upload Training Dataset
                        </label>
                        <div className="flex">
                          <label
                            htmlFor="training-dataset"
                            className="flex-1 flex items-center justify-center bg-cyan-600 hover:bg-cyan-700 text-white py-2 px-4 rounded-lg cursor-pointer"
                          >
                            <Database className="w-4 h-4 mr-2" />
                            Select Training File
                          </label>
                          <input
                            id="training-dataset"
                            type="file"
                            accept=".csv,.xlsx"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                alert(
                                  `Selected file: ${e.target.files[0].name}\nSize: ${(e.target.files[0].size / 1024 / 1024).toFixed(2)} MB\n\nThis would upload and process the training dataset.`,
                                )
                              }
                            }}
                          />
                          <Button
                            className="ml-2 bg-green-600 hover:bg-green-700 text-white"
                            onClick={() =>
                              alert("Upload process would start here with progress tracking and validation.")
                            }
                          >
                            Upload
                          </Button>
                        </div>
                        <p className="text-xs text-slate-400">Supported formats: CSV, XLSX (max 100MB)</p>
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="test-dataset" className="block text-slate-300 text-sm mb-1">
                          Upload Test Dataset
                        </label>
                        <div className="flex">
                          <label
                            htmlFor="test-dataset"
                            className="flex-1 flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg cursor-pointer"
                          >
                            <Database className="w-4 h-4 mr-2" />
                            Select Test File
                          </label>
                          <input
                            id="test-dataset"
                            type="file"
                            accept=".csv,.xlsx"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                alert(
                                  `Selected file: ${e.target.files[0].name}\nSize: ${(e.target.files[0].size / 1024 / 1024).toFixed(2)} MB\n\nThis would upload and process the test dataset.`,
                                )
                              }
                            }}
                          />
                          <Button
                            className="ml-2 bg-green-600 hover:bg-green-700 text-white"
                            onClick={() =>
                              alert("Upload process would start here with progress tracking and validation.")
                            }
                          >
                            Upload
                          </Button>
                        </div>
                        <p className="text-xs text-slate-400">Supported formats: CSV, XLSX (max 100MB)</p>
                      </div>
                    </div>

                    <div className="bg-slate-700/50 p-4 rounded-lg">
                      <h4 className="text-white font-semibold mb-3">Current Dataset Status</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                          <div>
                            <p className="text-white font-medium">metro_passenger_flow_dataset.csv</p>
                            <p className="text-xs text-slate-400">
                              Available • 12.5MB • 50,000+ records • 9 features • Ready for upload
                            </p>
                          </div>
                          <Badge className="bg-green-600/20 text-green-400">Available</Badge>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg opacity-50">
                          <div>
                            <p className="text-slate-400 font-medium">training_split.csv</p>
                            <p className="text-xs text-slate-400">
                              Not created • Will be generated after upload • 70% of data
                            </p>
                          </div>
                          <Badge className="bg-slate-600/20 text-slate-400">Pending</Badge>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg opacity-50">
                          <div>
                            <p className="text-slate-400 font-medium">test_split.csv</p>
                            <p className="text-xs text-slate-400">
                              Not created • Will be generated after upload • 30% of data
                            </p>
                          </div>
                          <Badge className="bg-slate-600/20 text-slate-400">Pending</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button
                        className="bg-cyan-600 hover:bg-cyan-700 text-white"
                        onClick={() =>
                          alert(
                            "Dataset validation would check:\n\n✅ Data completeness\n✅ Format consistency\n✅ Missing values\n✅ Outlier detection\n✅ Schema validation",
                          )
                        }
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Validate Datasets
                      </Button>
                      <Button
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                        onClick={() =>
                          alert(
                            "Preprocessing would include:\n\n🔧 Data cleaning\n🔧 Feature engineering\n🔧 Normalization\n🔧 Encoding categorical variables\n🔧 Time-series preparation",
                          )
                        }
                      >
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Preprocess Datasets
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === "accuracy" && (
              <div className="space-y-6">
                <Card className="bg-slate-800/50 border-slate-600">
                  <CardHeader>
                    <CardTitle className="text-cyan-400">Model Performance Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart data={accuracyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="model" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1F2937",
                            border: "1px solid #374151",
                            borderRadius: "8px",
                          }}
                        />
                        <Bar dataKey="accuracy" fill="#06B6D4" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === "predictions" && (
              <div className="space-y-6">
                <Card className="bg-slate-800/50 border-slate-600">
                  <CardHeader>
                    <CardTitle className="text-cyan-400">All Prediction Results</CardTitle>
                    <p className="text-slate-400">View and manage all system predictions</p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <Card className="bg-slate-700/30 border-slate-600">
                        <CardContent className="p-4 text-center">
                          <p className="text-2xl font-bold text-cyan-400">12,847</p>
                          <p className="text-slate-400 text-sm">Total Predictions</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-slate-700/30 border-slate-600">
                        <CardContent className="p-4 text-center">
                          <p className="text-2xl font-bold text-green-400">94.2%</p>
                          <p className="text-slate-400 text-sm">Average Accuracy</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-slate-700/30 border-slate-600">
                        <CardContent className="p-4 text-center">
                          <p className="text-2xl font-bold text-purple-400">1,234</p>
                          <p className="text-slate-400 text-sm">Active Users</p>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-white font-semibold">Recent Predictions</h3>
                        <Button
                          onClick={() => window.open("/results", "_blank")}
                          className="bg-cyan-600 hover:bg-cyan-700 text-white"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View All Results
                        </Button>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-slate-600">
                              <th className="text-left text-slate-300 py-2">ID</th>
                              <th className="text-left text-slate-300 py-2">User</th>
                              <th className="text-left text-slate-300 py-2">Route</th>
                              <th className="text-left text-slate-300 py-2">Flow</th>
                              <th className="text-left text-slate-300 py-2">Type</th>
                              <th className="text-left text-slate-300 py-2">Accuracy</th>
                              <th className="text-left text-slate-300 py-2">Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {[
                              {
                                id: "PR001",
                                user: "demo_user",
                                route: "Central → North",
                                flow: 3420,
                                type: "High",
                                accuracy: 94.2,
                                date: "2024-01-15",
                              },
                              {
                                id: "PR002",
                                user: "user1",
                                route: "North → East",
                                flow: 2180,
                                type: "Medium",
                                accuracy: 91.8,
                                date: "2024-01-15",
                              },
                              {
                                id: "PR003",
                                user: "testuser",
                                route: "South → West",
                                flow: 1250,
                                type: "Low",
                                accuracy: 89.5,
                                date: "2024-01-15",
                              },
                              {
                                id: "PR004",
                                user: "demo_user",
                                route: "East → Central",
                                flow: 3850,
                                type: "High",
                                accuracy: 96.1,
                                date: "2024-01-14",
                              },
                              {
                                id: "PR005",
                                user: "user1",
                                route: "West → South",
                                flow: 2750,
                                type: "Medium",
                                accuracy: 92.3,
                                date: "2024-01-14",
                              },
                            ].map((result) => (
                              <tr key={result.id} className="border-b border-slate-600 hover:bg-slate-700/30">
                                <td className="py-2 text-cyan-400 font-mono">{result.id}</td>
                                <td className="py-2 text-white">{result.user}</td>
                                <td className="py-2 text-slate-300">{result.route}</td>
                                <td className="py-2 text-white font-semibold">{result.flow.toLocaleString()}</td>
                                <td className="py-2">
                                  <span
                                    className={`px-2 py-1 text-xs rounded-full ${
                                      result.type === "High"
                                        ? "bg-red-600/20 text-red-400"
                                        : result.type === "Medium"
                                          ? "bg-yellow-600/20 text-yellow-400"
                                          : "bg-green-600/20 text-green-400"
                                    }`}
                                  >
                                    {result.type}
                                  </span>
                                </td>
                                <td className="py-2 text-green-400 font-semibold">{result.accuracy}%</td>
                                <td className="py-2 text-slate-400">{result.date}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === "download" && (
              <div className="space-y-6">
                <Card className="bg-slate-800/50 border-green-500/30">
                  <CardHeader>
                    <CardTitle className="text-green-400">Download Datasets & Reports</CardTitle>
                    <p className="text-slate-400">Export system data and prediction results</p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-cyan-400 font-semibold">Training & Test Datasets</h3>
                        <div className="space-y-3">
                          <Button
                            onClick={() => {
                              // Simulate CSV download
                              const csvContent =
                                "data:text/csv;charset=utf-8,FID,TripID,MetroName,City,Source,Destination,Date,Time,Boardings\nFID001,TRP001,Metro Line 1,Delhi,Central,North,2024-01-15,08:30,150\nFID002,TRP002,Metro Line 2,Mumbai,Andheri,Bandra,2024-01-15,09:15,200"
                              const encodedUri = encodeURI(csvContent)
                              const link = document.createElement("a")
                              link.setAttribute("href", encodedUri)
                              link.setAttribute("download", "training_dataset.csv")
                              document.body.appendChild(link)
                              link.click()
                              document.body.removeChild(link)
                            }}
                            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download Training Dataset (CSV)
                          </Button>
                          <Button
                            onClick={() => {
                              const csvContent =
                                "data:text/csv;charset=utf-8,FID,TripID,MetroName,City,Source,Destination,Date,Time,Boardings\nFID101,TRP101,Metro Line 1,Delhi,North,South,2024-01-15,10:30,120\nFID102,TRP102,Metro Line 3,Bangalore,Majestic,Whitefield,2024-01-15,11:15,180"
                              const encodedUri = encodeURI(csvContent)
                              const link = document.createElement("a")
                              link.setAttribute("href", encodedUri)
                              link.setAttribute("download", "test_dataset.csv")
                              document.body.appendChild(link)
                              link.click()
                              document.body.removeChild(link)
                            }}
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download Test Dataset (CSV)
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-purple-400 font-semibold">Prediction Results</h3>
                        <div className="space-y-3">
                          <Button
                            onClick={() => {
                              const csvContent =
                                "data:text/csv;charset=utf-8,ID,Date,Time,Route,PredictedFlow,FlowType,Accuracy\nPR001,2024-01-15,08:30,Central → North,3420,High,94.2%\nPR002,2024-01-15,09:15,North → East,2180,Medium,91.8%"
                              const encodedUri = encodeURI(csvContent)
                              const link = document.createElement("a")
                              link.setAttribute("href", encodedUri)
                              link.setAttribute("download", "prediction_results.csv")
                              document.body.appendChild(link)
                              link.click()
                              document.body.removeChild(link)
                            }}
                            className="w-full bg-green-600 hover:bg-green-700 text-white"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download All Results (CSV)
                          </Button>
                          <Button
                            onClick={() => {
                              // Simulate PDF download
                              alert(
                                "PDF report generation started. This would normally generate a comprehensive PDF report with charts and analytics.",
                              )
                            }}
                            className="w-full bg-red-600 hover:bg-red-700 text-white"
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            Download Report (PDF)
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-700/50 p-4 rounded-lg">
                      <h4 className="text-white font-semibold mb-3">Export Statistics</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div>
                          <p className="text-cyan-400 text-lg font-bold">2.4M</p>
                          <p className="text-slate-400 text-sm">Training Records</p>
                        </div>
                        <div>
                          <p className="text-purple-400 text-lg font-bold">600K</p>
                          <p className="text-slate-400 text-sm">Test Records</p>
                        </div>
                        <div>
                          <p className="text-green-400 text-lg font-bold">12.8K</p>
                          <p className="text-slate-400 text-sm">Predictions</p>
                        </div>
                        <div>
                          <p className="text-yellow-400 text-lg font-bold">94.2%</p>
                          <p className="text-slate-400 text-sm">Avg Accuracy</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === "settings" && (
              <div className="space-y-6">
                <Card className="bg-slate-800/50 border-yellow-500/30">
                  <CardHeader>
                    <CardTitle className="text-yellow-400">System Settings</CardTitle>
                    <p className="text-slate-400">Configure system parameters and preferences</p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-cyan-400 font-semibold">Model Configuration</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center p-3 bg-slate-700/30 rounded-lg">
                            <span className="text-slate-300">AFFN Model Version</span>
                            <span className="text-cyan-400 font-semibold">v2.1</span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-slate-700/30 rounded-lg">
                            <span className="text-slate-300">Prediction Threshold</span>
                            <span className="text-purple-400 font-semibold">85%</span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-slate-700/30 rounded-lg">
                            <span className="text-slate-300">Auto-Retrain</span>
                            <span className="text-green-400 font-semibold">Enabled</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-purple-400 font-semibold">System Preferences</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center p-3 bg-slate-700/30 rounded-lg">
                            <span className="text-slate-300">Data Retention</span>
                            <span className="text-cyan-400 font-semibold">12 months</span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-slate-700/30 rounded-lg">
                            <span className="text-slate-300">Backup Frequency</span>
                            <span className="text-purple-400 font-semibold">Daily</span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-slate-700/30 rounded-lg">
                            <span className="text-slate-300">API Rate Limit</span>
                            <span className="text-green-400 font-semibold">1000/hour</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-green-400 font-semibold">User Management</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Button
                          onClick={() => alert("User management panel would open here")}
                          className="bg-cyan-600 hover:bg-cyan-700 text-white"
                        >
                          <Users className="w-4 h-4 mr-2" />
                          Manage Users
                        </Button>
                        <Button
                          onClick={() => alert("Role configuration panel would open here")}
                          className="bg-purple-600 hover:bg-purple-700 text-white"
                        >
                          <Settings className="w-4 h-4 mr-2" />
                          Configure Roles
                        </Button>
                        <Button
                          onClick={() => alert("System logs viewer would open here")}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <Activity className="w-4 h-4 mr-2" />
                          View Logs
                        </Button>
                      </div>
                    </div>

                    <div className="bg-slate-700/50 p-4 rounded-lg">
                      <h4 className="text-white font-semibold mb-3">System Status</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div>
                          <p className="text-green-400 text-lg font-bold">Online</p>
                          <p className="text-slate-400 text-sm">System Status</p>
                        </div>
                        <div>
                          <p className="text-cyan-400 text-lg font-bold">99.9%</p>
                          <p className="text-slate-400 text-sm">Uptime</p>
                        </div>
                        <div>
                          <p className="text-purple-400 text-lg font-bold">45ms</p>
                          <p className="text-slate-400 text-sm">Avg Response</p>
                        </div>
                        <div>
                          <p className="text-yellow-400 text-lg font-bold">2.1GB</p>
                          <p className="text-slate-400 text-sm">Memory Usage</p>
                        </div>
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
