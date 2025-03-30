"use client"

import { useState, useEffect } from "react"
import type { Node } from "reactflow"
import { X, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface NodeConfigPanelProps {
  node: Node
  onConfigChange: (config: any) => void
  onClose: () => void
}

export function NodeConfigPanel({ node, onConfigChange, onClose }: NodeConfigPanelProps) {
  const [config, setConfig] = useState<any>(node.data.config || {})

  useEffect(() => {
    setConfig(node.data.config || {})
  }, [node])

  const handleChange = (key: string, value: any) => {
    const newConfig = { ...config, [key]: value }
    setConfig(newConfig)
    onConfigChange(newConfig)
  }

  const handleHeaderChange = (index: number, field: string, value: string) => {
    const headers = [...(config.headers || [])]
    headers[index] = { ...headers[index], [field]: value }
    handleChange("headers", headers)
  }

  const addHeader = () => {
    const headers = [...(config.headers || []), { name: "", value: "" }]
    handleChange("headers", headers)
  }

  const removeHeader = (index: number) => {
    const headers = [...(config.headers || [])]
    headers.splice(index, 1)
    handleChange("headers", headers)
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium">Configuration</h3>
        <Button variant="ghost" size="icon" onClick={onClose} className="md:block hidden">
          <X size={16} />
        </Button>
      </div>

      {node.type === "api" && (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Method</label>
            <Select value={config.method || "GET"} onValueChange={(value) => handleChange("method", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GET">GET</SelectItem>
                <SelectItem value="POST">POST</SelectItem>
                <SelectItem value="PUT">PUT</SelectItem>
                <SelectItem value="DELETE">DELETE</SelectItem>
                <SelectItem value="PATCH">PATCH</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">URL</label>
            <Input
              value={config.url || ""}
              onChange={(e) => handleChange("url", e.target.value)}
              placeholder="Type here..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Headers</label>
            {(config.headers || []).map((header: any, index: number) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={header.name}
                  onChange={(e) => handleHeaderChange(index, "name", e.target.value)}
                  placeholder="Header Name"
                  className="flex-1"
                />
                <Input
                  value={header.value}
                  onChange={(e) => handleHeaderChange(index, "value", e.target.value)}
                  placeholder="Value"
                  className="flex-1"
                />
                <Button variant="ghost" size="icon" onClick={() => removeHeader(index)} className="h-10 w-10 p-0">
                  <X size={16} />
                </Button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={addHeader} className="flex items-center gap-1">
              <Plus size={14} />
              Add Header
            </Button>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Body</label>
            <Textarea
              value={config.body || ""}
              onChange={(e) => handleChange("body", e.target.value)}
              placeholder="Enter Descriptions..."
              rows={5}
            />
          </div>
        </div>
      )}

      {node.type === "email" && (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              value={config.email || ""}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="Type here..."
              type="email"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Message</label>
            <Textarea
              value={config.message || ""}
              onChange={(e) => handleChange("message", e.target.value)}
              placeholder="Enter..."
              rows={5}
            />
          </div>
        </div>
      )}

      {node.type === "textBox" && (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Content</label>
            <Textarea
              value={config.content || ""}
              onChange={(e) => handleChange("content", e.target.value)}
              placeholder="Enter text..."
              rows={8}
            />
          </div>
        </div>
      )}
    </div>
  )
}

