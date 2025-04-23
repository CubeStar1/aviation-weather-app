"use client" // Add use client for state and form interaction

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card" // Removed CardHeader/Title as they aren't used directly
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs" // Removed TabsContent import
import { Input } from "@/components/ui/input" // For search
import { Button } from "@/components/ui/button" // For search
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FlightPlanForm, Waypoint } from "@/components/plan/flight-plan-form" // Import form and type
import { Search, SlidersHorizontal, Map as MapIcon } from "lucide-react" // Renamed Map import
import { GradientText } from "@/components/ui/gradient-text"
import { PageHeader } from "@/components/ui/page-header"


// --- Legend Data Structure ---
interface LegendItem {
  label: string;
  colorClass: string;
  type: 'dot' | 'border'; // Add type for different styles
}

const mapLegendData: LegendItem[] = [
  { label: "VFR", colorClass: "bg-green-500", type: 'dot' },
  { label: "MVFR", colorClass: "bg-blue-500", type: 'dot' },
  { label: "IFR", colorClass: "bg-red-500", type: 'dot' },
  { label: "LIFR", colorClass: "bg-magenta-500", type: 'dot' },
  { label: "Light Precip", colorClass: "bg-blue-400", type: 'dot' },
  { label: "Heavy Precip", colorClass: "bg-blue-800", type: 'dot' },
  { label: "Clouds", colorClass: "bg-gray-500", type: 'dot' },
  { label: "SIGMET/AIRMET", colorClass: "border-amber-500", type: 'border' }, // Use border for this one
];

export default function MapPage() {
  // State for the flight plan entered in the sidebar form
  const [currentMapPlan, setCurrentMapPlan] = React.useState<Waypoint[] | null>(null);

  // Handler for the form
  const handleMapPlanGenerated = (plan: Waypoint[]) => {
    console.log("Map plan generated:", plan);
    setCurrentMapPlan(plan);
    // TODO: Update map display based on the new plan
  };

  return (
    <div className="container mx-auto px-4 py-4 space-y-4">
      <PageHeader title="Weather Map" />
      
      {/* Apply gradient and border to the main card */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background shadow-sm overflow-hidden"> 
        {/* Remove CardHeader for now, integrate controls differently */}
        {/* <CardHeader className="py-3">
          ...
        </CardHeader> */}
        <CardContent className="p-0 flex flex-col md:flex-row h-[calc(100vh-12rem)]"> {/* Use Flex layout, full height */}
          
          {/* --- Sidebar --- */}
          <aside className="w-full md:w-1/3 border-r bg-background/50 p-4 flex flex-col">
            <h2 className="text-base font-semibold mb-3">Controls</h2>
            <ScrollArea className="flex-grow -mr-4 pr-4"> 
              <div className="space-y-6">
                {/* Search Section */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Search Waypoint/Area</h3>
                  <div className="flex space-x-2">
                    <Input placeholder="Enter ICAO or Location" className="h-9" />
                    <Button variant="outline" size="icon" className="h-9 w-9">
                      <Search className="h-4 w-4"/>
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Flight Plan Section - Removed max-h/flex-grow override */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Input / Edit Route</h3>
                  <div> 
                    <FlightPlanForm onPlanGenerated={handleMapPlanGenerated} />
                  </div>
                </div>
              </div>
            </ScrollArea>
          </aside>

          {/* --- Main Map Area --- */}
          <main className="flex-1 flex flex-col p-4">
            {/* Map Controls (Tabs) */}
            <div className="mb-3">
              <Tabs defaultValue="radar" className="w-full">
                <TabsList className="grid grid-cols-4 w-full md:w-auto">
                  <TabsTrigger value="radar" className="text-xs px-3 py-1.5 h-auto">
                    Radar
                  </TabsTrigger>
                  <TabsTrigger value="satellite" className="text-xs px-3 py-1.5 h-auto">
                    Satellite
                  </TabsTrigger>
                  <TabsTrigger value="sigmet" className="text-xs px-3 py-1.5 h-auto">
                    SIGMET
                  </TabsTrigger>
                  <TabsTrigger value="conditions" className="text-xs px-3 py-1.5 h-auto">
                    Conditions
                  </TabsTrigger>
                </TabsList>
                {/* Tab content could potentially overlay info on the map itself */}
              </Tabs>
            </div>
            
            {/* Map Placeholder */}
            <div className="flex-grow bg-muted rounded-lg flex items-center justify-center border border-dashed">
              <div className="text-center">
                <MapIcon className="h-12 w-12 mx-auto mb-3 text-primary/50"/>
                <p className="text-sm text-muted-foreground mb-1">Interactive weather map</p>
                {currentMapPlan && (
                  <p className="text-xs text-muted-foreground">Displaying route: {currentMapPlan.map(wp => wp.airport).join(' → ')}</p>
                )}
              </div>
            </div>
            
             {/* Legend - Mapped from data object */}
            <div className="mt-3 p-3 bg-background/50 border rounded-md">
              <h4 className="text-xs font-semibold mb-2 flex items-center">
                <SlidersHorizontal className="h-3.5 w-3.5 mr-1.5"/> Map Legend
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-1.5 text-xs">
                {mapLegendData.map((item) => (
                  <div key={item.label} className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-1.5 ${item.type === 'border' ? 'border ' + item.colorClass : item.colorClass}`}></div>
                    {item.label}
                  </div>
                ))}
              </div>
            </div>
          </main>
        </CardContent>
      </Card>
    </div>
  )
} 