"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Plane, AlertTriangle, Waves, CheckCircle, Info, Loader2, AlertCircle as AlertIcon, MapPin
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { BriefingApiResponse, AirSigmetData, PirepReportData } from "@/lib/fetchers/briefing"

interface BriefingContextDisplayProps {
  briefing: BriefingApiResponse | null | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  waypoints: { airport: string; altitude: string }[]; // Use Waypoint type from form
}

// Helper to format PIREP report concisely
const formatPirep = (report: PirepReportData): string => {
   let pirepStr = "PIREP: ";
   if (report.location?.repr) pirepStr += `${report.location.repr} `;
   if (report.time?.repr) pirepStr += `at ${report.time.repr}Z `;
   if (report.altitude?.value) pirepStr += `FL${String(report.altitude.value).padStart(3, '0')} `;
   if (report.aircraft?.code) pirepStr += `(${report.aircraft.code}) `;
   if (report.turbulence?.repr) pirepStr += `Turb: ${report.turbulence.repr}; `;
   if (report.icing?.repr) pirepStr += `Icing: ${report.icing.repr}; `;
   return pirepStr.trim();
};

export function BriefingContextDisplay({ 
    briefing,
    isLoading,
    isError,
    error,
    waypoints
 }: BriefingContextDisplayProps) {

    if (isLoading) {
        return (
            <Card className="lg:col-span-2 shadow-sm border-purple-500/20 bg-gradient-to-br from-purple-500/5 via-background to-background rounded-xl overflow-hidden min-h-[300px] flex flex-col items-center justify-center">
                <CardContent className="p-5 text-center text-muted-foreground">
                    <Loader2 className="h-6 w-6 mr-2 animate-spin mb-2" />
                    Loading briefing context...
                </CardContent>
            </Card>
        );
    }

    if (isError) {
         return (
            <Card className="lg:col-span-2 shadow-sm border-destructive/20 bg-gradient-to-br from-destructive/5 via-background to-background rounded-xl overflow-hidden min-h-[300px] flex flex-col items-center justify-center">
                <CardContent className="p-5 text-center text-destructive">
                    <AlertIcon className="h-6 w-6 mr-2 mb-2" />
                    Error loading context: {error?.message || 'Unknown error'}
                </CardContent>
            </Card>
        );
    }
    
     if (!briefing || waypoints.length === 0) {
        return (
            <Card className="lg:col-span-2 shadow-sm border-purple-500/20 bg-gradient-to-br from-purple-500/5 via-background to-background rounded-xl overflow-hidden min-h-[300px] flex flex-col items-center justify-center">
                 <CardHeader className="px-5 py-3 border-b border-purple-500/10 w-full">
                    <CardTitle className="text-base font-medium text-purple-800 dark:text-purple-300 flex items-center">
                        <Info className="h-4 w-4 mr-2"/> Active Briefing Context
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-5 text-center text-muted-foreground flex-grow flex items-center justify-center">
                    <p>No active flight plan or briefing data found. Please define a route.</p>
                </CardContent>
            </Card>
        );
    }

  // Extract data safely
  const sigmetAirmetSummary = briefing.airsigmets?.map(s => s.simplified_summary || `${s.hazard || 'Alert'} ${s.altitudeLo1 ? `from ${s.altitudeLo1}ft` : ''} ${s.altitudeHi1 ? `to ${s.altitudeHi1}ft` : ''}`)
                               || [];
  const pirepSummary = Object.values(briefing.pireps || {}).flatMap(p => 
      p.reports?.filter(r => r.raw !== "No matching AIREP/PIREPs").map(formatPirep)
  );
  const legIntersections = briefing.legs?.filter(leg => leg.intersecting_sigmets?.length > 0).map(leg => (
      `Leg ${leg.from}-${leg.to} intersects ${leg.intersecting_sigmets.length} SIGMET(s).`
  )) || [];
  
  const hasAlerts = sigmetAirmetSummary.length > 0 || pirepSummary.length > 0 || legIntersections.length > 0;

  return (
    <Card className="lg:col-span-2 shadow-sm border-purple-500/20 bg-gradient-to-br from-purple-500/5 via-background to-background rounded-xl overflow-hidden min-h-[300px] flex flex-col">
        <CardHeader className="px-5 py-3 border-b border-purple-500/10">
            <CardTitle className="text-base font-medium text-purple-800 dark:text-purple-300 flex items-center">
                <Info className="h-4 w-4 mr-2"/> Active Briefing Context
            </CardTitle>
        </CardHeader>
        <ScrollArea className="flex-grow min-h-0"> {/* Allows ScrollArea to take remaining height */}
             <CardContent className="p-4 space-y-3 text-sm">
                 {/* Route Display */} 
                  <div>
                        <h3 className="text-sm font-semibold mb-1 flex items-center">
                           <Plane className="h-4 w-4 mr-1.5 text-primary"/> Route Context
                        </h3>
                        <div className="flex items-center gap-2 flex-wrap font-medium">
                            {waypoints.map((wp, index) => (
                                <React.Fragment key={wp.airport + index}>
                                    <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                                        <MapPin className="h-3 w-3"/>
                                        {wp.airport || "N/A"}
                                        <span className="text-xs text-muted-foreground">({wp.altitude || "N/A"}')</span>
                                    </Badge>
                                    {index < waypoints.length - 1 && <span className="text-muted-foreground">-&gt;</span>}
                                </React.Fragment>
                            ))}
                        </div>
                  </div>
                  
                  {hasAlerts && <Separator/>} 
                  
                 {/* SIGMET/AIRMET Summary */} 
                 {sigmetAirmetSummary.length > 0 && (
                     <div>
                        <h3 className="text-sm font-semibold mb-1 flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-1.5 text-amber-600"/> SIGMET/AIRMET Summary
                        </h3>
                        <ul className="list-disc list-inside text-xs text-muted-foreground space-y-0.5">
                            {sigmetAirmetSummary.map((item, i) => <li key={`sig-${i}`}>{item}</li>)}
                            {legIntersections.map((item, i) => <li key={`int-${i}`} className="text-destructive/80 font-medium">{item}</li>)}
                        </ul>
                     </div>
                 )}
            
                 {/* PIREP Summary */} 
                 {pirepSummary.length > 0 && (
                     <div>
                        {sigmetAirmetSummary.length > 0 && <Separator/>} 
                        <h3 className="text-sm font-semibold mb-1 mt-2 flex items-center">
                        <Waves className="h-4 w-4 mr-1.5 text-blue-600"/> PIREP Summary
                        </h3>
                        <ul className="list-disc list-inside text-xs text-muted-foreground space-y-0.5">
                            {pirepSummary.map((item, i) => <li key={`pir-${i}`}>{item}</li>)}
                        </ul>
                     </div>
                 )}
                 
                  {!hasAlerts && (
                     <p className="text-sm text-muted-foreground italic mt-3">No significant weather alerts (SIGMETs, AIRMETs, PIREPs) found in the current briefing context for this route.</p>
                  )}

            </CardContent>
        </ScrollArea>
    </Card>
  );
} 