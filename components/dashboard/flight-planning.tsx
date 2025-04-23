"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PlaneTakeoff, PlaneLanding, MapPin, ArrowRight, SendHorizonal, ExternalLink, History } from "lucide-react"

// Interface for recent route data
export interface RecentRoute {
  id: number | string;
  from: string;
  to: string;
  via?: string;
  date: string;
}

// Interface for component props
interface FlightPlanningProps {
  recentRoutes: RecentRoute[];
}

export function FlightPlanning({ recentRoutes }: FlightPlanningProps) {
  const [departure, setDeparture] = React.useState("");
  const [destination, setDestination] = React.useState("");
  const [waypoints, setWaypoints] = React.useState(""); // Optional waypoints as string

  const handlePlanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!departure || !destination) {
      // Add validation feedback
      console.error("Departure and Destination are required.");
      return;
    }
    // Construct query string for briefing page
    // Assuming altitude is handled on briefing/plan page or fetched
    // Simple example: KPHX;KPSP;KLAX - no altitudes here
    const routeParts = [departure, ...(waypoints ? waypoints.split(" ").filter(Boolean) : []), destination];
    const routeQuery = routeParts.join(';'); 
    // Navigate using window.location or preferably next/link if possible from here
    window.location.href = `/briefing?route=${routeQuery}`; // Simple redirect for demo
    console.log("Planning route:", routeQuery);
  };

  // Function to create briefing link for recent routes
  const createBriefingLink = (route: RecentRoute): string => {
    const routeParts = [route.from, ...(route.via ? route.via.split(" ").filter(Boolean) : []), route.to];
    // Assuming default/no altitude for dashboard links
    const routeQuery = routeParts.join(';'); // Simplified for dashboard link
    return `/briefing?route=${routeQuery}`;
  };

  return (
    <Card className="h-full shadow-sm border-violet-500/20 bg-gradient-to-br from-violet-500/5 via-background to-background rounded-xl overflow-hidden flex flex-col">
      <CardHeader className="px-5 py-3 border-b border-violet-500/10">
        <CardTitle className="text-base font-medium text-violet-800 dark:text-violet-300">Flight Planning</CardTitle>
      </CardHeader>
      <CardContent className="p-5 flex-grow flex flex-col gap-5">
        {/* Plan New Route Form */}
        <form onSubmit={handlePlanSubmit} className="space-y-3">
          <h3 className="text-sm font-semibold mb-1.5">Plan a New Route</h3>
          <div className="flex items-center gap-2">
            <Label htmlFor="departure" className="sr-only">Departure</Label>
            <PlaneTakeoff className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <Input 
              id="departure"
              placeholder="Departure (KPHX)" 
              value={departure}
              onChange={(e) => setDeparture(e.target.value.toUpperCase())}
              className="h-9 text-sm"
              maxLength={4}
              required
            />
            <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <Label htmlFor="destination" className="sr-only">Destination</Label>
            <Input 
              id="destination"
              placeholder="Destination (KLAX)" 
              value={destination}
              onChange={(e) => setDestination(e.target.value.toUpperCase())}
              className="h-9 text-sm"
              maxLength={4}
              required
            />
             <Button type="submit" size="icon" className="h-9 w-9 flex-shrink-0">
               <SendHorizonal className="h-4 w-4" />
             </Button>
          </div>
           <div className="relative">
            <Label htmlFor="waypoints" className="sr-only">Waypoints</Label>
             <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              id="waypoints"
              placeholder="Waypoints (optional, space-separated)" 
              value={waypoints}
              onChange={(e) => setWaypoints(e.target.value.toUpperCase())}
              className="h-9 text-sm pl-8"
            />
           </div>
        </form>

        {/* Recent Routes List */}
        <div className="flex-grow flex flex-col">
          <h3 className="text-sm font-semibold mb-1.5 flex items-center">
            <History className="h-4 w-4 mr-1.5 text-muted-foreground"/> Recent Routes
          </h3>
          {recentRoutes.length > 0 ? (
            <ScrollArea className="flex-grow -mr-3 pr-3"> 
              <div className="space-y-2">
                {recentRoutes.map((route) => (
                  <Link
                    key={route.id}
                    href={createBriefingLink(route)}
                    className="block p-2.5 rounded-md bg-violet-500/5 hover:bg-violet-500/10 border border-violet-500/10 transition-colors"
                  >
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1.5 font-medium">
                        <span>{route.from}</span>
                        <ArrowRight className="h-3.5 w-3.5 text-violet-400" />
                        {route.via && (
                          <><span className="text-xs text-muted-foreground">({route.via})</span><ArrowRight className="h-3.5 w-3.5 text-violet-400" /></>
                        )}
                        <span>{route.to}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{route.date}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <p className="text-sm text-muted-foreground italic text-center py-4">No recent routes saved.</p>
          )}
        </div>
      </CardContent>
       {/* Link to Full Planning Page */}
       <div className="p-3 border-t border-violet-500/10 mt-auto bg-background/30">
        <Button asChild size="sm" variant="outline" className="w-full h-8 text-xs border-violet-500/30 text-violet-700 dark:text-violet-300 hover:bg-violet-500/10 hover:text-violet-800 dark:hover:text-violet-200">
          <Link href="/plan">
             View All Saved Routes / Plan New <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
          </Link>
        </Button>
      </div>
    </Card>
  );
} 