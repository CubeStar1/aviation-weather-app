"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MapPin, Mountain, ArrowRight, ExternalLink } from "lucide-react"

// Interface for a single waypoint in the current plan
export interface Waypoint {
  airport: string;
  altitude: string;
}

// Interface for component props
interface CurrentPlanDisplayProps { // Renamed interface for clarity
  currentPlanWaypoints: Waypoint[];
}

// Component is now focused on displaying the current plan
export function FlightPlanning({ currentPlanWaypoints }: CurrentPlanDisplayProps) { // Renamed props

  return (
    <Card className="h-full shadow-sm border-violet-500/20 bg-gradient-to-br from-violet-500/5 via-background to-background rounded-xl overflow-hidden flex flex-col">
      <CardHeader className="px-5 py-3 border-b border-violet-500/10">
        {/* Updated Card Title */}
        <CardTitle className="text-base font-medium text-violet-800 dark:text-violet-300 flex items-center">
           <MapPin className="h-4 w-4 mr-2"/> Current Flight Plan
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5 flex-grow flex flex-col gap-3"> {/* Simplified padding and gap */}
         {/* Display Current Waypoints List */}
         {currentPlanWaypoints.length > 0 ? (
            <ScrollArea className="flex-grow -mr-3 pr-3"> 
              <div className="space-y-2">
                {currentPlanWaypoints.map((waypoint, index) => (
                  <div
                    key={`${waypoint.airport}-${index}`}
                    className="flex items-center justify-between p-2 rounded-md bg-violet-500/5 border border-violet-500/10"
                  >
                    <div className="flex items-center gap-2 font-medium text-sm">
                       <span className="font-mono bg-violet-500/10 px-1.5 py-0.5 rounded text-xs text-violet-700 dark:text-violet-300 w-16 text-center">{waypoint.airport}</span>
                       {index < currentPlanWaypoints.length - 1 && (
                           <ArrowRight className="h-3.5 w-3.5 text-violet-400 flex-shrink-0" />
                       )}
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground gap-1">
                         <Mountain className="h-3.5 w-3.5" />
                         <span>{parseInt(waypoint.altitude).toLocaleString()} ft</span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <p className="text-sm text-muted-foreground italic text-center py-4 flex-grow flex items-center justify-center">
              No current flight plan found in storage.
            </p>
          )}
      </CardContent>
       {/* Link to Full Planning Page (Remains the same) */}
       <div className="p-3 border-t border-violet-500/10 mt-auto bg-background/30">
        <Button asChild size="sm" variant="outline" className="w-full h-8 text-xs border-violet-500/30 text-violet-700 dark:text-violet-300 hover:bg-violet-500/10 hover:text-violet-800 dark:hover:text-violet-200">
          <Link href="/plan">
             Go to Flight Plan Page <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
          </Link>
        </Button>
      </div>
    </Card>
  );
} 