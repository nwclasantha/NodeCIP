"use client"

import { useMemo } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"

interface AnalysisChartProps {
  data: any
}

export function AnalysisChart({ data }: AnalysisChartProps) {
  const chartData = useMemo(() => {
    const items = []

    if (data?.score) {
      if (data.score.inbound !== undefined) {
        items.push({
          name: "Inbound Risk",
          value: Number(data.score.inbound) || 0,
          color: "#ef4444",
        })
      }
      if (data.score.outbound !== undefined) {
        items.push({
          name: "Outbound Risk",
          value: Number(data.score.outbound) || 0,
          color: "#f97316",
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

        items.push({
          name: label,
          value: value === true ? 100 : 0,
          color: value === true ? "#dc2626" : "#16a34a",
        })
      })
    }

    return items
  }, [data])

  if (!chartData.length) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-400">No data available for visualization</div>
    )
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} angle={-45} textAnchor="end" height={80} />
          <YAxis stroke="#9ca3af" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1f2937",
              border: "1px solid #374151",
              borderRadius: "6px",
              color: "#f9fafb",
            }}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
