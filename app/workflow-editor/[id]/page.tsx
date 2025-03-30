"use client"

import type React from "react"

import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  type Connection,
  MarkerType,
  Panel,
} from "reactflow"
import "reactflow/dist/style.css"
import { ArrowLeft, Save, Plus, Undo, Redo, ZoomIn, ZoomOut, X } from "lucide-react"
import toast, { Toaster } from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { NodeConfigPanel } from "@/components/node-config-panel"

// Node types
import StartNode from "@/components/nodes/start-node"
import EndNode from "@/components/nodes/end-node"
import ApiNode from "@/components/nodes/api-node"
import EmailNode from "@/components/nodes/email-node"
import TextBoxNode from "@/components/nodes/text-box-node"

// Define node types
const nodeTypes = {
  start: StartNode,
  end: EndNode,
  api: ApiNode,
  email: EmailNode,
  textBox: TextBoxNode,
}

export default function WorkflowEditor({ params }: { params: { id: string } }) {
  const router = useRouter()
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null)
  const [saveDialog, setSaveDialog] = useState(false)
  const [workflowName, setWorkflowName] = useState("Untitled")
  const [workflowDescription, setWorkflowDescription] = useState("")
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [workflowStatus, setWorkflowStatus] = useState<"draft" | "passed" | "failed">("draft")
  const [isMobileConfigOpen, setIsMobileConfigOpen] = useState(false)

  // Initialize workflow with start and end nodes
  useEffect(() => {
    if (params.id === "new") {
      // Create a new workflow with start and end nodes
      const initialNodes: Node[] = [
        {
          id: "start",
          type: "start",
          data: { label: "Start" },
          position: { x: 250, y: 50 },
        },
        {
          id: "end",
          type: "end",
          data: { label: "End" },
          position: { x: 250, y: 350 },
        },
      ]

      setNodes(initialNodes)
    } else {
      // Load existing workflow (mock data for now)
      // In a real app, you would fetch this from your backend
      const mockNodes: Node[] = [
        {
          id: "start",
          type: "start",
          data: { label: "Start", status: "success" },
          position: { x: 250, y: 50 },
        },
        {
          id: "api1",
          type: "api",
          data: {
            label: "API Call",
            status: "success",
            config: {
              method: "GET",
              url: "https://api.example.com/data",
              headers: [{ name: "Content-Type", value: "application/json" }],
              body: '{ "query": "example" }',
            },
          },
          position: { x: 250, y: 150 },
        },
        {
          id: "email1",
          type: "email",
          data: {
            label: "Email",
            status: params.id === "failed" ? "error" : "success",
            config: {
              email: "user@example.com",
              message: "This is a test email from the workflow system.",
            },
          },
          position: { x: 250, y: 250 },
        },
        {
          id: "end",
          type: "end",
          data: { label: "End" },
          position: { x: 250, y: 350 },
        },
      ]

      const mockEdges: Edge[] = [
        {
          id: "e-start-api1",
          source: "start",
          target: "api1",
          markerEnd: { type: MarkerType.ArrowClosed },
        },
        {
          id: "e-api1-email1",
          source: "api1",
          target: "email1",
          markerEnd: { type: MarkerType.ArrowClosed },
        },
        {
          id: "e-email1-end",
          source: "email1",
          target: "end",
          markerEnd: { type: MarkerType.ArrowClosed },
        },
      ]

      setNodes(mockNodes)
      setEdges(mockEdges)
      setWorkflowName("Sample Workflow")

      // Set workflow status based on the ID
      if (params.id === "failed") {
        setWorkflowStatus("failed")
      } else {
        setWorkflowStatus("passed")
      }
    }
  }, [params.id, setNodes, setEdges])

  const onConnect = useCallback(
    (connection: Edge | Connection) =>
      setEdges((eds) =>
        addEdge(
          {
            ...connection,
            markerEnd: { type: MarkerType.ArrowClosed },
          },
          eds,
        ),
      ),
    [setEdges],
  )

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = "move"
  }, [])

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault()

      if (!reactFlowWrapper.current || !reactFlowInstance) return

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect()
      const type = event.dataTransfer.getData("application/reactflow")

      // Check if the dropped element is valid
      if (typeof type === "undefined" || !type) {
        return
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      })

      const newNode: Node = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: { label: type === "api" ? "API Call" : type === "email" ? "Email" : "Text Box" },
      }

      setNodes((nds) => nds.concat(newNode))
    },
    [reactFlowInstance, setNodes],
  )

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node)
    // On mobile, open the config panel when a node is clicked
    if (window.innerWidth < 768) {
      setIsMobileConfigOpen(true)
    }
  }, [])

  const onPaneClick = useCallback(() => {
    setSelectedNode(null)
  }, [])

  const handleSave = () => {
    // In a real app, you would save to your backend
    toast.success(`Workflow "${workflowName}" saved successfully!`)
    setSaveDialog(false)
    router.push("/dashboard")
  }

  const onNodeConfigChange = useCallback(
    (nodeId: string, config: any) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === nodeId) {
            return {
              ...node,
              data: {
                ...node.data,
                config,
              },
            }
          }
          return node
        }),
      )
    },
    [setNodes],
  )

  const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType)
    event.dataTransfer.effectAllowed = "move"
  }

  return (
    <div className="h-screen flex flex-col">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.push("/dashboard")} className="flex items-center gap-1">
            <ArrowLeft size={16} />
            Go Back
          </Button>
          <h1 className="text-xl font-medium">{workflowName}</h1>
          {workflowStatus !== "draft" && (
            <Badge variant={workflowStatus === "passed" ? "success" : "destructive"}>
              {workflowStatus === "passed" ? "Passed" : "Failed"}
            </Badge>
          )}
        </div>
        <Button onClick={() => setSaveDialog(true)} className="flex items-center gap-1">
          <Save size={16} />
          Save
        </Button>
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Flow canvas */}
        <div className="flex-1 h-full" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            fitView
            snapToGrid
            snapGrid={[15, 15]}
          >
            <Background />
            <Controls showInteractive={false} />
            <MiniMap />

            <Panel position="top-right" className="flex gap-2">
              <Button variant="outline" size="icon">
                <Undo size={16} />
              </Button>
              <Button variant="outline" size="icon">
                <Redo size={16} />
              </Button>
              <Button variant="outline" size="icon">
                <ZoomIn size={16} />
              </Button>
              <Button variant="outline" size="icon">
                <ZoomOut size={16} />
              </Button>
            </Panel>

            <Panel position="top-left" className="flex flex-col gap-2 bg-white p-3 rounded-md shadow-md">
              <h3 className="font-medium mb-2">Add Components</h3>
              <div className="flex flex-col gap-2">
                <div
                  className="border rounded p-2 cursor-move bg-white flex items-center gap-2"
                  onDragStart={(e) => onDragStart(e, "api")}
                  draggable
                >
                  <Plus size={14} className="text-blue-500" />
                  API Call
                </div>
                <div
                  className="border rounded p-2 cursor-move bg-white flex items-center gap-2"
                  onDragStart={(e) => onDragStart(e, "email")}
                  draggable
                >
                  <Plus size={14} className="text-blue-500" />
                  Email
                </div>
                <div
                  className="border rounded p-2 cursor-move bg-white flex items-center gap-2"
                  onDragStart={(e) => onDragStart(e, "textBox")}
                  draggable
                >
                  <Plus size={14} className="text-blue-500" />
                  Text Box
                </div>
              </div>
            </Panel>
          </ReactFlow>
        </div>

        {/* Configuration panel - desktop */}
        {selectedNode && !isMobileConfigOpen && (
          <div className="hidden md:block w-80 border-l bg-white overflow-y-auto">
            <NodeConfigPanel
              node={selectedNode}
              onConfigChange={(config) => onNodeConfigChange(selectedNode.id, config)}
              onClose={() => setSelectedNode(null)}
            />
          </div>
        )}

        {/* Configuration panel - mobile */}
        {selectedNode && isMobileConfigOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
            <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-lg max-h-[80vh] overflow-y-auto">
              <div className="sticky top-0 bg-white p-2 border-b flex justify-end">
                <Button variant="ghost" size="sm" onClick={() => setIsMobileConfigOpen(false)}>
                  <X size={16} />
                </Button>
              </div>
              <NodeConfigPanel
                node={selectedNode}
                onConfigChange={(config) => onNodeConfigChange(selectedNode.id, config)}
                onClose={() => {
                  setSelectedNode(null)
                  setIsMobileConfigOpen(false)
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Save dialog */}
      <Dialog open={saveDialog} onOpenChange={setSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save your workflow</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>
              <Input
                id="name"
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
                placeholder="Name here"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="description"
                value={workflowDescription}
                onChange={(e) => setWorkflowDescription(e.target.value)}
                placeholder="Write here.."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

