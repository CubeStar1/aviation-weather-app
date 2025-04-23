import {
    Card, CardContent, CardHeader, CardTitle
  } from "@/components/ui/card"
  import {
    Plane, Clock, MapPin, Layers, Waves, Snowflake, Cloud
  } from "lucide-react"
  
  // Re-define necessary interface locally
  interface PirepData {
    raw: string;
    time: string;
    description: string;
    location?: string;
    altitude?: string;
    aircraft?: string;
    turbulence?: string;
    icing?: string;
    skyCondition?: string;
  }
  
  // --- Helper Component (Moved from main page) ---
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
  
  // --- Props definition for PirepTab ---
  interface PirepTabProps {
    pireps: PirepData[];
  }
  
  export function PirepTab({ pireps }: PirepTabProps) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight">Pilot Reports (PIREPs)</h2>
        {pireps.length > 0 ? pireps.map((pirep, index) => (
           <Card key={index} className="border shadow-sm bg-background">
             <CardHeader className="pb-2 pt-3 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-base font-semibold flex items-center">
                  <Plane className="h-4 w-4 mr-1.5 text-muted-foreground" /> PIREP
                </CardTitle>
                <span className="text-xs text-muted-foreground"><Clock className="inline h-3 w-3 mr-0.5" />{pirep.time}</span>
             </CardHeader>
             <CardContent className="pt-0 text-sm space-y-2">
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-1 text-xs">
                   <InfoItem icon={MapPin} label="Location" value={pirep.location} />
                   <InfoItem icon={Layers} label="Altitude" value={pirep.altitude} />
                   <InfoItem icon={Plane} label="Aircraft" value={pirep.aircraft} />
                   {pirep.turbulence && <InfoItem icon={Waves} label="Turbulence" value={pirep.turbulence} />}
                   {pirep.icing && <InfoItem icon={Snowflake} label="Icing" value={pirep.icing} />}
                   {pirep.skyCondition && <InfoItem icon={Cloud} label="Sky" value={pirep.skyCondition} />}
                </div>
                <div className="text-xs pt-1"> 
                   <span className="text-muted-foreground mr-1">Report:</span>
                   <span className="font-medium text-foreground">{pirep.description}</span>
                </div>
                <details className="pt-1">
                    <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">Raw PIREP</summary>
                    <p className="mt-1 bg-muted/50 p-2 rounded font-mono text-[11px] overflow-x-auto">{pirep.raw}</p>
                </details>
             </CardContent>
           </Card>
        )) : <p className="text-sm text-muted-foreground italic">No relevant PIREPs found for this route.</p>}
      </div>
    );
  }
  