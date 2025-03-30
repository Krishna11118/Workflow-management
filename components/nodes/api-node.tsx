import { Handle, Position } from "reactflow"
import { CheckCircle2, AlertCircle } from "lucide-react"

export default function ApiNode({ data }: { data: any }) {
  return (
    <div className="relative flex items-center justify-center w-40 h-12 rounded bg-white border-2 border-gray-200 font-medium">
      {data.status === "success" && (
        <div className="absolute -top-1 -right-1 bg-white rounded-full">
          <CheckCircle2 className="h-5 w-5 text-green-500" />
        </div>
      )}
      {data.status === "error" && (
        <div className="absolute -top-1 -right-1 bg-white rounded-full">
          <AlertCircle className="h-5 w-5 text-red-500" />
        </div>
      )}
      <div>{data.label}</div>
      <Handle type="target" position={Position.Top} id="a" style={{ background: "#555" }} />
      <Handle type="source" position={Position.Bottom} id="b" style={{ background: "#555" }} />
    </div>
  )
}

