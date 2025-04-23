import * as React from "react"
import { cn } from "@/lib/utils"

interface GradientCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "blue" | "orange" | "green" | "purple" | "default"
  withShadow?: boolean
  children: React.ReactNode
}

export function GradientCard({
  className,
  variant = "default",
  withShadow = true,
  children,
  ...props
}: GradientCardProps) {
  const getGradient = () => {
    switch (variant) {
      case "blue":
        return "bg-gradient-to-br from-blue-50 to-sky-100 dark:from-blue-950/40 dark:to-sky-900/30"
      case "orange":
        return "bg-gradient-to-br from-orange-50 to-amber-100 dark:from-orange-950/40 dark:to-amber-900/30"
      case "green":
        return "bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950/40 dark:to-emerald-900/30"
      case "purple":
        return "bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-950/40 dark:to-violet-900/30"
      default:
        return "bg-gradient-to-br from-gray-50 to-slate-100 dark:from-gray-950/40 dark:to-slate-900/30"
    }
  }

  return (
    <div
      className={cn(
        "rounded-xl border overflow-hidden",
        getGradient(),
        withShadow && "shadow-md",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function GradientCardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex flex-col space-y-1.5 p-4 backdrop-blur-sm backdrop-brightness-105 border-b border-b-black/5",
        className
      )}
      {...props}
    />
  )
}

export function GradientCardFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex items-center p-4 backdrop-blur-sm backdrop-brightness-105 border-t border-t-black/5", 
        className
      )}
      {...props}
    />
  )
}

export function GradientCardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "text-base font-semibold leading-none tracking-tight", 
        className
      )}
      {...props}
    />
  )
}

export function GradientCardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

export function GradientCardContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("p-4", className)}
      {...props}
    />
  )
} 