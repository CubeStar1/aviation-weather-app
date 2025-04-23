"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MountainSnow, CloudSun } from "lucide-react"
import { BriefingApiResponse } from "@/lib/fetchers/briefing"

const getConditionBadgeClass = (condition?: string | null) => {
  switch (condition?.toUpperCase()) {
    case "VFR": return "border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-400";
    case "MVFR": return "border-blue-500/50 bg-blue-500/10 text-blue-700 dark:text-blue-400";
    case "IFR": return "border-orange-500/50 bg-orange-500/10 text-orange-700 dark:text-orange-400";
    case "LIFR": return "border-red-500/50 bg-red-500/10 text-red-700 dark:text-red-400";
    default: return "border-gray-500/50 bg-gray-500/10 text-gray-600 dark:text-gray-400";
  }
}

interface WaypointListProps {
  waypoints: BriefingApiResponse['waypoints'];
  metarData: BriefingApiResponse['metar'];
}

export function WaypointList({ waypoints, metarData }: WaypointListProps) {
  
  const waypointsWithMetar = waypoints.map(wp => ({
    ...wp,
    metar: metarData[wp.id] || { raw: "METAR data not available", error: "Not found" } // Add default/error handling
  }));

  return (
    <ScrollArea className="h-[calc(100vh-23rem)] pr-3">
        <div className="space-y-3">
        {waypointsWithMetar.map((waypoint, index) => (
            <Card key={waypoint.id || index} className="border shadow-sm overflow-hidden">
            <CardContent className="p-3">
                <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6 text-xs">
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                        {index + 1}
                    </AvatarFallback>
                    </Avatar>
                    <div>
                    <h3 className="font-semibold text-sm leading-tight">{waypoint.id}</h3>
                    <p className="text-xs text-muted-foreground leading-tight truncate w-40 sm:w-auto" title={waypoint.metar?.station_name || waypoint.id}>
                        {waypoint.metar?.station_name || waypoint.id}
                    </p>
                    </div>
                </div>
                 {waypoint.metar && !waypoint.metar.error && waypoint.metar.vfr_allowed !== null && (
                    <Badge variant="outline" className={`text-xs px-2 py-0.5 font-medium ${getConditionBadgeClass(waypoint.metar.vfr_allowed ? 'VFR' : 'Non-VFR')}`}> 
                        {waypoint.metar.vfr_allowed ? "VFR Allowed" : "VFR Restricted"}
                    </Badge>
                 )}
                 {waypoint.metar?.error && (
                     <Badge variant="destructive" className="text-xs px-2 py-0.5 font-medium">
                         METAR Error
                     </Badge>
                 )}
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-xs mb-2">
                <div className="flex items-center">
                    <MountainSnow className="h-3.5 w-3.5 mr-1.5 text-muted-foreground flex-shrink-0" />
                    <div>
                    <p className="text-muted-foreground">Altitude</p>
                    <p className="font-medium">{waypoint.alt_ft} ft</p>
                    </div>
                </div>
                <div className="flex items-center">
                    <CloudSun className="h-3.5 w-3.5 mr-1.5 text-muted-foreground flex-shrink-0" />
                    <div className="min-w-0">
                        <p className="text-muted-foreground">Clouds</p>
                        <p className="font-medium" title={waypoint.metar?.cloud || "N/A"}>
                            {waypoint.metar?.cloud || "N/A"}
                        </p>
                    </div>
                </div>
                </div>
                
                <div>
                <p className="text-xs text-muted-foreground mb-0.5">METAR</p>
                <p className="text-[11px] font-mono bg-muted/50 p-1.5 rounded leading-snug break-words">
                    {waypoint.metar?.raw || "N/A"}
                </p>
                </div>
                {/* TODO: Optionally display remarks, general summary etc. from waypoint.metar */} 
            </CardContent>
            </Card>
        ))}
        </div>
    </ScrollArea>
  );
} 