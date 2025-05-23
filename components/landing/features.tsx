"use client"

import { motion } from "framer-motion"
import { Cloud, Map, Plane, MessageSquareText, Mic, BarChart, Compass, Shield, Zap } from "lucide-react"
import SectionBadge from "@/components/ui/section-badge"
import { cn } from "@/lib/utils"

const features = [
  {
    title: "Real-time Weather Data",
    info: "Access live METAR, TAF, PIREP, and SIGMET reports for any airport or waypoint in your flight plan",
    icon: Cloud,
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    title: "Interactive Weather Map",
    info: "Visualize weather patterns, flight paths, and conditions with our dynamic mapping interface",
    icon: Map,
    gradient: "from-green-500 to-emerald-500",
  },
  {
    title: "Flight Planning",
    info: "Plan your route with multiple waypoints and altitudes using standard ICAO airport identifiers",
    icon: Plane,
    gradient: "from-purple-500 to-violet-500",
  },
  {
    title: "AI-Powered Briefings",
    info: "Get intelligent summaries and analysis of weather conditions along your entire flight path",
    icon: MessageSquareText,
    gradient: "from-orange-500 to-amber-500",
  },
  {
    title: "Voice Assistant",
    info: "Hands-free weather briefings with our voice-enabled assistant for safer preflight preparation",
    icon: Mic,
    gradient: "from-red-500 to-rose-500",
  },
  {
    title: "Weather Analysis",
    info: "Detailed classification of weather activity and VFR conditions for each leg of your flight",
    icon: BarChart,
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    title: "Route Optimization",
    info: "Get suggestions for optimal routes based on current and forecasted weather conditions",
    icon: Compass,
    gradient: "from-indigo-500 to-purple-500",
  },
  {
    title: "Safety Alerts",
    info: "Receive immediate notifications about hazardous weather conditions along your route",
    icon: Shield,
    gradient: "from-yellow-500 to-orange-500",
  },
  {
    title: "Real-time Updates",
    info: "Stay informed with instant updates to weather conditions and reports during flight planning",
    icon: Zap,
    gradient: "from-pink-500 to-rose-500",
  },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export function Features() {
  return (
    <section className="py-20 sm:py-24 lg:py-32">
      <div className="text-center">
        <SectionBadge title="Features" />
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-8 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
        >
          Comprehensive Flight Weather
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground"
        >
          Everything you need for safe and informed flight planning with real-time weather data and intelligent analysis
        </motion.p>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="mt-16 grid grid-cols-1 gap-6 sm:mt-20 sm:grid-cols-2 lg:mt-24 lg:grid-cols-3"
      >
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.title}
              variants={item}
              className={cn(
                "group relative overflow-hidden rounded-2xl bg-gradient-to-b from-muted/50 to-muted p-8",
                "ring-1 ring-foreground/10 backdrop-blur-xl transition-all duration-300 hover:ring-foreground/20",
                "dark:from-muted/30 dark:to-background/80"
              )}
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br",
                  feature.gradient,
                  "ring-1 ring-foreground/10"
                )}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  {feature.title}
                </h3>
              </div>
              <p className="mt-4 text-muted-foreground">
                {feature.info}
              </p>
              <div className={cn(
                "absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r",
                feature.gradient,
                "opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              )} />
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  )
} 