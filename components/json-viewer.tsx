"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

interface JsonViewerProps {
  data: any
}

export function JsonViewer({ data }: JsonViewerProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(data, null, 2))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">JSON Response</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={copyToClipboard}
          className="border-slate-600 text-white hover:bg-slate-700 bg-transparent"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 mr-2" />
              Copy JSON
            </>
          )}
        </Button>
      </div>

      <div className="bg-slate-900 rounded-lg p-4 max-h-96 overflow-auto">
        <JsonNode data={data} level={0} />
      </div>
    </div>
  )
}

function JsonNode({ data, level }: { data: any; level: number }) {
  const [isExpanded, setIsExpanded] = useState(level < 2)

  if (data === null) {
    return <span className="text-slate-400">null</span>
  }

  if (typeof data === "boolean") {
    return <span className="text-blue-400">{data.toString()}</span>
  }

  if (typeof data === "number") {
    return <span className="text-green-400">{data}</span>
  }

  if (typeof data === "string") {
    return <span className="text-yellow-400">"{data}"</span>
  }

  if (Array.isArray(data)) {
    if (data.length === 0) {
      return <span className="text-slate-400">[]</span>
    }

    return (
      <div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center text-slate-300 hover:text-white"
        >
          {isExpanded ? <ChevronDown className="h-4 w-4 mr-1" /> : <ChevronRight className="h-4 w-4 mr-1" />}
          <span className="text-slate-400">[{data.length}]</span>
        </button>
        {isExpanded && (
          <div className="ml-4 border-l border-slate-700 pl-4 mt-1">
            {data.map((item, index) => (
              <div key={index} className="py-1">
                <span className="text-slate-500 mr-2">{index}:</span>
                <JsonNode data={item} level={level + 1} />
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  if (typeof data === "object") {
    const keys = Object.keys(data)
    if (keys.length === 0) {
      return <span className="text-slate-400">{"{}"}</span>
    }

    return (
      <div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center text-slate-300 hover:text-white"
        >
          {isExpanded ? <ChevronDown className="h-4 w-4 mr-1" /> : <ChevronRight className="h-4 w-4 mr-1" />}
          <span className="text-slate-400">
            {"{"}
            {keys.length}
            {"}"}
          </span>
        </button>
        {isExpanded && (
          <div className="ml-4 border-l border-slate-700 pl-4 mt-1">
            {keys.map((key) => (
              <div key={key} className="py-1">
                <span className="text-purple-400 mr-2">"{key}":</span>
                <JsonNode data={data[key]} level={level + 1} />
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  return <span className="text-slate-400">{String(data)}</span>
}
