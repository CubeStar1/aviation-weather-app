import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Import the new components
import { FlightRouteHeader } from "@/components/briefing/flight-route-header"
import { SummaryTab } from "@/components/briefing/summary-tab"
import { MetarTafTab } from "@/components/briefing/metar-taf-tab"
import { SigmetAirmetTab } from "@/components/briefing/sigmet-airmet-tab"
import { PirepTab } from "@/components/briefing/pirep-tab"
import { GradientText } from "@/components/ui/gradient-text"
import { PageHeader } from "@/components/ui/page-header"
// Keep interfaces needed for mock data structure
// Consider moving these to a shared types file later (e.g., types/briefing.ts)
interface WaypointData {
  icao: string;
  conditions: string;
  tempC: number;
  wind: string;
  visibilitySM: string; 
  metar?: { time: string; raw: string; decoded?: Record<string, string | number> };
  taf?: { valid: string; raw: string; decoded?: Record<string, any> };
}

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

interface SigmetAirmetData {
  type: "SIGMET" | "AIRMET";
  title: string;
  valid: string;
  area: string;
  details: string;
  raw: string;
  phenomenon?: string;
}

interface FlightBriefingApiResponse {
  routeString: string;
  flightOverview: string;
  recommendations: string[];
  waypoints: WaypointData[];
  sigmetsAirmets: SigmetAirmetData[];
  pireps: PirepData[];
}

// Keep Mock API Response Data Object
const mockBriefingData: FlightBriefingApiResponse = {
  routeString: "KPHX → KBXK → KPSP → KLAX",
  flightOverview: "VFR conditions prevail along the entire route. Light to moderate turbulence reported near KPSP at 12,000 feet. No significant weather expected during the planned flight time.",
  recommendations: [
    "VFR flight recommended for the entire route.",
    "Exercise caution for light to moderate turbulence near KPSP at 12,000 feet.",
    "Expect haze conditions approaching KLAX.",
    "Monitor for changes in weather conditions before departure.",
  ],
  waypoints: [
    {
      icao: "KPHX", conditions: "VFR", tempC: 32, wind: "270° 7kt", visibilitySM: "10+",
      metar: { 
        time: "1753Z", 
        raw: "KPHX 151753Z 27007KT 10SM FEW120 FEW200 32/09 A3005 RMK AO2 SLP140 T03170089",
        decoded: { sky: "FEW 12000ft, FEW 20000ft", weather: "None", altimeter: "30.05 inHg" } 
      },
      taf: { 
        valid: "1518/1618", 
        raw: "KPHX 151700Z 1518/1618 27010KT P6SM FEW120 SCT200 FM152000 28008KT P6SM FEW100 SCT200",
        decoded: { baseWind: "270° 10kt", baseVis: "6+ SM", baseSky: "FEW 12000ft, SCT 20000ft", forecastGroups: [{ time: "From 2000Z", wind: "280° 8kt", sky: "FEW 10000ft, SCT 20000ft" }] } 
      }
    },
    {
      icao: "KBXK", conditions: "VFR", tempC: 30, wind: "270° 10kt", visibilitySM: "10+",
      metar: { 
        time: "1750Z", 
        raw: "KBXK 151750Z AUTO 27010KT 10SM CLR 30/07 A3004",
        decoded: { sky: "Clear", weather: "None", altimeter: "30.04 inHg" } 
      },
    },
    {
      icao: "KPSP", conditions: "VFR", tempC: 34, wind: "280° 12kt", visibilitySM: "10+",
      metar: { 
        time: "1753Z", 
        raw: "KPSP 151753Z 28012G18KT 10SM FEW150 34/05 A2997",
        decoded: { sky: "FEW 15000ft", weather: "None", altimeter: "29.97 inHg", gusts: "18kt" } 
      },
      taf: { 
        valid: "1518/1618", 
        raw: "KPSP 151700Z 1518/1618 28012G20KT P6SM FEW150 FM152200 29008KT P6SM SKC",
        decoded: { baseWind: "280° 12kt Gust 20kt", baseVis: "6+ SM", baseSky: "FEW 15000ft", forecastGroups: [{ time: "From 2200Z", wind: "290° 8kt", sky: "Clear" }] }
      }
    },
    {
      icao: "KLAX", conditions: "VFR", tempC: 22, wind: "250° 12kt", visibilitySM: "8",
      metar: { 
        time: "1753Z", 
        raw: "KLAX 151753Z 25012KT 8SM HZ FEW015 SCT250 22/17 A2993",
        decoded: { sky: "FEW 1500ft, SCT 25000ft", weather: "Haze", altimeter: "29.93 inHg" } 
      },
      taf: { 
        valid: "1518/1618", 
        raw: "KLAX 151700Z 1518/1618 25012KT 8SM HZ FEW015 SCT250 FM152200 26008KT 6SM HZ FEW010 SCT250",
        decoded: { baseWind: "250° 12kt", baseVis: "8 SM", baseSky: "FEW 1500ft, SCT 25000ft", forecastGroups: [{ time: "From 2200Z", wind: "260° 8kt", vis: "6 SM HZ", sky: "FEW 1000ft, SCT 25000ft" }] }
      }
    },
  ],
  sigmetsAirmets: [
    {
      type: "AIRMET", title: "AIRMET TANGO", valid: "151200Z - 151800Z", area: "SW United States including portions of AZ and CA",
      details: "Moderate turbulence below 12,000 feet due to strong surface winds.", phenomenon: "TURB",
      raw: "AIRMET TANGO FOR TURBC VALID UNTIL 151800Z\\nAZ CA AND COASTAL WTRS\\nFROM 50W PHX TO 40W PSP TO 30W LAX\\nMOD TURBC BLO 120 DUE TO STG SFC WNDS. CONDS CONTG BYD 18Z."
    }
  ],
  pireps: [
    { 
      raw: "UA /OV KPSP /TM 1720 /FL120 /TP C172 /TB LGT-MOD", 
      time: "1720Z", description: "Cessna 172 reported light to moderate turbulence at 12,000 feet near KPSP at 1720Z.",
      location: "KPSP", altitude: "12000 ft", aircraft: "C172", turbulence: "LGT-MOD"
    },
    { 
      raw: "UA /OV KLAX090020 /TM 1735 /FL080 /TP B737 /SK BKN014 /TA 18 /TB LGT", 
      time: "1735Z", description: "Boeing 737 reported broken clouds at 1,400 feet, temperature 18°C, and light turbulence 20 miles east of KLAX at 1735Z.",
      location: "20nm E KLAX", altitude: "8000 ft", aircraft: "B737", skyCondition: "BKN 1400ft", turbulence: "LGT"
    },
  ]
};

