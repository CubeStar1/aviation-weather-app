import {
  Card, CardContent, CardHeader, CardTitle
} from "@/components/ui/card"
import {
  Info, AlertTriangle, Waves, Snowflake, Cloud, CalendarDays, MapPin
} from "lucide-react"

// Re-define necessary interface locally
interface SigmetAirmetData {
  type: "SIGMET" | "AIRMET";
  title: string;
  valid: string;
  area: string;
  details: string;
  raw: string;
  phenomenon?: string;
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

const SigmetAirmetIcon = ({ type, phenomenon }: { type: string, phenomenon?: string }) => {
   const p = phenomenon?.toUpperCase();
   if (type === "SIGMET") return <AlertTriangle className="h-4 w-4 mr-1.5 text-red-500 flex-shrink-0" />;
   if (p === "TURB") return <Waves className="h-4 w-4 mr-1.5 text-blue-500 flex-shrink-0" />;
   if (p === "ICE") return <Snowflake className="h-4 w-4 mr-1.5 text-blue-500 flex-shrink-0" />;
   if (p === "IFR") return <Cloud className="h-4 w-4 mr-1.5 text-blue-500 flex-shrink-0" />;
   return <Info className="h-4 w-4 mr-1.5 text-blue-500 flex-shrink-0" />;
};

// --- Props definition for SigmetAirmetTab ---
interface SigmetAirmetTabProps {
  sigmetsAirmets: SigmetAirmetData[];
}

export function SigmetAirmetTab({ sigmetsAirmets }: SigmetAirmetTabProps) {
  return (
    <div className="space-y-4">
       <h2 className="text-lg font-semibold tracking-tight">Active SIGMETs / AIRMETs</h2>
       {sigmetsAirmets.length > 0 ? sigmetsAirmets.map((item, index) => (
         <Card key={index} className={`border shadow-sm bg-background ${item.type === 'SIGMET' ? 'border-red-500/30' : 'border-blue-500/20'}`}>
           <CardHeader className="pb-2 pt-3">
             <CardTitle className="text-base font-semibold flex items-center">
                <SigmetAirmetIcon type={item.type} phenomenon={item.phenomenon} />
                {item.title} ({item.type})
             </CardTitle>
           </CardHeader>
           <CardContent className="pt-0 text-sm space-y-2">
             <InfoItem icon={CalendarDays} label="Valid" value={item.valid} />
             <InfoItem icon={MapPin} label="Area" value={item.area} />
             <div className="text-xs pt-1"> 
                <span className="text-muted-foreground mr-1">Details:</span>
                <span className="font-medium text-foreground">{item.details}</span>
             </div>
             <details className="pt-1">
                 <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">Raw Report</summary>
                 <p className="mt-1 bg-muted/50 p-2 rounded font-mono text-[11px] whitespace-pre-line">{item.raw}</p>
             </details>
           </CardContent>
         </Card>
       )) : <p className="text-sm text-muted-foreground italic">No active SIGMETs or AIRMETs for this route.</p>}
    </div>
  );
} 