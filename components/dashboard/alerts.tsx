"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Info, AlertTriangle, ExternalLink } from "lucide-react"

// Define the structure for the data this component expects
export interface AlertData {
  id: string | number;
  type: string; // e.g., "INFO", "WARNING", "SIGMET", "AIRMET"
  message: string;
  time: string;
  severity: "low" | "medium" | "high" | string; // Allow known severities or others
}

interface AlertsProps {
  alerts: AlertData[];
}

// Helper to get styling based on alert type/severity
const getAlertStyle = (
  type: string,
  severity: string
): { icon: React.ElementType; colorClasses: string; borderClasses: string } => {
  const lowerType = type.toLowerCase();
  const lowerSeverity = severity.toLowerCase();

  if (lowerType === "sigmet" || lowerSeverity === "high") {
    return {
      icon: AlertTriangle,
      colorClasses: "text-red-700 dark:text-red-400 bg-red-500/5",
      borderClasses: "border-red-500/60",
    };
  } else if (lowerType === "warning" || lowerSeverity === "medium") {
    return {
      icon: AlertTriangle,
      colorClasses: "text-amber-700 dark:text-amber-400 bg-amber-500/5",
      borderClasses: "border-amber-500/60",
    };
  } else if (lowerType === "airmet") {
    return {
      icon: Info,
      colorClasses: "text-blue-700 dark:text-blue-400 bg-blue-500/5",
      borderClasses: "border-blue-500/60",
    };
  } else {
    // INFO or low severity
    return {
      icon: Info,
      colorClasses: "text-sky-700 dark:text-sky-400 bg-sky-500/5",
      borderClasses: "border-sky-500/60",
    };
  }
};

export function Alerts({ alerts }: AlertsProps) {
  return (
    <Card className="h-full shadow-sm border-red-500/20 bg-gradient-to-br from-red-500/5 via-background to-background rounded-xl overflow-hidden flex flex-col">
      <CardHeader className="px-5 py-3 border-b border-red-500/10">
        <CardTitle className="text-base font-medium text-red-800 dark:text-red-300">Weather Alerts</CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-grow overflow-hidden"> {/* Remove padding, allow ScrollArea to handle */}
        {alerts.length > 0 ? (
          <ScrollArea className="h-full p-5"> {/* Set height, add padding here */}
            <div className="space-y-3">
              {alerts.map((alert) => {
                const { icon: Icon, colorClasses, borderClasses } = getAlertStyle(alert.type, alert.severity);
                return (
                  <div key={alert.id} className={`flex items-start gap-3 p-3 rounded-md border-l-4 ${borderClasses} ${colorClasses}`}>
                    <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <div className="flex-grow">
                      <p className="text-sm font-medium leading-snug">{alert.message}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{alert.time} - {alert.type}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        ) : (
          <div className="h-full flex items-center justify-center p-5">
            <p className="text-sm text-muted-foreground italic">No current weather alerts.</p>
          </div>
        )}
      </CardContent>
      {/* Link to Full Alerts Page (Optional) */}
      {alerts.length > 0 && (
         <div className="p-3 border-t border-red-500/10 mt-auto bg-background/30">
          <Button asChild size="sm" variant="outline" className="w-full h-8 text-xs border-red-500/30 text-red-700 dark:text-red-300 hover:bg-red-500/10 hover:text-red-800 dark:hover:text-red-200">
            {/* TODO: Create an alerts page if needed */}
            <Link href="#">
               View All Alerts <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
            </Link>
          </Button>
        </div>
      )}
    </Card>
  );
} 