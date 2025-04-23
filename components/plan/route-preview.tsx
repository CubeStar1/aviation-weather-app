"use client"

import * as React from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  Map, List, FileText, ExternalLink, Plane, MountainSnow, CloudSun,
  Info, AlertTriangle, Waves, Snowflake, Cloud, CheckCircle, CalendarDays
} from "lucide-react"
import { Waypoint } from "./flight-plan-form"

interface WaypointPreviewData extends Waypoint {
  name: string;
  weather: string;
  metar: string;
  conditions: "VFR" | "MVFR" | "IFR" | "LIFR";
}

interface BriefingSummary {
  flightConditions: string;
  sigmetAirmetSummary: string[];
  pirepSummary: string[];
  recommendations: string[];
}

interface RoutePreviewProps {
  plan: string | null;
}

const getConditionBadgeClass = (condition: string) => {
  switch (condition?.toUpperCase()) {
    case "VFR": return "border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-400";
    case "MVFR": return "border-blue-500/50 bg-blue-500/10 text-blue-700 dark:text-blue-400";
    case "IFR": return "border-orange-500/50 bg-orange-500/10 text-orange-700 dark:text-orange-400";
    case "LIFR": return "border-red-500/50 bg-red-500/10 text-red-700 dark:text-red-400";
    default: return "border-gray-500/50 bg-gray-500/10 text-gray-600 dark:text-gray-400";
  }
}

const parsePlanString = (planString: string | null): Waypoint[] => {
  if (!planString) return [];
  const parts = planString.split(',');
  const waypoints: Waypoint[] = [];
  if (parts.length < 2 || parts.length % 2 !== 0) {
    console.error("Invalid plan string format for parsing in preview:", planString);
    return []; // Return empty on invalid format
  }
  for (let i = 0; i < parts.length; i += 2) {
    waypoints.push({ airport: parts[i], altitude: parts[i+1] });
  }
  return waypoints;
}

const getPreviewData = (planString: string | null): { waypoints: WaypointPreviewData[], briefing: BriefingSummary, routeString: string } | null => {
  const plan = parsePlanString(planString);
  
  if (!plan || plan.length < 2) return null;

  console.log("Simulating fetch for parsed plan:", plan);
  const routeString = plan.map(wp => wp.airport).join(" → ");

  const waypoints: WaypointPreviewData[] = plan.map((wp, index) => ({
    ...wp,
    name: `Airport ${wp.airport}`,
    weather: `Conditions for ${wp.airport}`,
    metar: `METAR data for ${wp.airport}`,
    conditions: index % 4 === 0 ? "VFR" : index % 4 === 1 ? "MVFR" : index % 4 === 2 ? "IFR" : "LIFR",
  }));

  const briefing: BriefingSummary = {
    flightConditions: `Simulated overall conditions for ${routeString}. Moderate chop expected between ${plan[0]?.airport} and ${plan[1]?.airport}.`,
    sigmetAirmetSummary: [
      `AIRMET TANGO active for area including ${plan[0]?.airport}.`,
      `SIGMET WHISKEY reported near ${plan[plan.length - 1]?.airport}.`
    ],
    pirepSummary: [
      `PIREP near ${plan[1]?.airport || plan[0]?.airport} reports moderate turbulence.`
    ],
    recommendations: [
      "Review full briefing before departure.",
      `Exercise caution for turbulence between ${plan[0]?.airport} and ${plan[1]?.airport}.`,
      "Monitor frequency 122.8 for updates."
    ]
  };

  return { waypoints, briefing, routeString };
};

