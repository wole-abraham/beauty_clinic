import { cn } from "../../lib/utils"

export function Card({ className, children, ...props }) {
  return (
    <div className={cn("rounded-2xl border border-gray-100 bg-white shadow-sm", className)} {...props}>
      {children}
    </div>
  )
}

export function CardHeader({ className, children }) {
  return <div className={cn("border-b border-gray-100 px-6 py-4", className)}>{children}</div>
}

export function CardBody({ className, children }) {
  return <div className={cn("px-6 py-5", className)}>{children}</div>
}
