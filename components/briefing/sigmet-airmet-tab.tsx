import * as React from "react"
import {
  Card, CardContent, CardHeader, CardTitle
} from "@/components/ui/card"
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  AlertTriangle, Clock, MapPin, TrendingUp, Move, CalendarClock, Info, Database, Sigma 
} from "lucide-react"
import { BriefingApiResponse, AirSigmetData } from "@/lib/fetchers/briefing"

interface SigmetAirmetTabProps {
  briefing: BriefingApiResponse;
}

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

const formatDateTime = (dateTimeString: string | null | undefined): string => {
    if (!dateTimeString) return "N/A";
    try {
        return new Date(dateTimeString).toLocaleString(undefined, {
             year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZoneName: 'short'
        });
    } catch (e) {
        return "Invalid Date";
    }
};

const getHazardColor = (hazardType?: string) => {
    return hazardType === 'SIGMET' ? 'text-red-600 dark:text-red-500' : 'text-amber-600 dark:text-amber-500';
}

export function SigmetAirmetTab({ briefing }: SigmetAirmetTabProps) {
  const sigmetsAirmets = briefing.airsigmets;

  if (!sigmetsAirmets || sigmetsAirmets.length === 0) {
    return <p className="text-sm text-muted-foreground p-4">No relevant SIGMETs or AIRMETs found.</p>;
  }

  return (
    <ScrollArea style={{ height: 'calc(100vh - 22rem)' }} className="pr-4">
        <div className="space-y-4">
        {sigmetsAirmets.map((item) => (
            <Card key={item.airSigmetId} className={`border shadow-sm bg-background overflow-hidden ${item.airSigmetType === 'SIGMET' ? 'border-red-500/30' : 'border-amber-500/30'}`}>
              <CardHeader className={`pb-2 pt-3 px-4 flex flex-row items-center justify-between space-y-0 ${item.airSigmetType === 'SIGMET' ? 'bg-red-500/10' : 'bg-amber-500/10'}`}>
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                   <AlertTriangle className={`h-4 w-4 ${getHazardColor(item.airSigmetType)}`} />
                   <span>
                      {item.airSigmetType || "ALERT"} {item.alphaChar && `- ${item.alphaChar}`} 
                      {item.hazard && <span className="ml-1 font-normal">({item.hazard})</span>}
                   </span>
                </CardTitle>
                <Badge variant="outline" className="text-xs border-foreground/20">
                    <Clock className="h-3 w-3 mr-1" /> Valid: {formatTimestamp(item.validTimeFrom)} - {formatTimestamp(item.validTimeTo)}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-3 p-4">
                 {item.simplified_summary && (
                     <p className="text-sm text-foreground font-medium leading-snug">
                        {item.simplified_summary}
                     </p>
                 )}
                
                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-xs border-t pt-3">
                    <div className="flex items-center">
                        <TrendingUp className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                        <span className="text-muted-foreground mr-1 min-w-[60px]">Altitude:</span>
                        <span className="font-medium text-foreground">
                            {formatAltitude(item.altitudeLow1)} - {formatAltitude(item.altitudeHi1)}
                        </span>
                    </div>
                     <div className="flex items-center">
                        <Move className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                        <span className="text-muted-foreground mr-1 min-w-[60px]">Movement:</span>
                        <span className="font-medium text-foreground">
                            {formatMovement(item.movementDir, item.movementSpd)}
                        </span>
                    </div>
                     {item.coords && item.coords.length > 0 && (
                        <div className="flex items-center col-span-1 sm:col-span-2">
                            <MapPin className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                            <span className="text-muted-foreground mr-1 min-w-[60px]">Area:</span>
                            <span className="font-medium text-foreground italic">Defined by polygon (see map)</span>
                        </div>
                     )}
                     {item.severity && (
                        <div className="flex items-center">
                            <Sigma className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                            <span className="text-muted-foreground mr-1 min-w-[60px]">Severity:</span>
                            <span className="font-medium text-foreground">{item.severity}</span>
                        </div>
                     )}
                </div>

                 {/* Raw Text Accordion */}
                 {item.rawAirSigmet && ( 
                     <Accordion type="single" collapsible className="w-full pt-2">
                        <AccordionItem value="raw-text" className="border-t">
                            <AccordionTrigger className="text-xs font-medium py-1.5 hover:no-underline text-muted-foreground">
                                 <span className="flex items-center"><Info className="h-3.5 w-3.5 mr-1.5"/> Raw Text</span>
                            </AccordionTrigger>
                            <AccordionContent className="pt-1 pb-0">
                                <pre className="bg-muted/50 p-2 rounded font-mono text-[10px] overflow-x-auto whitespace-pre-wrap break-words">
                                    {item.rawAirSigmet}
                                </pre>
                            </AccordionContent>
                        </AccordionItem>
                     </Accordion>
                 )}
                 
                 <div className="text-xs text-muted-foreground flex justify-between items-center border-t pt-2 mt-3">
                    <span title={formatDateTime(item.creationTime)}>
                        Created: {formatDateTime(item.creationTime)}
                    </span>
                    <span title={`Received: ${formatDateTime(item.receiptTime)}`}>
                        {item.icaoId && <span className="font-mono"><Database className="inline h-3 w-3 mr-0.5"/>{item.icaoId}</span>}
                    </span>
                 </div>
              </CardContent>
            </Card>
        ))}
        </div>
    </ScrollArea>
  );
} 