// Removed all helper components (InfoItem, DecodedMetar, etc.) as they are now in the tab components
// Removed helper functions (getConditionBadgeVariant, renderRoute) as they are moved

// --- Main Page Component (Refactored) ---
export default function BriefingPage() {

  return (
    <div className="container mx-auto px-4 py-2 space-y-6">
      <PageHeader title="Weather Briefing" />
      
      {/* Render the Flight Route Header Component */}
      <FlightRouteHeader routeString={mockBriefingData.routeString} />
      
      {/* Apply border and gradient to the main card */}
      <Card className="shadow-md border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background overflow-hidden"> 
        <CardContent className="p-4"> 
          <Tabs defaultValue="summary" className="relative">
            <TabsList className="grid grid-cols-4 gap-2 mb-4">
              <TabsTrigger value="summary" className="text-xs px-3 py-1.5 h-auto">Summary</TabsTrigger>
              <TabsTrigger value="metar-taf" className="text-xs px-3 py-1.5 h-auto">METAR / TAF</TabsTrigger>
              <TabsTrigger value="sigmet" className="text-xs px-3 py-1.5 h-auto">SIGMET/AIRMET</TabsTrigger>
              <TabsTrigger value="pirep" className="text-xs px-3 py-1.5 h-auto">PIREP</TabsTrigger>
            </TabsList>
            
            {/* Use overflow container for tab content */}
            <div className="max-h-[calc(100vh-22rem)] overflow-y-auto pr-2 border-t pt-4"> {/* Adjusted max-h slightly */} 
              {/* Render Tab Content Components */}
              <TabsContent value="summary" className="mt-0">
                <SummaryTab 
                  flightOverview={mockBriefingData.flightOverview}
                  waypoints={mockBriefingData.waypoints} // Pass only necessary parts if optimizing later
                  recommendations={mockBriefingData.recommendations}
                />
              </TabsContent>
              
              <TabsContent value="metar-taf" className="mt-0">
                <MetarTafTab waypoints={mockBriefingData.waypoints} />
              </TabsContent>
              
              <TabsContent value="sigmet" className="mt-0">
                 <SigmetAirmetTab sigmetsAirmets={mockBriefingData.sigmetsAirmets} />
              </TabsContent>
              
              <TabsContent value="pirep" className="mt-0">
                 <PirepTab pireps={mockBriefingData.pireps} />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
} 