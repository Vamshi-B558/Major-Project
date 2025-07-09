"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, FileText, Filter, Search } from "lucide-react"
import { Layout } from "./layout"

const predictionResults = [
  {
    id: "PR001",
    date: "2024-01-15",
    station: "Central Station",
    source: "Central",
    destination: "North",
    predictedFlow: 3420,
    flowType: "High",
    accuracy: 94.2,
    timestamp: "08:30 AM",
  },
  {
    id: "PR002",
    date: "2024-01-15",
    station: "North Station",
    source: "North",
    destination: "East",
    predictedFlow: 2180,
    flowType: "Medium",
    accuracy: 91.8,
    timestamp: "09:15 AM",
  },
  {
    id: "PR003",
    date: "2024-01-15",
    station: "South Station",
    source: "South",
    destination: "West",
    predictedFlow: 1250,
    flowType: "Low",
    accuracy: 89.5,
    timestamp: "10:00 AM",
  },
  {
    id: "PR004",
    date: "2024-01-15",
    station: "East Station",
    source: "East",
    destination: "Central",
    predictedFlow: 3850,
    flowType: "High",
    accuracy: 96.1,
    timestamp: "11:30 AM",
  },
  {
    id: "PR005",
    date: "2024-01-15",
    station: "West Station",
    source: "West",
    destination: "South",
    predictedFlow: 2750,
    flowType: "Medium",
    accuracy: 92.3,
    timestamp: "12:45 PM",
  },
]

export function ResultsScreen() {
  const [filters, setFilters] = useState({
    date: "",
    station: "",
    flowType: "",
    search: "",
  })

  const getFlowBadge = (flowType: string) => {
    const variants = {
      High: "bg-red-600/20 text-red-400 border-red-500/30",
      Medium: "bg-yellow-600/20 text-yellow-400 border-yellow-500/30",
      Low: "bg-green-600/20 text-green-400 border-green-500/30",
    }
    return variants[flowType as keyof typeof variants] || variants.Medium
  }

  const filteredResults = predictionResults.filter((result) => {
    return (
      (!filters.date || result.date.includes(filters.date)) &&
      (!filters.station || result.station.toLowerCase().includes(filters.station.toLowerCase())) &&
      (!filters.flowType || result.flowType === filters.flowType) &&
      (!filters.search ||
        result.id.toLowerCase().includes(filters.search.toLowerCase()) ||
        result.station.toLowerCase().includes(filters.search.toLowerCase()) ||
        result.source.toLowerCase().includes(filters.search.toLowerCase()) ||
        result.destination.toLowerCase().includes(filters.search.toLowerCase()))
    )
  })

  return (
    <Layout title="Prediction Results">
      <div className="p-6 space-y-6">
        {/* Filters */}
        <Card className="bg-slate-800/50 border-slate-600">
          <CardHeader>
            <CardTitle className="text-cyan-400 flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Filter Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="space-y-2">
                <label className="text-slate-300 text-sm">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Search results..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-slate-300 text-sm">Date</label>
                <Input
                  type="date"
                  value={filters.date}
                  onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                  className="bg-slate-700/50 border-slate-600 text-white focus:border-cyan-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-slate-300 text-sm">Station</label>
                <Input
                  placeholder="Filter by station"
                  value={filters.station}
                  onChange={(e) => setFilters({ ...filters, station: e.target.value })}
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-cyan-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-slate-300 text-sm">Flow Type</label>
                <Select onValueChange={(value) => setFilters({ ...filters, flowType: value })}>
                  <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white focus:border-cyan-500">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    <SelectItem value="" className="text-white hover:bg-slate-700">
                      All Types
                    </SelectItem>
                    <SelectItem value="High" className="text-white hover:bg-slate-700">
                      High Flow
                    </SelectItem>
                    <SelectItem value="Medium" className="text-white hover:bg-slate-700">
                      Medium Flow
                    </SelectItem>
                    <SelectItem value="Low" className="text-white hover:bg-slate-700">
                      Low Flow
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-slate-300 text-sm">Export</label>
                <div className="flex space-x-2">
                  <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                    <Download className="w-4 h-4 mr-1" />
                    CSV
                  </Button>
                  <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                    <FileText className="w-4 h-4 mr-1" />
                    PDF
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Table */}
        <Card className="bg-slate-800/50 border-slate-600">
          <CardHeader>
            <CardTitle className="text-purple-400">Prediction Results ({filteredResults.length} records)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-600">
                    <TableHead className="text-slate-300">ID</TableHead>
                    <TableHead className="text-slate-300">Date</TableHead>
                    <TableHead className="text-slate-300">Time</TableHead>
                    <TableHead className="text-slate-300">Station</TableHead>
                    <TableHead className="text-slate-300">Route</TableHead>
                    <TableHead className="text-slate-300">Predicted Flow</TableHead>
                    <TableHead className="text-slate-300">Flow Type</TableHead>
                    <TableHead className="text-slate-300">Accuracy</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredResults.map((result) => (
                    <TableRow key={result.id} className="border-slate-600 hover:bg-slate-700/30">
                      <TableCell className="text-cyan-400 font-mono">{result.id}</TableCell>
                      <TableCell className="text-white">{result.date}</TableCell>
                      <TableCell className="text-white">{result.timestamp}</TableCell>
                      <TableCell className="text-white">{result.station}</TableCell>
                      <TableCell className="text-slate-300">
                        {result.source} → {result.destination}
                      </TableCell>
                      <TableCell className="text-white font-semibold">
                        {result.predictedFlow.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge className={`border ${getFlowBadge(result.flowType)}`}>{result.flowType}</Badge>
                      </TableCell>
                      <TableCell className="text-green-400 font-semibold">{result.accuracy}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-slate-800/50 border-cyan-500/30">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-cyan-400">{filteredResults.length}</p>
                <p className="text-slate-400 text-sm">Total Predictions</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-green-500/30">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-400">
                  {(filteredResults.reduce((acc, r) => acc + r.accuracy, 0) / filteredResults.length).toFixed(1)}%
                </p>
                <p className="text-slate-400 text-sm">Avg Accuracy</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-purple-500/30">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-400">
                  {Math.round(
                    filteredResults.reduce((acc, r) => acc + r.predictedFlow, 0) / filteredResults.length,
                  ).toLocaleString()}
                </p>
                <p className="text-slate-400 text-sm">Avg Flow</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-yellow-500/30">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-400">
                  {filteredResults.filter((r) => r.flowType === "High").length}
                </p>
                <p className="text-slate-400 text-sm">High Flow Events</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
}
