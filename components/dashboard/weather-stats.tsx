"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Wind, Eye, Thermometer, Layers, Gauge, Cloud, CalendarDays, ListChecks, ExternalLink, Info, MessageSquare
} from "lucide-react"

// Interfaces for METAR and TAF data
interface MetarDetails {
  wind?: { direction: string; speed: string };
  visibility?: string;
  ceiling?: string;
  temperature?: number;
  dewpoint?: number;
  altimeter?: string;
  remarks?: string;
  raw?: string; // Keep raw METAR as well
}

interface TafForecast {
  time: string;
  wind: string;
  visibility: string;
  clouds: string;
  conditions: string;
}

interface TafDetails {
  valid: string;
  forecast: TafForecast[];
  raw?: string; // Keep raw TAF
}

export interface MetarTafData {
  metar?: MetarDetails;
  taf?: TafDetails;
}

interface WeatherStatsProps {
  statsData: MetarTafData;
}

// Helper component for displaying a data item with an icon
const DataItem = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value?: string | number | null }) => {
  if (value === undefined || value === null || value === '') return null;
  return (
    <div className="flex items-start">
      <Icon className="h-4 w-4 mr-2 mt-0.5 text-slate-500 flex-shrink-0" />
      <div>
        <dt className="text-xs text-muted-foreground">{label}</dt>
        <dd className="text-sm font-medium">{value}</dd>
      </div>
    </div>
  );
};

export function WeatherStats({ statsData }: WeatherStatsProps) {
  const { metar, taf } = statsData;

  // Check if there's any data to display
  const hasMetar = metar && Object.values(metar).some(v => v !== undefined && v !== null && v !== '');
  const hasTaf = taf && taf.forecast?.length > 0;
  const hasData = hasMetar || hasTaf;

  if (!hasData) {
    return (
      <Card className="h-full shadow-sm border-slate-500/20 bg-gradient-to-br from-slate-500/5 via-background to-background rounded-xl overflow-hidden flex items-center justify-center">
        <CardContent className="p-5 text-center text-muted-foreground">
          <ListChecks className="h-10 w-10 mx-auto mb-2 text-slate-400"/>
          <p>No METAR or TAF data available.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full shadow-sm border-slate-500/20 bg-gradient-to-br from-slate-500/5 via-background to-background rounded-xl overflow-hidden flex flex-col">
      {/* Removed header from here, assuming parent card on dashboard provides it */}
      <CardContent className="p-5 flex-grow">
        <Tabs defaultValue={hasMetar ? "metar" : "taf"} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4 h-9">
            <TabsTrigger value="metar" disabled={!hasMetar} className="text-xs h-full">METAR</TabsTrigger>
            <TabsTrigger value="taf" disabled={!hasTaf} className="text-xs h-full">TAF</TabsTrigger>
          </TabsList>
          
          {hasMetar && (
            <TabsContent value="metar" className="mt-0">
              <dl className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-5">
                <DataItem icon={Wind} label="Wind" value={metar?.wind ? `${metar.wind.direction} at ${metar.wind.speed}` : 'N/A'} />
                <DataItem icon={Eye} label="Visibility" value={metar?.visibility} />
                <DataItem icon={Cloud} label="Ceiling/Clouds" value={metar?.ceiling} />
                <DataItem icon={Thermometer} label="Temperature" value={metar?.temperature !== undefined ? `${metar.temperature}°C` : undefined} />
                <DataItem icon={Thermometer} label="Dew Point" value={metar?.dewpoint !== undefined ? `${metar.dewpoint}°C` : undefined} />
                <DataItem icon={Gauge} label="Altimeter" value={metar?.altimeter} />
                {metar?.remarks && (
                    <div className="col-span-full">
                        <DataItem icon={Info} label="Remarks" value={metar.remarks} />
                    </div>
                )}
                {metar?.raw && (
                    <details className="col-span-full mt-2">
                        <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">Raw METAR</summary>
                        <p className="mt-1 bg-muted/50 p-2 rounded font-mono text-[11px] leading-snug overflow-x-auto">{metar.raw}</p>
                    </details>
                )}
              </dl>
            </TabsContent>
          )}

          {hasTaf && (
            <TabsContent value="taf" className="mt-0 space-y-4">
              <p className="text-xs text-muted-foreground">Valid: {taf?.valid}</p>
              {taf?.forecast.map((item, index) => (
                <div key={index} className="border-b border-slate-500/10 pb-3 last:border-b-0 last:pb-0">
                  <p className="text-xs font-medium mb-2">Forecast Period: {item.time}</p>
                  <dl className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-3">
                    <DataItem icon={Wind} label="Wind" value={item.wind} />
                    <DataItem icon={Eye} label="Visibility" value={item.visibility} />
                    <DataItem icon={Cloud} label="Clouds" value={item.clouds} />
                     <div className="col-span-full">
                        <DataItem icon={Info} label="Conditions" value={item.conditions} />
                    </div>
                  </dl>
                </div>
              ))}
               {taf?.raw && (
                    <details className="mt-2">
                        <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">Raw TAF</summary>
                        <p className="mt-1 bg-muted/50 p-2 rounded font-mono text-[11px] leading-snug overflow-x-auto">{taf.raw}</p>
                    </details>
                )}
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
      {/* Link to Full Briefing Page - Adjust link based on context if needed */}
       <div className="p-3 border-t border-slate-500/10 mt-auto bg-background/30">
        <Button asChild size="sm" variant="outline" className="w-full h-8 text-xs border-slate-500/30 text-slate-700 dark:text-slate-300 hover:bg-slate-500/10 hover:text-slate-800 dark:hover:text-slate-200">
          {/* TODO: Link should ideally go to briefing for the relevant airport/route */}
          <Link href="/briefing">
             View Full Briefing Page <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
          </Link>
        </Button>
      </div>
    </Card>
  );
} 