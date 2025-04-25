import React from 'react'
import dynamic from 'next/dynamic'
import { BriefingApiResponse } from '@/lib/fetchers/briefing'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MapPin, AlertTriangle, ArrowUpRight, Clock, Map } from 'lucide-react'
import { format } from 'date-fns'

// Dynamically import the map component to prevent SSR issues
const DynamicBriefingMapDisplay = dynamic(
  () => import('./briefing-map-display').then(mod => mod.BriefingMapDisplay),
  { 
    loading: () => (
      <div className="h-full flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <Map className="h-8 w-8 mx-auto mb-2 text-blue-500/30 animate-pulse" />
          <p className="text-xs">Loading map...</p>
        </div>
      </div>
    ),
    ssr: false 
  }
)

function formatAltitude(altitude: number | null): string {
  if (!altitude) return 'Unknown';
  return `FL${Math.round(altitude/100)}`;
}

function formatTime(timestamp: number): string {
  return format(new Date(timestamp * 1000), 'HH:mm');
}

interface MapTabProps {
  briefing: BriefingApiResponse;
}

export function MapTab({ briefing }: MapTabProps) {
  // Filter waypoints with valid coordinates
  const validWaypoints = briefing.waypoints.filter(wp => wp.coords && wp.coords.length === 2);

  // Get SIGMET polygons with coords field instead of area and valid altitude information
  const sigmetPolygons = briefing.airsigmets?.filter(sigmet => 
    sigmet.coords && 
    Array.isArray(sigmet.coords) && 
    sigmet.coords.length > 2 &&
    sigmet.altitudeHi1 !== null && 
    sigmet.altitudeHi1 !== undefined
  ) || [];

  // Get intersecting SIGMETs from legs
  const intersectingSigmets = new Set(
    briefing.legs
      .flatMap(leg => leg.intersecting_sigmets)
      .map(sigmet => sigmet.airSigmetId)
  );

  if (validWaypoints.length < 2) {
    return (
      <div className="h-[calc(100vh-26rem)] bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-900/20 dark:to-blue-900/20 rounded-lg flex items-center justify-center border border-dashed">
        <p className="text-sm text-muted-foreground text-center px-4">
          Need at least two waypoints with coordinates to display map route.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="md:col-span-3">
        <div className="h-[calc(100vh-26rem)] w-full rounded-lg overflow-hidden border">
          <DynamicBriefingMapDisplay briefing={briefing} />
        </div>
      </div>

      <div className="md:col-span-1">
        <ScrollArea className="h-[calc(100vh-26rem)]">
          <div className="space-y-4 pr-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <MapPin className="h-4 w-4 mr-1.5 text-blue-500"/>
                  Route Waypoints
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-sm space-y-1">
                  {validWaypoints.map((wp, idx) => (
                    <div key={idx} className="flex items-center text-xs">
                      <span className="text-muted-foreground">{idx + 1}.</span>
                      <span className="ml-1.5 font-medium">{wp.id}</span>
                      {wp.alt_ft && (
                        <span className="ml-1.5 text-muted-foreground">FL{Math.round(wp.alt_ft/100)}</span>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {sigmetPolygons.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-1.5 text-red-500"/>
                    Active SIGMETs
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-sm space-y-4">
                    {sigmetPolygons.map((sigmet, idx) => {
                      const isIntersecting = intersectingSigmets.has(sigmet.airSigmetId);
                      return (
                        <div key={idx} className="text-xs space-y-1 pb-3 last:pb-0 border-b last:border-0">
                          <div className="flex items-start justify-between">
                            <div className="font-medium flex items-center">
                              {isIntersecting && (
                                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5" />
                              )}
                              {sigmet.hazard} {sigmet.alphaChar && `(${sigmet.alphaChar})`}
                            </div>
                            <div className="flex items-center text-muted-foreground">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatTime(sigmet.validTimeTo)}Z
                            </div>
                          </div>
                          <div className="flex items-center gap-x-3 text-muted-foreground">
                            <div className="flex items-center">
                              <ArrowUpRight className="h-3 w-3 mr-1" />
                              {formatAltitude(sigmet.altitudeHi1 || null)}
                            </div>
                            {sigmet.movementDir && sigmet.movementSpd && (
                              <div>{sigmet.movementDir}° @ {sigmet.movementSpd}kt</div>
                            )}
                          </div>
                          {sigmet.simplified_summary && (
                            <div className="text-muted-foreground mt-1">{sigmet.simplified_summary}</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
} 