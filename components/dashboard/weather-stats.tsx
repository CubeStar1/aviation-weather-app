"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import Link from "next/link"
import {
  Wind, Eye, Thermometer, Gauge, Cloud, ListChecks, ExternalLink, Info, 
  MessageSquare, Droplet, Clock, MapPin, Plane, Snowflake, Waves, User, FileText
} from "lucide-react"
import { BriefingApiResponse, PirepReportData } from "@/lib/fetchers/briefing"

interface WeatherStatsProps {
  briefing?: BriefingApiResponse;
}

// Helper functions from metar-taf-tab.tsx
const formatObsTimestamp = (unixTimestamp: number | null | undefined): string => {
  if (!unixTimestamp) return "N/A";
  try {
    return new Date(unixTimestamp * 1000).toLocaleTimeString(undefined, {
      hour: '2-digit', minute: '2-digit', timeZoneName: 'short' 
    });
  } catch (e) { return "Invalid Date"; }
};

const formatAltimeterInHg = (altimMb: number | null | undefined): string => {
    if (altimMb === null || altimMb === undefined) return "N/A";
    return `${(altimMb * 0.02953).toFixed(2)} inHg`;
};

const formatWind = (wdir: number | null | undefined, wspd: number | null | undefined, wgst: number | null | undefined): string => {
    if (wdir === null || wdir === undefined || wspd === null || wspd === undefined) return "N/A";
    if (wdir === 0 && wspd === 0) return "Calm";
    const dirStr = wdir === 0 ? "VRB" : wdir.toString().padStart(3, '0');
    const spdStr = wspd.toString().padStart(2, '0');
    const gustStr = wgst ? `G${wgst.toString().padStart(2, '0')}kt` : "kt";
    return `${dirStr}° @ ${spdStr}${gustStr}`;
};

const formatClouds = (clouds: { cover: string; base: number | null }[] | undefined): string => {
    if (!clouds || clouds.length === 0) return "Sky Clear";
    return clouds.map(c => `${c.cover}${c.base !== null ? `@${c.base}ft` : ''}`).join(', ');
};

// Helper component for displaying a data item with an icon
const DataItem = ({ icon: Icon, label, value, title }: { icon: React.ElementType, label: string, value?: string | number | null, title?: string }) => {
  if (value === undefined || value === null || value === '') return null;
  return (
    <div className="flex items-start">
      <Icon className="h-4 w-4 mr-2 mt-0.5 text-slate-500 flex-shrink-0" />
      <div>
        <dt className="text-xs text-muted-foreground">{label}</dt>
        <dd className="text-sm font-medium" title={title}>{value}</dd>
      </div>
    </div>
  );
};

// PIREP Components from pirep-tab.tsx
const PirepInfoItem = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: React.ReactNode }) => {
  if (value === null || value === undefined || value === '' || value === 'N/A') return null;
  return (
    <div className="flex items-start text-xs">
      <Icon className="h-3.5 w-3.5 mr-1.5 text-muted-foreground flex-shrink-0 mt-px" />
      <span className="text-muted-foreground mr-1 min-w-[65px]">{label}:</span>
      <span className="font-medium text-foreground flex-1 break-words">{value}</span>
    </div>
  );
};

const PirepReport = ({ report }: { report: PirepReportData }) => {
   if (report.raw === "No matching AIREP/PIREPs") {
       return <p className="text-xs text-muted-foreground italic px-2">No specific PIREPs found matching criteria.</p>;
   }

   const location = report.location?.repr || "Unknown";
   const time = report.time?.repr ? `${report.time.repr}Z` : "N/A";
   const altitude = report.altitude?.value ? `FL${String(report.altitude.value).padStart(3, '0')}` : "N/A";
   const aircraft = typeof report.aircraft === 'object' && report.aircraft?.code 
                    ? `${report.aircraft.code} (${report.aircraft.type || 'Unknown Type'})` 
                    : report.aircraft || "N/A";
   const clouds = report.clouds?.map((c: any) => `${c.type}${c.base ? `@${c.base * 100}ft` : ''}`).join(', ') || "N/A";
   const icing = report.icing?.repr || "N/A";
   const turbulence = report.turbulence?.repr || "N/A";
   const visibility = report.flight_visibility?.repr ? `${report.flight_visibility.repr} SM` : "N/A";
   const remarks = report.remarks || "N/A";
   const reportType = report.type || "PIREP";

   return (
      <div className="space-y-2">
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5">
            <PirepInfoItem icon={Clock} label="Time" value={time} />
            <PirepInfoItem icon={MapPin} label="Location" value={location} />
            <PirepInfoItem icon={Plane} label="Altitude" value={altitude} />
            <PirepInfoItem icon={User} label="Aircraft" value={aircraft} />
            <PirepInfoItem icon={Cloud} label="Clouds" value={clouds} />
            <PirepInfoItem icon={Eye} label="Visibility" value={visibility} />
            <PirepInfoItem icon={Snowflake} label="Icing" value={icing} />
            <PirepInfoItem icon={Waves} label="Turbulence" value={turbulence} />
            <PirepInfoItem icon={FileText} label="Type" value={reportType} />
            {remarks !== 'N/A' && (
                <div className="sm:col-span-2">
                    <PirepInfoItem icon={MessageSquare} label="Remarks" value={remarks} />
                </div>
            )}
         </div>
          {report.raw && report.raw !== "No matching AIREP/PIREPs" && (
            <Accordion type="single" collapsible className="w-full pt-1">
                 <AccordionItem value="raw-pirep" className="border-t">
                     <AccordionTrigger className="text-xs font-medium py-1 hover:no-underline text-muted-foreground">
                          <span className="flex items-center"><Info className="h-3.5 w-3.5 mr-1.5"/> Raw Text</span>
                     </AccordionTrigger>
                     <AccordionContent className="pt-1 pb-0">
                         <pre className="bg-muted/50 p-1.5 rounded font-mono text-[10px] overflow-x-auto whitespace-pre-wrap break-words">
                             {report.raw}
                         </pre>
                     </AccordionContent>
                 </AccordionItem>
             </Accordion>
          )}
      </div>
   );
}

