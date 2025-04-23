import * as React from "react"
import {
    Card, 
    CardContent, 
    CardHeader, 
    CardTitle 
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
    CloudSun, Clock, Wind, Eye, Thermometer, Cloud, AlertCircle, Info, Gauge, Droplet, DownloadCloud 
} from "lucide-react"

import { BriefingApiResponse, MetarData } from "@/lib/fetchers/briefing"

interface MetarTafTabProps {
  briefing: BriefingApiResponse;
}


const getConditionBadgeClass = (condition?: boolean | null) => {
  if (condition === true) return "border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-400";
  if (condition === false) return "border-red-500/50 bg-red-500/10 text-red-700 dark:text-red-400";
  return "border-gray-500/50 bg-gray-500/10 text-gray-600 dark:text-gray-400";
};

const formatObsTimestamp = (unixTimestamp: number | null | undefined): string => {
  if (!unixTimestamp) return "N/A";
  try {
    return new Date(unixTimestamp * 1000).toLocaleTimeString(undefined, {
      hour: '2-digit', minute: '2-digit', timeZoneName: 'short' 
    });
  } catch (e) { return "Invalid Date"; }
};

const formatReceiptTime = (dateTimeString: string | null | undefined): string => {
    if (!dateTimeString) return "N/A";
    try {
        return new Date(dateTimeString).toLocaleTimeString(undefined, {
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

const MetarInfoItem = ({ icon: Icon, label, value, title }: { icon: React.ElementType, label: string, value: React.ReactNode, title?: string }) => {
  if (value === null || value === undefined || value === '' || value === 'N/A') return null;
  return (
    <div className="flex items-center text-xs">
      <Icon className="h-3.5 w-3.5 mr-1.5 text-muted-foreground flex-shrink-0" />
      <span className="text-muted-foreground mr-1 min-w-[60px]">{label}:</span>
      <span className="font-medium text-foreground text-right flex-1 truncate" title={title ?? (typeof value === 'string' ? value : undefined)}>
        {value}
      </span>
    </div>
  );
};


export function MetarTafTab({ briefing }: MetarTafTabProps) {
  if (!briefing || !briefing.waypoints || briefing.waypoints.length === 0) {
    return <p className="text-sm text-muted-foreground p-4">Waypoint METAR data not available.</p>;
  }

  return (
    <ScrollArea style={{ height: 'calc(100vh - 22rem)' }} className="pr-4">
        <div className="space-y-4">
        {briefing.waypoints.map((waypoint) => {
          const metar = briefing.metar?.[waypoint.id];
          const apiData = metar?.api_response;
          const hasError = metar?.error;
          const hasData = metar && !hasError;

          return (
            <Card key={waypoint.id} className={`border shadow-sm overflow-hidden ${hasError ? 'border-destructive/50 bg-destructive/5' : 'bg-background'}`}>
              <CardHeader className="pb-2 pt-3 px-4 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                   {waypoint.id}
                   {metar?.station_name && <span className="text-xs text-muted-foreground font-normal truncate max-w-[200px]" title={metar.station_name}>({metar.station_name})</span>}
                </CardTitle>
                 {hasError ? (
                    <Badge variant="destructive" className="text-xs px-2 py-0.5 whitespace-nowrap">
                       <AlertCircle className="h-3 w-3 mr-1"/> Error
                    </Badge>
                 ) : hasData ? (
                     <Badge variant="outline" className={`text-xs px-2 py-0.5 whitespace-nowrap ${getConditionBadgeClass(metar.vfr_allowed)}`}>
                          {metar.vfr_allowed === true ? "VFR Allowed" : metar.vfr_allowed === false ? "VFR Restricted" : "Cond. Unknown"}
                      </Badge>
                 ) : (
                     <Badge variant="outline" className={`text-xs px-2 py-0.5 whitespace-nowrap ${getConditionBadgeClass(null)}`}>Unavailable</Badge>
                 )}
              </CardHeader>
              <CardContent className="p-4 pt-2 pb-3 space-y-3">
                 {hasError ? (
                     <p className="text-xs text-destructive/90">Error: {metar.error}</p>
                 ) : hasData ? (
                     <>
                        {metar.general && (
                            <p className="text-xs text-muted-foreground italic mb-2 border-b pb-2" title={metar.general}>
                              {metar.general}
                            </p>
                        )}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1.5 mb-2">
                            <MetarInfoItem icon={Thermometer} label="Temp" value={apiData?.temp !== null ? `${apiData?.temp}°C` : 'N/A'} />
                            <MetarInfoItem icon={Droplet} label="Dewpoint" value={apiData?.dewp !== null ? `${apiData?.dewp}°C` : 'N/A'} />
                            <MetarInfoItem icon={Gauge} label="Altimeter" value={formatAltimeterInHg(apiData?.altim)} />
                            <MetarInfoItem icon={Wind} label="Wind" value={formatWind(apiData?.wdir, apiData?.wspd, apiData?.wgst)} />
                            <MetarInfoItem icon={Eye} label="Visibility" value={apiData?.visib ? `${apiData.visib} SM` : 'N/A'} />
                            <MetarInfoItem icon={Cloud} label="Clouds" value={formatClouds(apiData?.clouds)} title={formatClouds(apiData?.clouds)} />
                            <MetarInfoItem icon={Clock} label="Obs Time" value={formatObsTimestamp(apiData?.obsTime)} title={`Observed: ${new Date((apiData?.obsTime || 0) * 1000).toLocaleString()}`} />
                            <MetarInfoItem icon={DownloadCloud} label="Received" value={formatReceiptTime(metar.receipt_time)} title={`Received: ${metar.receipt_time ? new Date(metar.receipt_time).toLocaleString() : 'N/A'}`}/>
                        </div>
                        
                        {(metar.raw || (metar.remarks && metar.remarks.length > 0)) && (
                           <Accordion type="single" collapsible className="w-full border-t pt-2">
                              <AccordionItem value="raw-metar" className="border-b-0">
                                  <AccordionTrigger className="text-xs font-medium py-1 hover:no-underline text-muted-foreground">
                                      <span className="flex items-center"><Info className="h-3.5 w-3.5 mr-1.5"/> Raw Data & Remarks</span>
                                  </AccordionTrigger>
                                  <AccordionContent className="pt-1 pb-0 space-y-1.5">
                                      {metar.raw && (
                                          <pre className="text-[11px] font-mono bg-muted/50 p-1.5 rounded leading-snug break-words">
                                              {metar.raw}
                                          </pre>
                                      )}
                                      {metar.remarks && metar.remarks.length > 0 && (
                                          <div>
                                              <p className="text-xs font-medium mb-0.5">Remarks:</p>
                                              <ul className="list-disc list-inside text-[11px] text-muted-foreground space-y-0.5">
                                                  {metar.remarks.map((remark, i) => <li key={i}>{remark}</li>)}
                                              </ul>
                                          </div>
                                      )}
                                  </AccordionContent>
                              </AccordionItem>
                           </Accordion>
                        )}
                     </>
                 ) : (
                     <p className="text-xs text-muted-foreground italic">METAR data unavailable for this waypoint.</p>
                 )}
              </CardContent>
            </Card>
          );
        })}
        </div>
    </ScrollArea>
  );
}

