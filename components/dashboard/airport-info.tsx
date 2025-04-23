"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  PlaneTakeoff, Mountain, CloudSun, ArrowRightLeft // Icons
} from "lucide-react"

// TODO: Define props for airport data
export interface AirportInfoData {
  name: string;
  icao: string;
  runway: string;
  elevation: string;
  metar: string;
  time: string;
  status: string; 
  flightConditions: string; 
}

interface AirportInfoProps {
  airportData: AirportInfoData;
}

// Helper for flight condition badge styling
const getConditionBadgeStyle = (condition: string): string => {
  switch (condition?.toUpperCase()) {
    case "VFR": return "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/30";
    case "MVFR": return "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30";
    case "IFR": return "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/30";
    case "LIFR": return "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/30";
    default: return "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/30";
  }
}

export function AirportInfo({ airportData }: AirportInfoProps) {
  return (
    <Card className="shadow-sm border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 via-background to-background rounded-xl overflow-hidden">
      <CardHeader className="px-5 py-3 border-b border-emerald-500/10 flex flex-row items-center justify-between">
        <CardTitle className="text-base font-medium text-emerald-800 dark:text-emerald-300">Airport Information</CardTitle>
        <Badge variant={airportData.status === 'Active' ? "default" : "secondary"} className={`text-xs ${airportData.status === 'Active' ? 'bg-green-600' : 'bg-slate-500'}`}>{airportData.status}</Badge>
      </CardHeader>
      <CardContent className="p-5 space-y-4">
        {/* Airport Name & ICAO */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold leading-tight">{airportData.name}</h3>
            <p className="text-sm text-muted-foreground">{airportData.icao} <span className="text-xs">• {airportData.time}</span></p>
          </div>
          <Badge variant="outline" className={`text-xs font-medium ${getConditionBadgeStyle(airportData.flightConditions)}`}>
            {/* Add icon based on condition maybe? */}
             {airportData.flightConditions}
          </Badge>
        </div>

        {/* Runway & Elevation */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="h-4 w-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Runway</p>
              <p className="font-medium">{airportData.runway}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Mountain className="h-4 w-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Elevation</p>
              <p className="font-medium">{airportData.elevation}</p>
            </div>
          </div>
        </div>

        {/* METAR */}
        <div>
          <p className="text-xs text-muted-foreground mb-1">Current METAR</p>
          <p className="text-xs font-mono bg-emerald-500/5 p-2 rounded border border-emerald-500/10 leading-snug">
            {airportData.metar}
          </p>
        </div>
        {/* Potentially add Link to more details */}
      </CardContent>
    </Card>
  );
} 