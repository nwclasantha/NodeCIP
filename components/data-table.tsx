"use client"

import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react"

interface DataTableProps {
  data: any
}

export function DataTable({ data }: DataTableProps) {
  const rows = []

  if (data?.score) {
    if (data.score.inbound !== undefined) {
      rows.push({
        indicator: "Inbound Risk Score",
        value: data.score.inbound,
        type: "score",
      })
    }
    if (data.score.outbound !== undefined) {
      rows.push({
        indicator: "Outbound Risk Score",
        value: data.score.outbound,
        type: "score",
      })
    }
  }

  if (data?.issues) {
    Object.entries(data.issues).forEach(([key, value]) => {
      const label = key
        .replace("is_", "")
        .replace(/_/g, " ")
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")

      rows.push({
        indicator: label,
        value: value,
        type: "boolean",
      })
    })
  }

  if (data?.country) {
    rows.push({
      indicator: "Country",
      value: data.country,
      type: "text",
    })
  }

  if (data?.city) {
    rows.push({
      indicator: "City",
      value: data.city,
      type: "text",
    })
  }

  if (!rows.length) {
    return <div className="text-center py-8 text-slate-400">No indicators available</div>
  }

  const renderValue = (row: any) => {
    if (row.type === "score") {
      const score = Number(row.value) || 0
      let variant: "default" | "secondary" | "destructive" = "default"
      let icon = CheckCircle

      if (score >= 70) {
        variant = "destructive"
        icon = XCircle
      } else if (score >= 40) {
        variant = "secondary"
        icon = AlertTriangle
      }

      return (
        <div className="flex items-center gap-2">
          <span className="text-white font-medium">{score}</span>
          <Badge variant={variant} className="text-xs">
            {icon === XCircle ? "High" : icon === AlertTriangle ? "Medium" : "Low"}
          </Badge>
        </div>
      )
    }

    if (row.type === "boolean") {
      return (
        <div className="flex items-center gap-2">
          {row.value === true ? (
            <>
              <XCircle className="h-4 w-4 text-red-400" />
              <span className="text-red-400">Yes</span>
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span className="text-green-400">No</span>
            </>
          )}
        </div>
      )
    }

    return <span className="text-white">{String(row.value)}</span>
  }

  return (
    <div className="space-y-3">
      {rows.map((row, index) => (
        <div key={index} className="flex justify-between items-center py-2 border-b border-slate-700 last:border-b-0">
          <span className="text-slate-300 text-sm">{row.indicator}</span>
          {renderValue(row)}
        </div>
      ))}
    </div>
  )
}
