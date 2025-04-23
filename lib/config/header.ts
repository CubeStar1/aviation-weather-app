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
    icon: "/logos/aw-logo-2.png"
  },
  navigationLinks: [
    { href: "/plan", label: "Flight Plan" },
  ]
}