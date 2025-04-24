"use client" 

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card" 
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs" 
import { Input } from "@/components/ui/input" 
import { Button } from "@/components/ui/button" 
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FlightPlanForm, Waypoint } from "@/components/plan/flight-plan-form" 
import { Search, SlidersHorizontal, Map as MapIcon, RefreshCw } from "lucide-react" 
import { GradientText } from "@/components/ui/gradient-text"
import { PageHeader } from "@/components/ui/page-header"
import Link from "next/link"
import Image from "next/image"


interface LegendItem {
  label: string;
  colorClass: string;
  type: 'dot' | 'border'; 
}

const mapLegendData: LegendItem[] = [
  { label: "VFR", colorClass: "bg-green-500", type: 'dot' },
  { label: "MVFR", colorClass: "bg-blue-500", type: 'dot' },
  { label: "IFR", colorClass: "bg-red-500", type: 'dot' },
  { label: "LIFR", colorClass: "bg-magenta-500", type: 'dot' },
  { label: "Light Precip", colorClass: "bg-blue-400", type: 'dot' },
  { label: "Heavy Precip", colorClass: "bg-blue-800", type: 'dot' },
  { label: "Clouds", colorClass: "bg-gray-500", type: 'dot' },
  { label: "SIGMET/AIRMET", colorClass: "border-amber-500", type: 'border' }, 
];

const mapUrls = {
  surface: "https://www.1800wxbrief.com/Website/weather/graphic/image?product=SURFACE_ANALYSIS&seed=762675937",
  winds: "https://www.1800wxbrief.com/Website/weather/graphic/image?product=CURRENT_FL050_WINDS_TEMP&seed=-1429119848",
  sigmet: "https://aviationweather.gov/data/products/sigmet/sigmet_all.gif",
  humidity: "https://www.1800wxbrief.com/Website/weather/graphic/image?product=MEAN_RH&seed=152226039"
};

export default function MapPage() {
  const [currentMapPlan, setCurrentMapPlan] = React.useState<Waypoint[] | null>(null);
  const [cacheBuster, setCacheBuster] = React.useState<string>(`timestamp=${Date.now()}`);
  const [selectedTab, setSelectedTab] = React.useState<keyof typeof mapUrls>('sigmet');

  const refreshMap = () => {
    setCacheBuster(`timestamp=${Date.now()}`);
  };

  const handleMapPlanGenerated = (planString: string) => {
    console.log("Map plan string received:", planString);
    try {
      const parsedWaypoints = planString.split(',')
        .map(part => {
          const [airport, altitude] = part.split(','); 
          return { airport: airport?.trim() ?? '', altitude: altitude?.trim() ?? '' };
        })
        .reduce<Waypoint[]>((acc, _, i, arr) => {
          if (i % 2 === 0 && arr[i] && arr[i+1]) { 
              return acc; 
          }
          return acc;
        }, []);
        
      const parts = planString.split(',');
      const waypoints: Waypoint[] = [];
      for (let i = 0; i < parts.length; i += 2) {
        if (parts[i] && parts[i+1]) { 
            waypoints.push({ airport: parts[i].trim(), altitude: parts[i+1].trim() });
        }
      }

      if (waypoints.length > 0) {
        setCurrentMapPlan(waypoints);
      } else {
          console.error("Failed to parse plan string into waypoints:", planString);
          setCurrentMapPlan(null); 
      }
    } catch (error) {
      console.error("Error parsing flight plan string:", error);
      setCurrentMapPlan(null);
    }
  };

  // Get current image URL with cache buster
  const getCurrentMapUrl = () => {
    const baseUrl = mapUrls[selectedTab];
    // Only add cache buster for URLs that don't end with .gif
    if (!baseUrl.endsWith('.gif')) {
      return `${baseUrl}&${cacheBuster}`;
    }
    return `${baseUrl}?${cacheBuster}`;
  };

  return (
    <div className="container mx-auto px-4 py-4 space-y-4">
      <div className="flex justify-between items-center">
        <PageHeader title="Weather Map" />
        <Link href="/maps">
        <Button variant="outline">
          <MapIcon className="h-4 w-4 mr-2" />
           View Live Map
          </Button>
        </Link>
      </div>
      
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background shadow-sm overflow-hidden"> 
        <CardContent className="p-0 flex flex-col md:flex-row h-[calc(100vh-12rem)]"> 
          
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

                {/* Flight Plan Section */}
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
            <div className="mb-3 flex justify-between items-center">
              <Tabs 
                defaultValue="radar" 
                className="w-full"
                value={selectedTab}
                onValueChange={(value) => setSelectedTab(value as keyof typeof mapUrls)}
              >
                <TabsList className="grid grid-cols-4 w-full md:w-auto">
                  <TabsTrigger value="sigmet" className="text-xs px-3 py-1.5 h-auto">
                    SIGMET
                  </TabsTrigger>
                  <TabsTrigger value="surface" className="text-xs px-3 py-1.5 h-auto">
                    Surface Analysis
                  </TabsTrigger>
                  <TabsTrigger value="winds" className="text-xs px-3 py-1.5 h-auto">
                    Winds
                  </TabsTrigger>
                  <TabsTrigger value="humidity" className="text-xs px-3 py-1.5 h-auto">
                    Humidity
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <Button variant="outline" size="sm" onClick={refreshMap} className="ml-2">
                <RefreshCw className="h-3.5 w-3.5" />
              </Button>
            </div>
            
            {/* Map Display */}
            <div className="flex-grow bg-primary/5 rounded-lg border relative overflow-hidden">
              {/* Regular img tag instead of next/image for better compatibility with external GIFs */}
              <img
                src={getCurrentMapUrl()}
                alt={`Weather Map - ${selectedTab}`}
                className="object-contain w-full h-full absolute inset-0"
                loading="lazy"
                key={cacheBuster} // Force re-render on refresh
              />
              {currentMapPlan && (
                <div className="absolute bottom-0 left-0 right-0 bg-background/80 p-2 text-xs text-center border-t">
                  Route: {currentMapPlan.map(wp => wp.airport).join(' → ')}
                </div>
              )}
            </div>
            
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