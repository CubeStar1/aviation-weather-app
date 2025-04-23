"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Clock, MapPin, TrendingUp, Move } from "lucide-react"
import { BriefingApiResponse } from "@/lib/fetchers/briefing"

interface AlertsProps {
  briefing?: BriefingApiResponse;
}

// Helper functions from sigmet-airmet-tab.tsx
const formatAltitude = (alt: number | null | undefined): string => {
  if (alt === null || alt === undefined) return "N/A";
  return alt === 0 ? "SFC" : `FL${(alt / 100).toFixed(0).padStart(3, '0')}`;
};

const formatMovement = (dir: number | null | undefined, spd: number | null | undefined): string => {
  if (dir === null || dir === undefined || spd === null || spd === undefined || spd === 0) return "Stationary";
  return `${dir}° at ${spd}kt`;
};

const formatTimestamp = (unixTimestamp: number | null | undefined): string => {
  if (!unixTimestamp) return "N/A";
  try {
    return new Date(unixTimestamp * 1000).toLocaleString(undefined, {
      hour: '2-digit', minute: '2-digit', timeZoneName: 'short' 
    });
  } catch (e) {
    return "Invalid Date";
  }
};

const getHazardColor = (hazardType?: string) => {
  return hazardType === 'SIGMET' ? 'text-red-600 dark:text-red-500' : 'text-amber-600 dark:text-amber-500';
};

export function Alerts({ briefing }: AlertsProps) {
  if (!briefing?.airsigmets || briefing.airsigmets.length === 0) {
    return (
      <Card className="max-h-[300px] shadow-sm border-amber-500/20 bg-gradient-to-br from-amber-500/5 via-background to-background rounded-xl overflow-hidden">
        <CardHeader className="px-5 py-3 border-b border-amber-500/10">
          <CardTitle className="text-base font-medium text-amber-800 dark:text-amber-300">Active Alerts</CardTitle>
        </CardHeader>
        <CardContent className="p-5 text-center text-muted-foreground">
          <AlertTriangle className="h-10 w-10 mx-auto mb-2 text-amber-400"/>
          <p>No active alerts for this area.</p>
        </CardContent>
      </Card>
    );
  }

  // Sort alerts by type (SIGMETs first) and then by time
  const sortedAlerts = [...briefing.airsigmets].sort((a, b) => {
    if (a.airSigmetType === b.airSigmetType) {
      return (a.validTimeFrom || 0) - (b.validTimeFrom || 0);
    }
    return a.airSigmetType === 'SIGMET' ? -1 : 1;
  });

  return (
    <Card className="max-h-[400px] shadow-sm border-amber-500/20 bg-gradient-to-br from-amber-500/5 via-background to-background rounded-xl overflow-hidden">
      <CardHeader className="px-5 py-3 border-b border-amber-500/10">
        <CardTitle className="text-base font-medium text-amber-800 dark:text-amber-300">
          Active Alerts ({sortedAlerts.length})
        </CardTitle>
      </CardHeader>
      <ScrollArea className="h-[calc(100%-4rem)]">
        <CardContent className="p-4 space-y-3">
          {sortedAlerts.map((alert) => (
            <div
              key={alert.airSigmetId}
              className={`p-3 rounded-lg border ${
                alert.airSigmetType === 'SIGMET' 
                  ? 'bg-red-500/5 border-red-500/20' 
                  : 'bg-amber-500/5 border-amber-500/20'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <AlertTriangle className={`h-4 w-4 ${getHazardColor(alert.airSigmetType)}`} />
                  <span className="text-sm font-medium">
                    {alert.airSigmetType} {alert.alphaChar && `- ${alert.alphaChar}`}
                  </span>
                </div>
                <Badge 
                  variant="outline" 
                  className={`text-xs ${
                    alert.airSigmetType === 'SIGMET' 
                      ? 'border-red-500/30 text-red-700 dark:text-red-400' 
                      : 'border-amber-500/30 text-amber-700 dark:text-amber-400'
                  }`}
                >
                  {alert.hazard}
                </Badge>
              </div>
              
              {alert.simplified_summary && (
                <p className="text-xs text-foreground mb-2">{alert.simplified_summary}</p>
              )}
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center text-muted-foreground">
                  <Clock className="h-3 w-3 mr-1" />
                  Valid: {formatTimestamp(alert.validTimeFrom)}
                </div>
                <div className="flex items-center text-muted-foreground">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {formatAltitude(alert.altitudeLow1)} - {formatAltitude(alert.altitudeHi1)}
                </div>
                <div className="flex items-center text-muted-foreground col-span-2">
                  <Move className="h-3 w-3 mr-1" />
                  {formatMovement(alert.movementDir, alert.movementSpd)}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </ScrollArea>
    </Card>
  );
} 