import { motion } from "framer-motion"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

const features = [
  {
    title: "Flight Planning Interface",
    description: "Plan your flight route with multiple waypoints and altitudes using our intuitive interface. Enter ICAO codes and altitudes to create your flight plan.",
    image: "/images/light/aw-plan-light.png",
    darkImage: "/images/dark/aw-plan-dark.png",
    alt: "Flight planning interface",
  },
  {
    title: "METAR Reports",
    description: "Access detailed METAR reports for each waypoint, providing crucial information about current weather conditions at airports along your route.",
    image: "/images/light/aw-brief-metar-light.png",
    darkImage: "/images/dark/aw-brief-metar-dark.png",
    alt: "METAR reports display",
  },
  {
    title: "SIGMET Alerts",
    description: "Stay informed about significant meteorological conditions that could affect your flight safety with real-time SIGMET alerts.",
    image: "/images/light/aw-brief-sigmet-light.png",
    darkImage: "/images/dark/aw-brief-sigmet-dark.png",
    alt: "SIGMET alerts interface",
  },
  {
    title: "PIREP Information",
    description: "View pilot reports (PIREPs) from other aircraft to get real-world weather conditions and turbulence reports along your route.",
    image: "/images/light/aw-brief-pirep-light.png",
    darkImage: "/images/dark/aw-breif-pirep-dark.png",
    alt: "PIREP information display",
  },
  {
    title: "AI-Powered Weather Summary",
    description: "Get intelligent summaries of weather conditions, potential hazards, and flight recommendations powered by advanced AI analysis.",
    image: "/images/light/aw-brief-ai-light.png",
    darkImage: "/images/dark/aw-brief-ai-dark.png",
    alt: "AI weather summary",
  },
  {
    title: "Voice Assistant",
    description: "Get real-time weather briefings and flight recommendations using our voice assistant.",
    image: "/images/light/aw-voice-light.png",
    darkImage: "/images/dark/aw-voice-dark.png",
    alt: "Voice assistant interface",
  },
  {
    title: "Interactive Weather Map",
    description: "Visualize your flight path with weather overlays, showing precipitation, clouds, winds, and VFR/IFR conditions along your route.",
    image: "/images/light/aw-map-light.png",
    darkImage: "/images/dark/aw-map-dark.png",
    alt: "Interactive weather map",
  },
  {
    title: "Flight Dashboard",
    description: "Access all your flight information, weather briefings, and route details in one comprehensive dashboard view.",
    image: "/images/light/aw-dash-light.png",
    darkImage: "/images/dark/aw-dash-dark.png",
    alt: "Flight dashboard overview",
  }
]

export function AdminDashboard() {
  return (
    <section className="py-20 sm:py-24 lg:py-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          Powerful{" "}
          <span className="bg-gradient-to-r from-[#38bdf8] via-[#2dd4bf] to-[#0070F3] bg-clip-text text-transparent">
            Weather Tools
          </span>
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
          Everything you need for comprehensive flight weather briefing and analysis
        </p>
      </motion.div>

      <div className="mt-16 grid grid-cols-1 gap-16 sm:gap-24">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`flex flex-col gap-8 lg:items-center ${
              index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
            }`}
          >
            {/* Text Content */}
            <div className="flex-1 space-y-4">
              <motion.div
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <h3 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  {feature.title}
                </h3>
                <p className="mt-4 text-lg leading-8 text-muted-foreground">
                  {feature.description}
                </p>
                <div className="mt-6">
                  <button className="group inline-flex items-center gap-2 text-sm font-semibold text-primary">
                    Learn more
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </motion.div>
            </div>

            {/* Image */}
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="relative rounded-2xl bg-gradient-to-b from-muted/50 to-muted p-2 ring-1 ring-foreground/10 backdrop-blur-3xl dark:from-muted/30 dark:to-background/80"
              >
                <div className="block dark:hidden">
                  <Image
                    src={feature.image}
                    alt={feature.alt}
                    width={600}
                    height={400}
                    quality={100}
                    className="rounded-xl shadow-2xl ring-1 ring-foreground/10 transition-all duration-300"
                  />
                </div>
                <div className="hidden dark:block">
                  <Image
                    src={feature.darkImage}
                    alt={feature.alt}
                    width={600}
                    height={400}
                    quality={100}
                    className="rounded-xl shadow-2xl ring-1 ring-foreground/10 transition-all duration-300"
                  />
                </div>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/20 via-transparent to-purple-500/20 opacity-0 transition-opacity duration-300 hover:opacity-100" />
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
} 