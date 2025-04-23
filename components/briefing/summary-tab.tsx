import {
  Card, CardContent, CardHeader, CardTitle
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Thermometer, Wind, Eye, CheckCircle
} from "lucide-react"

// Re-define necessary interfaces locally or import from a shared types file
// For simplicity, re-defining here. Consider creating a types/briefing.ts later.
interface WaypointData {
  icao: string;
  conditions: string;
  tempC: number;
  wind: string;
  visibilitySM: string;
}

// InfoItem Helper (moved here as it's used in this tab)
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

// Props definition for SummaryTab
interface SummaryTabProps {
  flightOverview: string;
  waypoints: WaypointData[];
  recommendations: string[];
}

export function SummaryTab({ flightOverview, waypoints, recommendations }: SummaryTabProps) {
  // Helper function moved from the main page
  const getConditionBadgeVariant = (condition: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (condition.toUpperCase()) {
      case "VFR": return "default";
      case "MVFR": return "secondary";
      case "IFR": return "destructive";
      default: return "outline";
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-background border shadow-sm">
        <CardHeader className="pb-2 pt-3">
           <CardTitle className="text-sm font-semibold">Flight Overview</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm text-muted-foreground">{flightOverview}</p>
        </CardContent>
      </Card>
      
      <div className="space-y-3">
        <h3 className="font-semibold text-sm">Waypoint Summary</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {waypoints.map((wp, index) => (
            <Card key={index} className="border shadow-sm flex flex-col">
              <CardHeader className="pb-2 pt-3 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-semibold">{wp.icao}</CardTitle>
                <Badge variant={getConditionBadgeVariant(wp.conditions)} className="text-xs px-2 py-0.5">
                   {wp.conditions}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-1.5 text-sm flex-grow">
                 <InfoItem icon={Thermometer} label="Temp" value={`${wp.tempC}°C`} />
                 <InfoItem icon={Wind} label="Wind" value={wp.wind} />
                 <InfoItem icon={Eye} label="Visibility" value={`${wp.visibilitySM} SM`} />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      <Card className="bg-background border shadow-sm">
         <CardHeader className="pb-2 pt-3">
           <CardTitle className="text-sm font-semibold">Recommendations</CardTitle>
         </CardHeader>
         <CardContent>
           <ul className="space-y-1.5 text-sm text-muted-foreground">
             {recommendations.map((rec, i) => (
               <li key={i} className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-green-500 flex-shrink-0" /> 
                  <span>{rec}</span>
               </li>
             ))}
           </ul>
         </CardContent>
       </Card>
    </div>
  );
} 