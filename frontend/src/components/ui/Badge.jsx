import { cn } from "../../lib/utils"

const colors = {
  Scheduled: "bg-green-100 text-green-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Cancelled: "bg-red-100 text-red-700",
  default: "bg-gray-100 text-gray-700",
}

export function Badge({ status, className }) {
  return (
    <span className={cn("inline-block rounded-full px-2.5 py-0.5 text-xs font-medium", colors[status] || colors.default, className)}>
      {status}
    </span>
  )
}
