import { LucideIcon } from "lucide-react"

export interface HeaderLink {
  href: string
  label: string
  icon?: LucideIcon
  description?: string
}

export interface HeaderConfig {
  brand: {
    title: string
    icon: string
  }
  navigationLinks: HeaderLink[]
}

export const headerConfig: HeaderConfig = {
  brand: {
    title: "Aviation Weather",
    icon: "/globe.svg"
  },
  navigationLinks: [
    { href: "/briefing", label: "Weather Briefing" },
    { href: "/map", label: "Weather Map" },
    { href: "/plan", label: "Flight Plan" },
  ]
}