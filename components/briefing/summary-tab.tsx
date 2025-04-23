import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  Plane, AlertTriangle, Waves, CheckCircle, MountainSnow, Thermometer, Wind, Eye
} from "lucide-react"
import { BriefingApiResponse } from "@/lib/fetchers/briefing"

interface SummaryTabProps {
  briefing: BriefingApiResponse;
}

// Helper function to get condition badge class (moved or duplicated for encapsulation)
const getConditionBadgeClass = (condition?: boolean | null) => {
  if (condition === true) return "border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-400";
  if (condition === false) return "border-red-500/50 bg-red-500/10 text-red-700 dark:text-red-400";
  return "border-gray-500/50 bg-gray-500/10 text-gray-600 dark:text-gray-400"; // Unknown/Not applicable
};

export function SummaryTab({ briefing }: SummaryTabProps) {
  if (!briefing) {
    return <p className="text-sm text-muted-foreground p-4">Briefing data not available.</p>;
  }

  // Use data directly from the briefing object
  const sigmetCount = briefing.airsigmets?.length || 0;
  const pirepCount = Object.values(briefing.pireps || {}).reduce((count, pirepData) => count + (pirepData?.reports?.length || 0), 0);
  const legsWithSigmetIntersections = briefing.legs?.filter(leg => leg.intersecting_sigmets?.length > 0) || [];

  // Create a simplified flight overview (can be expanded)
  const flightOverviewSummary = `Route: ${briefing.flight_plan}. ${sigmetCount} SIGMET/AIRMET(s) and ${pirepCount} PIREP(s) reported. Check detailed tabs.`;

  // Recommendations (assuming API provides them, otherwise generate simple ones)
  const recommendations = briefing.warnings?.length > 0 ? briefing.warnings : [
    "Review detailed METAR, SIGMET, and PIREP information in the respective tabs.",
    "Verify conditions before departure."
  ];

  return (
    <div className="space-y-4">
      {/* Errors/Warnings from API */} 
      {briefing.errors && briefing.errors.length > 0 && (
        <Card className="border-destructive/50 bg-destructive/10">
          <CardContent className="p-3">
            <h3 className="text-sm font-semibold mb-1 flex items-center text-destructive">
              <AlertTriangle className="h-4 w-4 mr-1.5"/> API Errors
            </h3>
            <ul className="list-disc list-inside text-xs text-destructive/90 space-y-0.5">
              {briefing.errors.map((err, i) => <li key={i}>{err}</li>)}
            </ul>
          </CardContent>
        </Card>
      )}
      {briefing.warnings && briefing.warnings.length > 0 && (
        <Card className="border-amber-500/50 bg-amber-500/10">
          <CardContent className="p-3">
            <h3 className="text-sm font-semibold mb-1 flex items-center text-amber-700 dark:text-amber-400">
              <AlertTriangle className="h-4 w-4 mr-1.5"/> API Warnings / Recommendations
            </h3>
            <ul className="list-disc list-inside text-xs text-amber-800 dark:text-amber-300 space-y-0.5">
              {briefing.warnings.map((warn, i) => <li key={i}>{warn}</li>)}
            </ul>
          </CardContent>
        </Card>
      )}
      
      {/* Flight Overview Card */}
      <Card className="bg-background border shadow-sm">
        <CardContent className="p-4 space-y-3 text-sm">
          <div>
            <h3 className="text-sm font-semibold mb-1 flex items-center">
              <Plane className="h-4 w-4 mr-1.5 text-primary" /> Flight Overview
            </h3>
            <p className="text-xs text-muted-foreground">{flightOverviewSummary}</p>
            {/* Display Legs Info and SIGMET intersections */} 
            {briefing.legs && briefing.legs.length > 0 && (
              <div className="mt-2">
                <p className="text-xs font-medium">Legs:</p>
                <ul className="list-disc list-inside text-xs text-muted-foreground space-y-0.5">
                  {briefing.legs.map((leg, i) => (
                    <li key={i}>
                      {leg.from} → {leg.to}
                      {leg.intersecting_sigmets?.length > 0 && (
                        <span className="ml-1.5 text-amber-600 dark:text-amber-400 font-medium">
                            ({leg.intersecting_sigmets.length} SIGMET intersection{leg.intersecting_sigmets.length !== 1 ? 's' : ''})
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <Separator />

          {/* Waypoint Conditions Summary */}
          <div>
            <h3 className="text-sm font-semibold mb-2 flex items-center">
               <Waves className="h-4 w-4 mr-1.5 text-blue-500" /> Waypoint Conditions Summary
            </h3>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 text-xs">
              {briefing.waypoints?.map((wp, index) => {
                const metar = briefing.metar?.[wp.id];
                return (
                  <div key={wp.id || index} className="flex items-start gap-2 border-l-2 pl-2 border-border">
                     <span className="font-mono font-medium text-primary pt-0.5">{wp.id}</span> 
                     <div className="flex-1 space-y-1">
                         {metar ? (
                            <>
                               <Badge variant="outline" className={`text-[10px] px-1.5 py-0 h-5 ${getConditionBadgeClass(metar.vfr_allowed)}`}>
                                   {metar.vfr_allowed === true ? "VFR" : metar.vfr_allowed === false ? "Non-VFR" : "Unknown"}
                               </Badge>
                               <p className="text-muted-foreground line-clamp-1" title={metar.general}>{metar.general || "No conditions reported"}</p>
                            </>
                         ) : (
                             <p className="text-muted-foreground italic">METAR Unavailable</p>
                         )}
                     </div>
                   
                  </div>
                );
              })}
            </div>
          </div>

          {/* Remove generic recommendations if API provides warnings */}
          {!briefing.warnings || briefing.warnings.length === 0 && (
             <>
                <Separator />
                <div>
                  <h3 className="text-sm font-semibold mb-1 flex items-center">
                    <CheckCircle className="h-4 w-4 mr-1.5 text-green-500" /> General Recommendations
                  </h3>
                  <ul className="list-disc list-inside text-xs text-muted-foreground space-y-0.5">
                    {recommendations.map((rec, i) => <li key={i}>{rec}</li>)}
                  </ul>
                </div>
             </>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 