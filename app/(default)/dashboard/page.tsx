import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AirportInfo } from "@/components/dashboard/airport-info"
import { Alerts, AlertData } from "@/components/dashboard/alerts"
import { WeatherStats, MetarTafData } from "@/components/dashboard/weather-stats"
import { WeatherMap } from "@/components/dashboard/weather-map"
import { TemperatureChart } from "@/components/dashboard/temperature-chart"
import { FlightPlanning, RecentRoute } from "@/components/dashboard/flight-planning"
import { WeatherSummary, WeatherSummaryData } from "@/components/dashboard/weather-summary"
import { GradientText } from "@/components/ui/gradient-text"
import { Particles } from "@/components/magicui/particles"
import { Meteors } from "@/components/magicui/meteors"
import { PageHeader } from "@/components/ui/page-header"
// --- Mock API Data Structure ---
interface AirportInfoData {
  name: string;
  icao: string;
  runway: string;
  elevation: string;
  metar: string;
  time: string;
  status: string; 
  flightConditions: string; 
}

// Combine all data for the dashboard
interface DashboardData {
  airportInfo: AirportInfoData;
  weatherSummary: WeatherSummaryData;
  weatherStats: MetarTafData;
  recentRoutes: RecentRoute[];
  alerts: AlertData[];
  lastUpdatedUTC: string;
}

// --- Mock API Response Object ---
const mockDashboardData: DashboardData = {
  lastUpdatedUTC: "17:53 UTC",
  airportInfo: {
    icao: "KPHX",
    name: "Phoenix Sky Harbor Intl",
    runway: "8/26",
    elevation: "1135 ft",
    metar: "KPHX 151753Z 27007KT 10SM FEW120 FEW200 32/09 A3005 RMK AO2 SLP140 T03170089",
    time: "17:53 UTC",
    status: "Active",
    flightConditions: "VFR",
  },
  weatherSummary: {
    temperature: 90, // Matches 32C roughly 
    feelsLike: 94, // Added Feels Like temperature
    condition: "Clear",
    windSpeed: 7,
    windGust: 15, // Added Wind Gust
    windDirection: "W", // Matches 270° roughly
    humidity: 25, // Correlates with 32C/9C Temp/Dew
    pressure: 1017, // Correlates with 30.05 inHg
    altimeterInHg: 30.05, // Added Altimeter inHg
    visibility: 10,
    dewPoint: 48, // Matches 9C roughly
    ceiling: null, // Added Ceiling (null for none)
    flightCategory: "VFR", // Added Flight Category
    heatIndex: 89, // Added Heat Index
    warnings: [ // Renamed from 'alert' to match component's internal name
      { type: "info", text: "Optimal flying conditions" }
    ],
    hourlyForecast: [ // Added hourly forecast data
       { time: "9AM", condition: "Clear", temp: 85 },
       { time: "12PM", condition: "Clear", temp: 90 },
       { time: "3PM", condition: "Clear", temp: 92 },
       { time: "6PM", condition: "Clear", temp: 88 },
       { time: "9PM", condition: "Clear", temp: 82 },
    ]
  },
  weatherStats: {
    metar: {
      wind: { direction: "270°", speed: "7 KT" },
      visibility: "10 SM",
      ceiling: "FEW at 12,000 ft, FEW at 20,000 ft",
      temperature: 32, // Component expects 'temperature', not 'temperatureC'
      dewpoint: 9, // Component expects 'dewpoint', not 'dewpointC'
      altimeter: "30.05 inHg", // Component expects 'altimeter', not 'altimeterInHg'
      remarks: "AO2 SLP140 T03170089",
      raw: "KPHX 151753Z 27007KT 10SM FEW120 FEW200 32/09 A3005 RMK AO2 SLP140 T03170089"
    },
    taf: {
      valid: "151700Z 151800Z", 
      forecast: [
        { time: "18:00-21:00", wind: "280° at 8 KT", visibility: ">6 SM", clouds: "FEW120", conditions: "No significant weather" },
        { time: "21:00-00:00", wind: "290° at 6 KT", visibility: ">6 SM", clouds: "FEW100 SCT200", conditions: "No significant weather" }
      ],
      raw: "KPHX 151700Z 1518/1618 27010KT P6SM FEW120 SCT200 FM152000 28008KT P6SM FEW100 SCT200"
    }
  },
  recentRoutes: [
    { id: 1, from: "KPHX", to: "KLAX", via: "KPSP", date: "Today" },
    { id: 2, from: "KPHX", to: "KLAS", via: "KGCN", date: "Yesterday" },
  ],
  alerts: [
     { id: "1", type: "INFO", message: "Optimal flying conditions reported.", time: "18:00 UTC", severity: "low" },
     { id: "2", type: "WARNING", message: "Potential for afternoon thunderstorms.", time: "14:00 UTC", severity: "medium" },
     { id: "3", type: "SIGMET", message: "SIGMET WHISKEY active for area XYZ.", time: "16:45 UTC", severity: "high" }
  ]
};

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background  ">
      <div className="container mx-auto px-4 py-6 space-y-6">
        <PageHeader title="Dashboard" />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          <div className="lg:col-span-1">
            <WeatherSummary weatherData={mockDashboardData.weatherSummary} />
          </div>
          <div className="lg:col-span-2 space-y-6 grid grid-rows-2">
            <TemperatureChart />
            <AirportInfo airportData={mockDashboardData.airportInfo} />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          <FlightPlanning recentRoutes={mockDashboardData.recentRoutes} />
          <WeatherMap />
          <Alerts alerts={mockDashboardData.alerts} />
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          <WeatherStats statsData={mockDashboardData.weatherStats} />
        </div>
      </div>
     

    </div>
  )
} 