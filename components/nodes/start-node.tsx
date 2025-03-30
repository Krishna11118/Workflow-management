import { Handle, Position } from "reactflow"
import { CheckCircle2 } from "lucide-react"

export default function StartNode({ data }: { data: any }) {
  return (
    <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-green-500 text-white font-medium">
      {data.status === "success" && (
        <div className="absolute -top-1 -right-1 bg-white rounded-full">
          <CheckCircle2 className="h-5 w-5 text-green-500" />
        </div>
      )}
      <div>{data.label}</div>
      <Handle type="source" position={Position.Bottom} id="a" style={{ background: "#555" }} />
    </div>
  )
}

