"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { ModeToggle } from "@/components/global/theme-switcher"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, MapPin, ArrowRight, PlaneLanding } from "lucide-react"

interface NavItem {
  label: string
  href: string
  icon?: React.ReactNode
}

interface FloatHeaderProps {
  navItems: NavItem[]
}

export function FloatHeader({ navItems }: FloatHeaderProps) {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [flightPlan, setFlightPlan] = React.useState("")
  const [showFlightInput, setShowFlightInput] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleFlightPlanSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Flight plan submitted:", flightPlan)
    // Here you would handle the flight plan submission
  }

  return (
    <div className="z-40 fixed left-0 right-0 top-4 px-4">
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className={cn(
          "mx-auto max-w-5xl backdrop-blur-xl transition-all duration-300 rounded-full",
          "border border-primary/20 bg-gradient-to-br from-primary/5 via-background/80 to-background/80 shadow-lg", 
          isScrolled ? "py-1.5" : "py-2"
        )}
      >
        <div className="flex items-center justify-between px-3 sm:px-4">
          <Link href="/" className="font-semibold flex items-center gap-2 text-foreground hover:text-primary transition-colors">
            <PlaneLanding size={18} className="text-primary" />
            Aviation Weather
          </Link>
          
          <nav className="hidden md:block">
            <ul className="flex items-center gap-0.5">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "relative flex items-center justify-center rounded-full px-3 py-1.5 text-sm transition-colors duration-200 ease-out",
                        isActive 
                          ? "font-medium text-teal-700 dark:text-teal-300 bg-teal-500/20 dark:bg-teal-500/15 ring-1 ring-inset ring-teal-500/30 shadow-md shadow-teal-500/10"
                          : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">

            <div className="md:hidden">
              <MobileNav navItems={navItems} />
            </div>
            <ModeToggle />
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function MobileNav({ navItems }: { navItems: NavItem[] }) {
  const [open, setOpen] = React.useState(false)
  const pathname = usePathname()
  
  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="p-1.5 rounded-md"
        aria-label="Toggle navigation menu"
      >
        <svg 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
        >
          <path 
            d="M3 12H21M3 6H21M3 18H21" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </button>
      
      {open && (
        <div className="absolute top-full right-0 mt-2 p-2 rounded-lg bg-background/95 backdrop-blur-sm border shadow-lg w-48">
          <nav>
            <ul className="flex flex-col gap-0.5">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "block px-3 py-1.5 text-sm rounded-md",
                        isActive 
                          ? "text-primary font-medium bg-primary/10" 
                          : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                      )}
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>
      )}
    </div>
  )
} 