export function WeatherStats({ briefing }: WeatherStatsProps) {
  if (!briefing || !briefing.waypoints || briefing.waypoints.length === 0) {
    return (
      <Card className="h-full shadow-sm border-slate-500/20 bg-gradient-to-br from-slate-500/5 via-background to-background rounded-xl overflow-hidden flex items-center justify-center">
        <CardContent className="p-5 text-center text-muted-foreground">
          <ListChecks className="h-10 w-10 mx-auto mb-2 text-slate-400"/>
          <p>No weather data available.</p>
        </CardContent>
      </Card>
    );
  }

  // Get the first waypoint's METAR data for the main display
  const firstWaypoint = briefing.waypoints[0];
  const metar = briefing.metar?.[firstWaypoint.id];
  const apiData = metar?.api_response;
  const hasError = metar?.error;
  const hasData = metar && !hasError;

  // Get PIREPs for the first waypoint
  const pireps = briefing.pireps?.[firstWaypoint.id];
  const hasPireps = pireps && pireps.reports && pireps.reports.length > 0;

  return (
    <Card className="h-full shadow-sm border-slate-500/20 bg-gradient-to-br from-slate-500/5 via-background to-background rounded-xl overflow-hidden flex flex-col">
      <CardHeader className="px-5 py-3 border-b border-slate-500/10">
        <CardTitle className="text-base font-medium text-slate-800 dark:text-slate-300">Weather Conditions</CardTitle>
      </CardHeader>
      <CardContent className="p-5 flex-grow">
        <Tabs defaultValue="metar" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="metar">METAR</TabsTrigger>
            <TabsTrigger value="pirep">PIREP</TabsTrigger>
          </TabsList>
          
          <TabsContent value="metar" className="mt-0">
            {hasError ? (
              <p className="text-sm text-destructive">{metar.error}</p>
            ) : hasData ? (
              <div className="space-y-4">
                {metar.general && (
                  <p className="text-sm text-muted-foreground italic">{metar.general}</p>
                )}
                <dl className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <DataItem icon={Thermometer} label="Temperature" value={apiData?.temp !== null ? `${apiData?.temp}°C` : undefined} />
                  <DataItem icon={Droplet} label="Dewpoint" value={apiData?.dewp !== null ? `${apiData?.dewp}°C` : undefined} />
                  <DataItem icon={Gauge} label="Altimeter" value={formatAltimeterInHg(apiData?.altim)} />
                  <DataItem icon={Wind} label="Wind" value={formatWind(apiData?.wdir, apiData?.wspd, apiData?.wgst)} />
                  <DataItem icon={Eye} label="Visibility" value={apiData?.visib ? `${apiData.visib} SM` : undefined} />
                  <DataItem icon={Cloud} label="Clouds" value={formatClouds(apiData?.clouds)} />
                  <DataItem icon={Clock} label="Observed" value={formatObsTimestamp(apiData?.obsTime)} />
                </dl>
                {metar.raw && (
                  <div className="mt-4 pt-4 border-t border-slate-500/10">
                    <details className="text-xs">
                      <summary className="cursor-pointer text-muted-foreground hover:text-foreground">Raw METAR</summary>
                      <pre className="mt-2 p-2 bg-muted/50 rounded font-mono text-[11px] overflow-x-auto whitespace-pre-wrap">
                        {metar.raw}
                      </pre>
                    </details>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No METAR data available.</p>
            )}
          </TabsContent>
          
          <TabsContent value="pirep" className="mt-0">
            {hasPireps ? (
              <div className="space-y-3">
                {pireps.reports.map((report, index) => (
                  <div key={index} className={index > 0 ? "pt-3 border-t" : ""}>
                    <PirepReport report={report} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No PIREPs available for this location.</p>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <div className="p-3 border-t border-slate-500/10 mt-auto bg-background/30">
        <Button asChild size="sm" variant="outline" className="w-full h-8 text-xs border-slate-500/30 text-slate-700 dark:text-slate-300 hover:bg-slate-500/10 hover:text-slate-800 dark:hover:text-slate-200">
          <Link href={`/briefing?route=${firstWaypoint.id}`}>
            View Full Weather Briefing <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
          </Link>
        </Button>
      </div>
    </Card>
  );
} 