import {
  Card, CardContent, CardHeader, CardTitle
} from "@/components/ui/card"
import {
  Thermometer, Wind, Eye, Layers, Cloud, CloudRain
} from "lucide-react"

// Re-define necessary interfaces locally or import from a shared types file
interface MetarData {
  time: string;
  raw: string;
  decoded?: Record<string, string | number>;
}

interface TafData {
  valid: string;
  raw: string;
  decoded?: Record<string, any>;
}

interface WaypointData {
  icao: string;
  metar?: MetarData;
  taf?: TafData;
}

// --- Helper Components (Moved from main page) ---

const InfoItem = ({ icon, label, value }: { icon: React.ElementType, label: string, value: React.ReactNode }) => {
  if (!value) return null;
  const Icon = icon;
  return (
    <div className="flex items-center text-xs">
      <Icon className="h-3.5 w-3.5 mr-1.5 text-muted-foreground flex-shrink-0" />
      <span className="text-muted-foreground mr-1">{label}:</span>
      <span className="font-medium text-foreground text-right flex-1">{value}</span>
    </div>
  );
};

const DecodedMetar = ({ metar }: { metar: WaypointData['metar'] }) => {
  if (!metar) return <p className="text-xs text-muted-foreground italic">No METAR data</p>;
  return (
    <div className="space-y-1.5">
      <h4 className="text-sm font-semibold mb-1 flex items-center justify-between">
        METAR <span className="text-xs font-normal text-muted-foreground">{metar.time}</span>
      </h4>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        <InfoItem icon={Wind} label="Wind" value={metar.decoded?.wind || metar.raw.match(/(\d{3}|VRB)\d{2,3}(G\d{2,3})?KT/)?.[0]} />
        <InfoItem icon={Eye} label="Visibility" value={metar.decoded?.visibility || metar.raw.match(/ (\d+SM|\d{4}(?!\/))/)?.[0]} />
        <InfoItem icon={Thermometer} label="Temp/Dew" value={`${metar.decoded?.tempC ?? '?'}/${metar.decoded?.dewpointC ?? '?'} °C`} />
        <InfoItem icon={Layers} label="Altimeter" value={metar.decoded?.altimeter} />
        <InfoItem icon={Cloud} label="Sky" value={metar.decoded?.sky} />
        <InfoItem icon={CloudRain} label="Weather" value={metar.decoded?.weather || "None"} />
      </div>
      <details className="pt-1">
          <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">Raw METAR</summary>
          <p className="mt-1 bg-muted/50 p-2 rounded font-mono text-[11px] overflow-x-auto">{metar.raw}</p>
      </details>
    </div>
  );
};

const DecodedTaf = ({ taf }: { taf: WaypointData['taf'] }) => {
  if (!taf) return <p className="text-xs text-muted-foreground italic">No TAF data</p>;
  return (
    <div className="space-y-1.5">
       <h4 className="text-sm font-semibold mb-1 flex items-center justify-between">
        TAF <span className="text-xs font-normal text-muted-foreground">Valid: {taf.valid}</span>
      </h4>
       {/* Base Conditions */}
       <div className="border-b pb-1 mb-1"> 
          <p className="text-xs font-medium mb-0.5 text-muted-foreground">Base Forecast</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
             <InfoItem icon={Wind} label="Wind" value={taf.decoded?.baseWind} />
             <InfoItem icon={Eye} label="Visibility" value={taf.decoded?.baseVis} />
             <InfoItem icon={Cloud} label="Sky" value={taf.decoded?.baseSky} />
          </div>
       </div>
       {/* Forecast Groups */}
       {taf.decoded?.forecastGroups?.map((group: any, index: number) => (
          <div key={index} className="border-b pb-1 mb-1 last:border-b-0 last:pb-0 last:mb-0">
             <p className="text-xs font-medium mb-0.5 text-muted-foreground">{group.time}</p>
             <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                <InfoItem icon={Wind} label="Wind" value={group.wind} />
                <InfoItem icon={Eye} label="Visibility" value={group.vis} />
                <InfoItem icon={Cloud} label="Sky" value={group.sky} />
             </div>
          </div>
       ))}
       <details className="pt-1">
           <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">Raw TAF</summary>
           <p className="mt-1 bg-muted/50 p-2 rounded font-mono text-[11px] overflow-x-auto">{taf.raw}</p>
       </details>
    </div>
  );
};

// --- Props definition for MetarTafTab ---
interface MetarTafTabProps {
  waypoints: WaypointData[];
}

export function MetarTafTab({ waypoints }: MetarTafTabProps) {
  return (
    <div className="space-y-4">
       <h2 className="text-lg font-semibold tracking-tight">METAR / TAF by Waypoint</h2>
       {waypoints.map((wp, index) => (
          <Card key={index} className="border shadow-sm bg-background">
            <CardHeader className="pb-2 pt-3">
               <CardTitle className="text-base font-semibold">{wp.icao}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 divide-y">
               <div className="pt-3 first:pt-0">
                  <DecodedMetar metar={wp.metar} />
               </div>
               <div className="pt-3 first:pt-0">
                  <DecodedTaf taf={wp.taf} />
               </div>
            </CardContent>
          </Card>
       ))}
    </div>
  );
} 