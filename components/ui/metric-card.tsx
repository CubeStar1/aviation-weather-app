import * as React from "react"
import { cn } from "@/lib/utils"

interface MetricCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  value: string | number
  unit?: string
  icon?: React.ReactNode
  colorScheme?: "blue" | "green" | "yellow" | "orange" | "purple" | "default"
}

export function MetricCard({
  title,
  value,
  unit,
  icon,
  colorScheme = "default",
  className,
  ...props
}: MetricCardProps) {
  const getColorScheme = () => {
    switch (colorScheme) {
      case "blue":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/30"
      case "green":
        return "bg-green-500/10 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800/30"
      case "yellow":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800/30"
      case "orange":
        return "bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800/30"
      case "purple":
        return "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/30"
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800/30"
    }
  }

  return (
    <div
      className={cn(
        "flex items-center p-3 rounded-lg border shadow-sm",
        getColorScheme(),
        className
      )}
      {...props}
    >
      {icon && (
        <div className="mr-3">
          {icon}
        </div>
      )}
      <div>
        <p className="text-xs font-medium opacity-75">{title}</p>
        <div className="flex items-baseline">
          <span className="text-xl font-bold">{value}</span>
          {unit && <span className="text-xs ml-1 opacity-75">{unit}</span>}
        </div>
      </div>
    </div>
  )
}

interface MetricGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  children: React.ReactNode
}

export function MetricGroup({ title, children, className, ...props }: MetricGroupProps) {
  return (
    <div className={cn("space-y-3", className)} {...props}>
      {title && <h3 className="text-sm font-medium">{title}</h3>}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {children}
      </div>
    </div>
  )
} 