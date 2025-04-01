"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, Star, ChevronDown, Plus } from "lucide-react"
import toast, { Toaster } from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/components/ui/pagination"

// Mock data for workflows
const mockWorkflows = Array(15)
  .fill(null)
  .map((_, index) => ({
    id: `#${494 + index}`,
    name: "Workflow Name here...",
    lastEdited: "Zubin Khanna | 22:43 IST - 28/05",
    description: "Some Description Here Regarding The Flow..",
    status: index % 3 === 0 ? "passed" : "failed",
    executions: [
      { date: "28/05 - 22:43 IST", status: index % 2 === 0 ? "passed" : "failed" },
      { date: "28/05 - 22:43 IST", status: "failed" },
      { date: "28/05 - 22:43 IST", status: index % 2 === 0 ? "passed" : "failed" },
    ],
  }))

export default function Dashboard() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [workflows, setWorkflows] = useState(mockWorkflows)
  const [filteredWorkflows, setFilteredWorkflows] = useState(mockWorkflows)
  const [currentPage, setCurrentPage] = useState(1)
  const [expandedWorkflow, setExpandedWorkflow] = useState<string | null>(null)
  const [executeDialog, setExecuteDialog] = useState(false)
  const [selectedWorkflow, setSelectedWorkflow] = useState<any>(null)

  const itemsPerPage = 8
  const totalPages = Math.ceil(filteredWorkflows.length / itemsPerPage)

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem("user") || sessionStorage.getItem("user")
    if (!user) {
      router.push("/")
      return
    }

  }, [router])

  useEffect(() => {
    // Filter workflows based on search term
    const filtered = workflows.filter(
      (workflow) =>
        workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        workflow.id.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredWorkflows(filtered)
    setCurrentPage(1) // Reset to first page when search changes
  }, [searchTerm, workflows])

  const handleExecute = (workflow: any) => {
    setSelectedWorkflow(workflow)
    setExecuteDialog(true)
  }

  const confirmExecution = () => {
    // Simulate execution
    setExecuteDialog(false)
    toast.success(`Executing workflow: ${selectedWorkflow.name}`)
  }

  const handleEdit = (workflowId: string) => {
    router.push(`/workflow-editor/${workflowId}`)
  }

  const toggleExpand = (workflowId: string) => {
    if (expandedWorkflow === workflowId) {
      setExpandedWorkflow(null)
    } else {
      setExpandedWorkflow(workflowId)
    }
  }

  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredWorkflows.slice(startIndex, endIndex)
  }

  return (
    <div className="container mx-auto py-4 px-4 md:py-8 md:px-6">
      <Toaster position="top-right" />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Workflow Builder</h1>
        <Button
          onClick={() => router.push("/workflow-editor/new")}
          className="flex items-center gap-2 whitespace-nowrap"
        >
          <Plus size={16} />
          Create New Process
        </Button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input
          placeholder="Search By Workflow Name/ID"
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="grid grid-cols-12 gap-2 md:gap-4 p-4 bg-gray-100 font-medium text-sm md:text-base">
          <div className="col-span-3">Workflow Name</div>
          <div className="col-span-1">ID</div>
          <div className="col-span-3 hidden md:block">Last Edited On</div>
          <div className="col-span-3 hidden md:block">Description</div>
          <div className="col-span-8 md:col-span-2 text-right">Actions</div>
        </div>

        <div className="divide-y">
          {getCurrentPageItems().map((workflow, index) => (
            <div key={index} className="divide-y">
              <div className="grid grid-cols-12 gap-2 md:gap-4 p-4 items-center text-sm md:text-base">
                <div className="col-span-3 font-medium truncate">{workflow.name}</div>
                <div className="col-span-1 text-gray-600 truncate">{workflow.id}</div>
                <div className="col-span-3 text-gray-600 text-xs md:text-sm hidden md:block truncate">
                  {workflow.lastEdited}
                </div>
                <div className="col-span-3 text-gray-600 text-xs md:text-sm hidden md:block truncate">
                  {workflow.description}
                </div>
                <div className="col-span-8 md:col-span-2 flex justify-end items-center gap-1 md:gap-2">
                  <Star className="text-gray-400 cursor-pointer hover:text-yellow-400" size={18} />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleExecute(workflow)}
                    className="text-blue-600 hover:text-blue-800 px-1 md:px-3"
                  >
                    Execute
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(workflow.id)}
                    className="text-blue-600 hover:text-blue-800 px-1 md:px-3"
                  >
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => toggleExpand(workflow.id)} className="p-0 h-auto">
                    <ChevronDown
                      size={18}
                      className={`transition-transform ${expandedWorkflow === workflow.id ? "rotate-180" : ""}`}
                    />
                  </Button>
                </div>
              </div>

              {expandedWorkflow === workflow.id && (
                <div className="bg-gray-50 p-4 pl-8 md:pl-16">
                  <div className="md:hidden mb-4">
                    <p className="text-xs text-gray-600 mb-1">{workflow.lastEdited}</p>
                    <p className="text-xs text-gray-600">{workflow.description}</p>
                  </div>
                  <h4 className="font-medium mb-2 text-sm">Execution History</h4>
                  <div className="space-y-2">
                    {workflow.executions.map((execution: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="text-xs md:text-sm text-gray-600">{execution.date}</span>
                        <Badge variant={execution.status === "passed" ? "success" : "destructive"}>
                          {execution.status === "passed" ? "Passed" : "Failed"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <Pagination className="mt-6">
        <PaginationContent>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <PaginationItem key={page}>
              <PaginationLink isActive={page === currentPage} onClick={() => setCurrentPage(page)}>
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}
        </PaginationContent>
      </Pagination>

      <Dialog open={executeDialog} onOpenChange={setExecuteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are You Sure You Want To Execute The Process '{selectedWorkflow?.name}'?</DialogTitle>
            <DialogDescription>You Cannot Undo This Step</DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setExecuteDialog(false)}>
              No
            </Button>
            <Button onClick={confirmExecution}>Yes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

