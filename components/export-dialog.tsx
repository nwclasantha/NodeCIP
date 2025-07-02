"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Download, FileText, Database } from "lucide-react"

interface ExportDialogProps {
  data: any
  targetIp: string
  onClose: () => void
}

export function ExportDialog({ data, targetIp, onClose }: ExportDialogProps) {
  const [format, setFormat] = useState("json")

  const handleExport = () => {
    const timestamp = new Date().toISOString().split("T")[0]
    const filename = `ip_analysis_${targetIp.replace(/\./g, "_")}_${timestamp}`

    let content: string
    let mimeType: string
    let extension: string

    switch (format) {
      case "json":
        content = JSON.stringify(data, null, 2)
        mimeType = "application/json"
        extension = "json"
        break
      case "csv":
        content = convertToCSV(data)
        mimeType = "text/csv"
        extension = "csv"
        break
      case "txt":
        content = convertToText(data, targetIp)
        mimeType = "text/plain"
        extension = "txt"
        break
      default:
        return
    }

    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${filename}.${extension}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    onClose()
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Analysis Results
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Choose the format for exporting your IP analysis results
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <RadioGroup value={format} onValueChange={setFormat}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="json" id="json" />
              <Label htmlFor="json" className="flex items-center gap-2 cursor-pointer">
                <Database className="h-4 w-4" />
                JSON Format - Complete structured data
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="csv" id="csv" />
              <Label htmlFor="csv" className="flex items-center gap-2 cursor-pointer">
                <FileText className="h-4 w-4" />
                CSV Format - Spreadsheet compatible
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="txt" id="txt" />
              <Label htmlFor="txt" className="flex items-center gap-2 cursor-pointer">
                <FileText className="h-4 w-4" />
                Text Report - Human readable summary
              </Label>
            </div>
          </RadioGroup>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose} className="border-slate-600 bg-transparent">
              Cancel
            </Button>
            <Button onClick={handleExport} className="bg-blue-600 hover:bg-blue-700">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function convertToCSV(data: any): string {
  const rows = [["Category", "Indicator", "Value"]]

  if (data.malicious) {
    if (data.malicious.score) {
      rows.push(["Malicious", "Inbound Score", data.malicious.score.inbound || "0"])
      rows.push(["Malicious", "Outbound Score", data.malicious.score.outbound || "0"])
    }
    if (data.malicious.issues) {
      Object.entries(data.malicious.issues).forEach(([key, value]) => {
        rows.push(["Malicious", key, String(value)])
      })
    }
  }

  if (data.suspicious) {
    if (data.suspicious.score) {
      rows.push(["Suspicious", "Inbound Score", data.suspicious.score.inbound || "0"])
      rows.push(["Suspicious", "Outbound Score", data.suspicious.score.outbound || "0"])
    }
    if (data.suspicious.issues) {
      Object.entries(data.suspicious.issues).forEach(([key, value]) => {
        rows.push(["Suspicious", key, String(value)])
      })
    }
  }

  return rows.map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n")
}

function convertToText(data: any, targetIp: string): string {
  const lines = [
    "IP THREAT INTELLIGENCE REPORT",
    "================================",
    `Target IP: ${targetIp}`,
    `Generated: ${new Date().toLocaleString()}`,
    "",
  ]

  if (data.malicious) {
    lines.push("MALICIOUS ANALYSIS")
    lines.push("------------------")
    if (data.malicious.score) {
      lines.push(`Inbound Risk Score: ${data.malicious.score.inbound || 0}`)
      lines.push(`Outbound Risk Score: ${data.malicious.score.outbound || 0}`)
    }
    if (data.malicious.issues) {
      lines.push("Issues:")
      Object.entries(data.malicious.issues).forEach(([key, value]) => {
        lines.push(`  ${key}: ${value}`)
      })
    }
    lines.push("")
  }

  if (data.suspicious) {
    lines.push("SUSPICIOUS ANALYSIS")
    lines.push("-------------------")
    if (data.suspicious.score) {
      lines.push(`Inbound Risk Score: ${data.suspicious.score.inbound || 0}`)
      lines.push(`Outbound Risk Score: ${data.suspicious.score.outbound || 0}`)
    }
    if (data.suspicious.issues) {
      lines.push("Issues:")
      Object.entries(data.suspicious.issues).forEach(([key, value]) => {
        lines.push(`  ${key}: ${value}`)
      })
    }
  }

  return lines.join("\n")
}
