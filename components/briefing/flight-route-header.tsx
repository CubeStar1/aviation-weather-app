import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, PlaneTakeoff, ArrowRight } from "lucide-react"

import { BriefingApiResponse } from "@/lib/fetchers/briefing"

interface FlightRouteHeaderProps {
  briefing: BriefingApiResponse;
}

export function FlightRouteHeader({ briefing }: FlightRouteHeaderProps) {
  
  const getSimplifiedRoute = () => {
    if (!briefing.waypoints || briefing.waypoints.length < 2) {
      return briefing.flight_plan || "Invalid Route";
    }
    const departure = briefing.waypoints[0].id;
    const arrival = briefing.waypoints[briefing.waypoints.length - 1].id;
    return `${departure} → ${arrival}`;
  };
  
  return (
    <Card className="shadow-sm border-primary/10 bg-gradient-to-r from-primary/5 via-background to-background">
      <CardContent className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-lg font-semibold tracking-tight flex items-center">
             <PlaneTakeoff className="h-5 w-5 mr-2 text-primary"/> 
             Flight Route
          </h2>
           <p className="text-sm text-muted-foreground" title={briefing.flight_plan}>
             {getSimplifiedRoute()}
           </p>
        </div>
      </CardContent>
    </Card>
  )
} 