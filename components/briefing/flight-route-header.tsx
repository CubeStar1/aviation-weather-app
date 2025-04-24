import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, PlaneTakeoff, ArrowRight, Navigation, Plane, CloudSun } from "lucide-react"
import { motion } from "framer-motion"

import { BriefingApiResponse } from "@/lib/fetchers/briefing"

interface FlightRouteHeaderProps {
  briefing: BriefingApiResponse;
}

// Compact pulse animation
const PulseArrow = () => (
  <div className="relative flex items-center px-0.5">
    <motion.div 
      className="absolute inset-0 rounded-full bg-primary/20"
      initial={{ scale: 0.85, opacity: 0.3 }}
      animate={{ scale: 1.15, opacity: 0 }}
      transition={{ repeat: Infinity, duration: 1.5 }}
    />
    <ArrowRight className="h-3 w-3 text-primary relative z-10" />
  </div>
);

export function FlightRouteHeader({ briefing }: FlightRouteHeaderProps) {
  const hasWeatherWarnings = briefing.airsigmets && briefing.airsigmets.length > 0;
  
  return (
    <Card className="shadow-sm border-primary/20 bg-gradient-to-br from-blue-500/5 via-background to-background overflow-hidden">
      <CardContent className="p-3">
        {/* Title and Layout Container */}
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-base font-semibold tracking-tight flex items-center text-foreground">
            <Plane className="h-4 w-4 mr-1.5 text-primary rotate-45"/> 
            Flight Briefing
          </h2>
          
          {hasWeatherWarnings && (
            <Badge variant="destructive" className="px-1.5 py-0 text-xs h-5">
              <CloudSun className="h-3 w-3 mr-1" /> Weather Alerts
            </Badge>
          )}
        </div>
          
        {/* Main Content - Single Row Layout */}
        <div className="flex items-start justify-between gap-3">
          {/* Left Side: Compact Flight Path */}
          <div className="flex-grow overflow-x-auto py-1 -ml-1 pl-1">
            <div className="flex items-center">
              {briefing.waypoints.map((waypoint, index) => {
                const isFirst = index === 0;
                const isLast = index === briefing.waypoints.length - 1;
                
                return (
                  <React.Fragment key={waypoint.id || index}>
                    {index > 0 && <PulseArrow />}
                    
                    <motion.div
                      className={`flex items-center gap-1.5 ${
                        isFirst ? 'text-green-600 dark:text-green-500' :
                        isLast ? 'text-blue-600 dark:text-blue-500' : 
                        'text-amber-600 dark:text-amber-500'
                      }`}
                      initial={{ y: 5, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1, duration: 0.2 }}
                    >
                      {/* Icon and ID */}
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center
                        ${isFirst ? 'bg-green-100 dark:bg-green-950/40 border-green-200 dark:border-green-900/50' :
                          isLast ? 'bg-blue-100 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900/50' :
                          'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/50'
                        } border shadow-sm`}
                      >
                        {isFirst ? (
                          <PlaneTakeoff className="h-3.5 w-3.5" />
                        ) : isLast ? (
                          <MapPin className="h-3.5 w-3.5" />
                        ) : (
                          <Navigation className="h-3 w-3" />
                        )}
                      </div>
                      
                      {/* Waypoint Details - Vertically stacked */}
                      <div>
                        <div className="font-medium text-xs leading-tight">{waypoint.id}</div>
                        <div className="text-[10px] leading-tight text-muted-foreground whitespace-nowrap">
                          {waypoint.alt_ft ? `${waypoint.alt_ft} ft` : ''}
                        </div>
                      </div>
                    </motion.div>
                  </React.Fragment>
                );
              })}
            </div>
          </div>
          
          {/* Right Side: Flight Info Details */}
          <div className="flex gap-3 border-l border-primary/10 pl-3 text-xs flex-shrink-0">
            <div>
              <span className="text-[10px] text-muted-foreground block">Departure</span>
              <span className="font-medium">{briefing.waypoints[0]?.id || 'N/A'}</span>
            </div>
            
            <div>
              <span className="text-[10px] text-muted-foreground block">Arrival</span>
              <span className="font-medium">{briefing.waypoints[briefing.waypoints.length - 1]?.id || 'N/A'}</span>
            </div>
            
            <div className="flex flex-col items-center px-1">
              <span className="text-[10px] text-muted-foreground block">Points</span>
              <span className="font-medium">{briefing.waypoints.length}</span>
            </div>
            
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-muted-foreground block">Notices</span>
              <span className="font-medium">{briefing.airsigmets?.length || 0}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 