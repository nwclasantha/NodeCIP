"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Shield, Search, Download, AlertTriangle, CheckCircle, XCircle, Loader2 } from "lucide-react"
import { AnalysisChart } from "@/components/analysis-chart"
import { DataTable } from "@/components/data-table"
import { JsonViewer } from "@/components/json-viewer"
import { ExportDialog } from "@/components/export-dialog"

interface AnalysisData {
  malicious: any
  suspicious: any
}

export default function Dashboard() {
  const [apiKey, setApiKey] = useState("")
  const [targetIp, setTargetIp] = useState("45.141.215.95")
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [data, setData] = useState<AnalysisData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showExport, setShowExport] = useState(false)

  const handleAnalyze = async () => {
    if (!apiKey.trim() || !targetIp.trim()) {
      setError("Please enter both API key and target IP address")
      return
    }

    setIsLoading(true)
    setError(null)
    setProgress(0)

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90))
      }, 200)

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey, ip: targetIp }),
      })

      clearInterval(progressInterval)
      setProgress(100)

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.statusText}`)
      }

      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed")
      setProgress(0)
    } finally {
      setIsLoading(false)
    }
  }

  const getRiskLevel = (score: number) => {
    if (score >= 80) return { level: "Critical", color: "destructive", icon: XCircle }
    if (score >= 60) return { level: "High", color: "destructive", icon: AlertTriangle }
    if (score >= 40) return { level: "Medium", color: "secondary", icon: AlertTriangle }
    if (score >= 20) return { level: "Low", color: "secondary", icon: CheckCircle }
    return { level: "Safe", color: "default", icon: CheckCircle }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-blue-600 rounded-lg">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">IP Threat Intelligence Dashboard</h1>
            <p className="text-slate-400">Advanced IP reputation and security analysis</p>
          </div>
        </div>

        {/* Configuration Panel */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Search className="h-5 w-5" />
              Analysis Configuration
            </CardTitle>
            <CardDescription className="text-slate-400">
              Enter your API credentials and target IP address for analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="apiKey" className="text-white">
                  API Key
                </Label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="Enter your Criminal IP API key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="targetIp" className="text-white">
                  Target IP Address
                </Label>
                <Input
                  id="targetIp"
                  placeholder="e.g., 45.141.215.95"
                  value={targetIp}
                  onChange={(e) => setTargetIp(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleAnalyze} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Analyze IP
                  </>
                )}
              </Button>

              {data && (
                <Button
                  variant="outline"
                  onClick={() => setShowExport(true)}
                  className="border-slate-600 text-white hover:bg-slate-700"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Results
                </Button>
              )}
            </div>

            {isLoading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-slate-400">
                  <span>Analysis Progress</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="bg-slate-700" />
              </div>
            )}

            {error && (
              <Alert className="border-red-500 bg-red-500/10">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-red-400">{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        {data && (
          <div className="space-y-6">
            {/* Risk Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.malicious?.score && (
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-lg">Malicious Risk Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-3xl font-bold text-white">{data.malicious.score.inbound || 0}</div>
                      <Badge variant={getRiskLevel(data.malicious.score.inbound || 0).color as any} className="text-sm">
                        {getRiskLevel(data.malicious.score.inbound || 0).level}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              )}

              {data.suspicious?.score && (
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-lg">Suspicious Activity Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-3xl font-bold text-white">{data.suspicious.score.inbound || 0}</div>
                      <Badge
                        variant={getRiskLevel(data.suspicious.score.inbound || 0).color as any}
                        className="text-sm"
                      >
                        {getRiskLevel(data.suspicious.score.inbound || 0).level}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Analysis Tabs */}
            <Tabs defaultValue="malicious" className="space-y-4">
              <TabsList className="bg-slate-800 border-slate-700">
                <TabsTrigger value="malicious" className="data-[state=active]:bg-slate-700">
                  Malicious Analysis
                </TabsTrigger>
                <TabsTrigger value="suspicious" className="data-[state=active]:bg-slate-700">
                  Suspicious Analysis
                </TabsTrigger>
                <TabsTrigger value="raw" className="data-[state=active]:bg-slate-700">
                  Raw Data
                </TabsTrigger>
              </TabsList>

              <TabsContent value="malicious" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-white">Risk Indicators</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <DataTable data={data.malicious} />
                    </CardContent>
                  </Card>
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-white">Risk Visualization</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <AnalysisChart data={data.malicious} />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="suspicious" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-white">Suspicious Indicators</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <DataTable data={data.suspicious} />
                    </CardContent>
                  </Card>
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-white">Activity Visualization</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <AnalysisChart data={data.suspicious} />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="raw">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Raw JSON Data</CardTitle>
                    <CardDescription className="text-slate-400">
                      Complete API response data for detailed analysis
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <JsonViewer data={data} />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Export Dialog */}
        {showExport && data && <ExportDialog data={data} targetIp={targetIp} onClose={() => setShowExport(false)} />}
      </div>
    </div>
  )
}
