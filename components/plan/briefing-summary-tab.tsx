"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Plane, AlertTriangle, Waves, CheckCircle
} from "lucide-react"
import { BriefingApiResponse } from "@/lib/fetchers/briefing"

interface BriefingSummaryTabProps {
  briefing: BriefingApiResponse | null | undefined;
}

export function BriefingSummaryTab({ briefing }: BriefingSummaryTabProps) {
  if (!briefing) {
    return <p className="text-sm text-muted-foreground p-4">Briefing data not available.</p>;
  }

  const flightConditions = `Overall conditions for ${briefing.flight_plan}. Check details.`; // Placeholder
  const sigmetAirmetSummary = briefing.airsigmets.map(s => s.simplified_summary || s.hazard || 'Unknown SIGMET/AIRMET');
  const pirepSummary = Object.values(briefing.pireps).flatMap(p => p.status || 'PIREP details missing'); // Example extraction
  const legIntersections = briefing.legs.filter(leg => leg.intersecting_sigmets.length > 0).map(leg => (
      `Leg ${leg.from}-${leg.to} intersects ${leg.intersecting_sigmets.length} SIGMET(s).`
  ));
  const recommendations = [
      "Review full briefing before departure.",
  ];

  return (
    <ScrollArea className="h-[calc(100vh-23rem)] pr-3">
       <div className="space-y-4">
        <Card className="bg-background border shadow-sm">
            <CardContent className="p-4 space-y-3 text-sm">
            {/* Flight Overview - Placeholder */}
            <div>
                <h3 className="text-sm font-semibold mb-1 flex items-center">
                <Plane className="h-4 w-4 mr-1.5 text-primary"/> Flight Overview
                </h3>
                <p className="text-xs text-muted-foreground">{flightConditions}</p>
                 {/* Display Legs Info */}
                 {briefing.legs.length > 0 && (
                    <div className="mt-2">
                        <p className="text-xs font-medium">Legs:</p>
                        <ul className="list-disc list-inside text-xs text-muted-foreground space-y-0.5">
                           {briefing.legs.map((leg, i) => (
                                <li key={i}>{leg.from} → {leg.to}{leg.intersecting_sigmets.length > 0 ? ` (${leg.intersecting_sigmets.length} SIGMET intersection(s))` : ''}</li>
                            ))}
                        </ul>
                    </div>
                 )}
            </div>

            <Separator/>

            {/* SIGMET/AIRMET Summary */}
            <div>
                <h3 className="text-sm font-semibold mb-1 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-1.5 text-amber-600"/> SIGMET/AIRMET Summary
                </h3>
                {sigmetAirmetSummary.length > 0 ? (
                <ul className="list-disc list-inside text-xs text-muted-foreground space-y-0.5">
                    {sigmetAirmetSummary.map((item, i) => <li key={i}>{item}</li>)}
                    {/* Add intersected legs info */} 
                    {legIntersections.map((item, i) => <li key={`int-${i}`} className="text-destructive/80">{item}</li>)}
                </ul>
                ) : (
                <p className="text-xs text-muted-foreground italic">No significant alerts found in summary.</p>
                )}
            </div>
            
            <Separator/>

            {/* PIREP Summary */}
            <div>
                <h3 className="text-sm font-semibold mb-1 flex items-center">
                <Waves className="h-4 w-4 mr-1.5 text-blue-600"/> PIREP Summary
                </h3>
                {pirepSummary.length > 0 ? (
                <ul className="list-disc list-inside text-xs text-muted-foreground space-y-0.5">
                    {pirepSummary.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
                ) : (
                <p className="text-xs text-muted-foreground italic">No relevant PIREPs found in summary.</p>
                )}
            </div>
            
            <Separator/>

            {/* Recommendations */}
            <div>
                <h3 className="text-sm font-semibold mb-1 flex items-center">
                    <CheckCircle className="h-4 w-4 mr-1.5 text-green-600"/> Recommendations
                </h3>
                <ul className="list-disc list-inside text-xs text-muted-foreground space-y-0.5">
                    {recommendations.map((rec, i) => <li key={i}>{rec}</li>)}
                </ul>
                </div>
            </CardContent>
        </Card>
       </div>
    </ScrollArea>
  );
} 