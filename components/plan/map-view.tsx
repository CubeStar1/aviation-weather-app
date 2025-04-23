"use client"

import * as React from "react"
import { Map } from "lucide-react"
import { BriefingApiResponse } from "@/lib/fetchers/briefing"

interface MapViewProps {
  waypoints: BriefingApiResponse['waypoints'];
  sigmets: BriefingApiResponse['airsigmets'];
  // Add other data needed for map, e.g., PIREPs
}

export function MapView({ waypoints, sigmets }: MapViewProps) {
  // TODO: Implement actual map using a library like Leaflet, Mapbox GL JS, or Google Maps
  // - Plot waypoints (using waypoint.coords)
  // - Draw flight path legs
  // - Draw SIGMET polygons (using sigmet.area)
  // - Optionally plot PIREPs etc.
  
  return (
    <div className="h-full bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-900/20 dark:to-blue-900/20 rounded-lg flex items-center justify-center border border-dashed">
        <p className="text-sm text-muted-foreground text-center px-4">
            <Map className="h-8 w-8 mx-auto mb-2 text-primary/50"/>
            Interactive map visualization coming soon!
            {/* Display basic info for testing */} 
            {/* <span className="text-xs block mt-2">Waypoints: {waypoints.length}, SIGMETs: {sigmets.length}</span> */}
        </p>
    </div>
  );
} 