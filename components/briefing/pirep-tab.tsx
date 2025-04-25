import * as React from "react"
import {
    Card, CardContent, CardHeader, CardTitle, CardFooter
  } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { 
    MessageSquare, Clock, MapPin, Plane, Cloud, Snowflake, Waves, User, Eye, FileText, Info,
    Thermometer, AlertTriangle, Building
} from "lucide-react"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { ScrollArea } from "@/components/ui/scroll-area"

import { BriefingApiResponse, PirepData, PirepReportData } from "@/lib/fetchers/briefing"

interface PirepTabProps {
  briefing: BriefingApiResponse;
}

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
   const altitude = typeof report.altitude === 'object' && report.altitude?.value 
                   ? `FL${String(report.altitude.value).padStart(3, '0')}` 
                   : report.altitude || "N/A";
   const aircraft = typeof report.aircraft === 'object' && report.aircraft?.code 
                    ? `${report.aircraft.code} (${report.aircraft.type || 'Unknown Type'})` 
                    : report.aircraft || "N/A";
   const clouds = report.clouds?.map((c: any) => `${c.type}${c.base ? `@${c.base * 100}ft` : ''}`).join(', ') || "N/A";
   const icing = report.icing?.repr || "N/A";
   const turbulence = report.turbulence?.repr || "N/A";
   const visibility = report.flight_visibility?.repr ? `${report.flight_visibility.repr} SM` : "N/A";
   const remarks = report.remarks || "N/A";
   const reportType = report.type || "PIREP";
   const station = report.station || "N/A";
   const temperature = report.temperature?.value ? `${report.temperature.value}°C` : "N/A";
   const wxCodes = report.wx_codes?.length > 0 ? report.wx_codes.join(', ') : "N/A";
   const other = report.other?.length > 0 ? report.other.join(', ') : "N/A";

   return (
      <div className="space-y-2">
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5">
            <PirepInfoItem icon={Clock} label="Time" value={time} />
            <PirepInfoItem icon={Building} label="Station" value={station} />
            <PirepInfoItem icon={MapPin} label="Location" value={location} />
            <PirepInfoItem icon={Plane} label="Altitude" value={altitude} />
            <PirepInfoItem icon={User} label="Aircraft" value={aircraft} />
            <PirepInfoItem icon={Cloud} label="Clouds" value={clouds} />
            <PirepInfoItem icon={Eye} label="Visibility" value={visibility} />
            <PirepInfoItem icon={Snowflake} label="Icing" value={icing} />
            <PirepInfoItem icon={Waves} label="Turbulence" value={turbulence} />
            <PirepInfoItem icon={Thermometer} label="Temperature" value={temperature} />
            <PirepInfoItem icon={AlertTriangle} label="Wx Codes" value={wxCodes} />
            <PirepInfoItem icon={FileText} label="Type" value={reportType} />
            <PirepInfoItem icon={Info} label="Other" value={other} />
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

export function PirepTab({ briefing }: PirepTabProps) {
  const pirepsData = briefing.pireps;
  const waypointIds = Object.keys(pirepsData || {});

  if (!pirepsData || waypointIds.length === 0) {
    return <p className="text-sm text-muted-foreground p-4">No PIREPs found near the route waypoints.</p>;
  }

  return (
    <ScrollArea style={{ height: 'calc(100vh - 22rem)' }} className="pr-4">
        <div className="space-y-4">
        {waypointIds.map(waypointId => {
          const pirepGroup = pirepsData[waypointId];
          const noReportsFound = pirepGroup?.reports?.[0]?.raw === "No matching AIREP/PIREPs";
          
          if (!pirepGroup || !pirepGroup.reports || (pirepGroup.reports.length === 1 && noReportsFound)) {
              return (
                   <Card key={waypointId} className="border shadow-sm bg-background/50 border-dashed">
                      <CardHeader className="pb-2 pt-3">
                        <CardTitle className="text-sm font-semibold flex items-center text-muted-foreground">
                           <MessageSquare className="h-4 w-4 mr-1.5 text-muted-foreground/70"/> 
                           PIREPs near {waypointId}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0 pb-3">
                           <p className="text-xs text-muted-foreground italic">No specific reports found near this waypoint.</p>
                      </CardContent>
                      {pirepGroup?.status && (
                           <CardFooter className="text-xs text-muted-foreground/80 pt-2 pb-2 border-t bg-muted/30">
                              {pirepGroup.status}
                          </CardFooter>
                      )}
                   </Card>
              );
          }

          return (
            <Card key={waypointId} className="border shadow-sm bg-background">
              <CardHeader className="pb-2 pt-3">
                <CardTitle className="text-sm font-semibold flex items-center">
                   <MessageSquare className="h-4 w-4 mr-1.5 text-blue-500"/> 
                   PIREPs near {waypointId}
                   <span className="ml-2 text-xs font-normal text-muted-foreground">({pirepGroup.reports.length} report{pirepGroup.reports.length !== 1 ? 's' : ''})</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 pb-3 space-y-3 divide-y">
                {pirepGroup.reports.map((report, index) => (
                   <div key={index} className="pt-3 first:pt-0">
                      <PirepReport report={report} />
                   </div>
                ))}
              </CardContent>
               {pirepGroup.status && (
                  <CardFooter className="text-xs text-muted-foreground/80 pt-2 pb-2 border-t bg-muted/30">
                      {pirepGroup.status}
                  </CardFooter>
              )}
            </Card>
          );
        })}
        </div>
    </ScrollArea>
  );
}
  