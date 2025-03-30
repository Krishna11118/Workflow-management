import { Handle, Position } from "reactflow"

export default function EndNode({ data }: { data: any }) {
  return (
    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-500 text-white font-medium">
      <div>{data.label}</div>
      <Handle type="target" position={Position.Top} id="a" style={{ background: "#555" }} />
    </div>
  )
}

