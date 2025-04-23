import { Metadata } from "next"
import { Header } from "@/components/global/header"
import { headerConfig } from "@/lib/config/header"
import Footer from "@/components/global/footer"
import { footerConfig } from "@/lib/config/footer"
import { FloatHeader } from "@/components/navigation/float-header"
import { cn } from "@/lib/utils"
import { DotPattern } from "@/components/magicui/dot-pattern"

const navItems = [
  {
    label: "Flight Plan",
    href: "/plan",
  },
  {
    label: "Dashboard",
    href: "/dashboard",
  },

  {
    label: "Weather Map",
    href: "/map",
  },
  {
    label: "Briefing",
    href: "/briefing",
  },
  {
    label: "Settings",
    href: "/settings",
  },
]

export const metadata: Metadata = {
  title: "Aviation Weather",
  description: "Real-time weather data for pilots",
}

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen pt-16 pb-6">
      <FloatHeader navItems={navItems} />
      <main className="h-[calc(100vh-5.5rem)]">
        {children}
        </main>
    </div>
  )
} 