export function RoutePreview({ plan: planString }: RoutePreviewProps) {
  const previewData = React.useMemo(() => getPreviewData(planString), [planString]);

  if (!planString || !previewData) {
    return (
      <div className="h-80 flex items-center justify-center text-center text-muted-foreground text-sm border border-dashed rounded-lg bg-muted/30">
        <p>Enter a flight plan (at least Departure and Arrival)<br/>and click "Update Preview" to see route details.</p>
      </div>
    );
  }

  const { waypoints: routeWaypoints, briefing, routeString } = previewData;

  const briefingLink = `/briefing?route=${encodeURIComponent(planString || '')}`;

  return (
    <Tabs defaultValue="list" className="relative">
      <TabsList className="grid w-full grid-cols-3 gap-2 mb-4">
        <TabsTrigger value="list" className="text-xs px-3 py-1.5 h-auto data-[state=active]:shadow-sm flex items-center justify-center">
          <List className="h-3.5 w-3.5 mr-1.5" /> List View
        </TabsTrigger>
        <TabsTrigger value="map" className="text-xs px-3 py-1.5 h-auto data-[state=active]:shadow-sm flex items-center justify-center">
          <Map className="h-3.5 w-3.5 mr-1.5" /> Map View
        </TabsTrigger>
        <TabsTrigger value="briefing" className="text-xs px-3 py-1.5 h-auto data-[state=active]:shadow-sm flex items-center justify-center">
          <FileText className="h-3.5 w-3.5 mr-1.5" /> Briefing Summary
        </TabsTrigger>
      </TabsList>

      <div className="">
        <ScrollArea className="h-[calc(100vh-22rem)] pr-3">
          <TabsContent value="list" className="mt-0 space-y-3">
            {routeWaypoints.map((waypoint, index) => (
              <Card key={index} className="border shadow-sm overflow-hidden">
                <CardContent className="p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6 text-xs">
                        <AvatarFallback className="bg-primary/10 text-primary font-medium">
                          {index + 1}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-sm leading-tight">{waypoint.airport}</h3>
                        <p className="text-xs text-muted-foreground leading-tight truncate w-40 sm:w-auto" title={waypoint.name}>{waypoint.name}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className={`text-xs px-2 py-0.5 font-medium ${getConditionBadgeClass(waypoint.conditions)}`}>
                      {waypoint.conditions}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-xs mb-2">
                    <div className="flex items-center">
                      <MountainSnow className="h-3.5 w-3.5 mr-1.5 text-muted-foreground flex-shrink-0" />
                      <div>
                        <p className="text-muted-foreground">Altitude</p>
                        <p className="font-medium">{waypoint.altitude} ft</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                       <CloudSun className="h-3.5 w-3.5 mr-1.5 text-muted-foreground flex-shrink-0" />
                       <div>
                          <p className="text-muted-foreground">Weather</p>
                          <p className="font-medium truncate" title={waypoint.weather}>{waypoint.weather}</p>
                       </div>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">METAR</p>
                    <p className="text-[11px] font-mono bg-muted/50 p-1.5 rounded leading-snug">{waypoint.metar}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
          
          <TabsContent value="map" className="mt-0">
            <div className="h-80 bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-900/20 dark:to-blue-900/20 rounded-lg flex items-center justify-center border border-dashed">
              <p className="text-sm text-muted-foreground text-center px-4">
                <Map className="h-8 w-8 mx-auto mb-2 text-primary/50"/>
                Interactive map visualization coming soon!
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="briefing" className="mt-0 space-y-4">
            <Card className="bg-background border shadow-sm">
              <CardContent className="p-4 space-y-3 text-sm">
                <div>
                  <h3 className="text-sm font-semibold mb-1 flex items-center">
                    <Plane className="h-4 w-4 mr-1.5 text-primary"/> Flight Overview
                  </h3>
                  <p className="text-xs text-muted-foreground">{briefing.flightConditions}</p>
                </div>

                <Separator/>

                <div>
                  <h3 className="text-sm font-semibold mb-1 flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-1.5 text-amber-600"/> SIGMET/AIRMET Summary
                  </h3>
                  {briefing.sigmetAirmetSummary.length > 0 ? (
                    <ul className="list-disc list-inside text-xs text-muted-foreground space-y-0.5">
                      {briefing.sigmetAirmetSummary.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                  ) : (
                    <p className="text-xs text-muted-foreground italic">No significant alerts found in summary.</p>
                  )}
                </div>
                
                <Separator/>

                <div>
                  <h3 className="text-sm font-semibold mb-1 flex items-center">
                    <Waves className="h-4 w-4 mr-1.5 text-blue-600"/> PIREP Summary
                  </h3>
                  {briefing.pirepSummary.length > 0 ? (
                    <ul className="list-disc list-inside text-xs text-muted-foreground space-y-0.5">
                      {briefing.pirepSummary.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                  ) : (
                    <p className="text-xs text-muted-foreground italic">No relevant PIREPs found in summary.</p>
                  )}
                </div>
                
                <Separator/>

                <div>
                   <h3 className="text-sm font-semibold mb-1 flex items-center">
                     <CheckCircle className="h-4 w-4 mr-1.5 text-green-600"/> Recommendations
                   </h3>
                   <ul className="list-disc list-inside text-xs text-muted-foreground space-y-0.5">
                      {briefing.recommendations.map((rec, i) => <li key={i}>{rec}</li>)}
                   </ul>
                 </div>
              </CardContent>
            </Card>
          </TabsContent>
        </ScrollArea>
      </div>

      <div className="p-4 pt-4 border-t mt-auto">
        <Button asChild size="sm" className="w-full h-9">
          <Link href={briefingLink}>
             View Full Detailed Briefing <ExternalLink className="h-4 w-4 ml-1.5" />
          </Link>
        </Button>
      </div>
    </Tabs>
  )
} 