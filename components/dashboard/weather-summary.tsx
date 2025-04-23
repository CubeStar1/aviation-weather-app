"use client"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  Sun,
  CloudSun,
  Cloud,
  CloudRain,
  HelpCircle,
  ArrowUp,
  Droplet,
  Thermometer,
  Gauge,
  Eye,
  Wind,
  Layers,
  ThermometerSun,
  CheckCircle2,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Define the structure for the data this component expects
interface WeatherWarning {
  type: "info" | "warning" | "danger";
  text: string;
}

interface HourlyForecastData {
  time: string;
  condition: string;
  temp: number; // Assuming temp is passed (e.g., tempF or tempC)
}

export interface WeatherSummaryData {
  temperature: number; // e.g., 78 F
  feelsLike?: number; // Added feelsLike
  condition: string;   // e.g., "Clear"
  windSpeed: number;    // e.g., 8 kts
  windGust?: number;    // Added windGust
  windDirection: string; // e.g., "NE"
  humidity: number;     // e.g., 42 %
  pressure: number;     // e.g., 1013 hPa
  altimeterInHg?: number; // Added altimeterInHg
  visibility: number;   // e.g., 10 mi
  ceiling?: number | null; // Added ceiling (nullable)
  flightCategory?: string; // Added flightCategory
  heatIndex?: number | null; // Added heatIndex (nullable)
  dewPoint: number;     // e.g., 53 F
  warnings: WeatherWarning[];
  hourlyForecast?: HourlyForecastData[]; // Optional hourly forecast
}

interface WeatherSummaryProps {
  weatherData: WeatherSummaryData;
}

export function WeatherSummary({ weatherData }: WeatherSummaryProps) { // Accept props
  // Mock data removed - using props now
  
  // Determine weather icon based on condition
  const getWeatherIcon = (condition: string, sizeClass: string = "h-14 w-14") => {
    switch (condition?.toLowerCase()) {
      case "clear":
      case "skc":
        return <Sun className={`${sizeClass} text-amber-400`} />
      case "partly cloudy":
      case "few":
      case "sct":
        return <CloudSun className={`${sizeClass} text-slate-400`} />
      case "mostly cloudy":
      case "cloudy":
      case "bkn":
      case "ovc":
        return <Cloud className={`${sizeClass} text-slate-400`} />
      case "rain":
      case "light rain":
      case "heavy rain":
      case "showers":
        return <CloudRain className={`${sizeClass} text-blue-400`} />
      // TODO: Add more conditions (Snow, Fog, Thunderstorm etc.)
      default:
        return <HelpCircle className={`${sizeClass} text-slate-400`} />
    }
  }

  // Get badge color based on warning type
  const getWarningBadgeClass = (type: string) => {
    switch (type) {
      case "danger":
        return "bg-red-500 hover:bg-red-600 text-white"
      case "warning":
        return "bg-amber-500 hover:bg-amber-600 text-white"
      case "info":
      default:
        return "bg-emerald-500 hover:bg-emerald-600 text-white"
    }
  }

  // Get wind direction arrow rotation
  const getWindArrowRotation = (direction: string) => {
    if (!direction || typeof direction !== "string") return 0
    const directions: Record<string, number> = {
      N: 0,    NNE: 22.5, NE: 45,   ENE: 67.5,
      E: 90,   ESE: 112.5,SE: 135,  SSE: 157.5,
      S: 180,  SSW: 202.5,SW: 225,  WSW: 247.5,
      W: 270,  WNW: 292.5,NW: 315,  NNW: 337.5,
    }
    return directions[direction.toUpperCase()] || 0
  }

  const mainIconCondition = weatherData.condition; // Use condition from props
  const mainIconSvg = getWeatherIcon(mainIconCondition, "h-14 w-14");

  return (
    <Card className="h-full shadow-sm border-amber-500/20 bg-gradient-to-br from-amber-500/5 via-background to-background rounded-xl overflow-hidden flex flex-col">
      <CardHeader className="px-5 py-3 border-b border-amber-500/10">
        <CardTitle className="text-base font-medium text-amber-800 dark:text-amber-300">
          Current Weather
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex flex-col h-full">
        <div className="p-5 space-y-4 flex-grow">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="text-amber-400">{mainIconSvg}</div>
              <div>
                <div className="text-4xl font-bold leading-none">
                  {weatherData.temperature}°F
                </div>
                {weatherData.feelsLike && (
                    <div className="text-xs text-slate-500 dark:text-slate-400 -mt-1">
                        Feels like {weatherData.feelsLike}°F
                    </div>
                )}
                <div className="text-sm text-slate-600 dark:text-slate-300 capitalize mt-1">
                  {weatherData.condition}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end text-sm text-amber-700 dark:text-amber-300">
              <div className="flex items-center gap-1.5">
                <ArrowUp
                  className="h-4 w-4"
                  style={{
                    transform: `rotate(${getWindArrowRotation(
                      weatherData.windDirection
                    )}deg)`,
                  }}
                />
                <span className="font-medium">
                  {weatherData.windDirection || "N/A"} {weatherData.windSpeed} kts
                </span>
              </div>
              {weatherData.windGust && weatherData.windGust > weatherData.windSpeed && (
                <div className="text-xs text-muted-foreground mt-0.5">
                  Gusts: {weatherData.windGust} kts
                </div>
              )}
            </div>
          </div>

          {weatherData.warnings && weatherData.warnings.length > 0 && (
            <div>
              {weatherData.warnings.map((warning, index) => (
                <div
                  key={index}
                  className={cn(
                    "px-3 py-1.5 rounded-md text-center font-medium text-xs shadow-sm",
                    getWarningBadgeClass(warning.type)
                  )}
                >
                  {warning.text}
                </div>
              ))}
            </div>
          )}

          {/* Weather details grid - Back to 2 columns, 4 rows */}
          <div className="grid grid-cols-2 gap-x-5 gap-y-4 pt-2"> 
            {[ // Array for 8 items in the desired 2x4 order
                { icon: Droplet, label: "Humidity", value: `${weatherData.humidity}%` },
                { icon: Thermometer, label: "Dew Point", value: `${weatherData.dewPoint}°F` },
                { icon: Gauge, label: "Pressure", value: `${weatherData.pressure} hPa` },
                { icon: Eye, label: "Visibility", value: `${weatherData.visibility} mi` },
                { // Altimeter
                  icon: Gauge, // Reusing Gauge icon 
                  label: "Altimeter", 
                  value: weatherData.altimeterInHg ? `${weatherData.altimeterInHg.toFixed(2)} inHg` : "N/A" 
                },
                { // Ceiling
                  icon: Layers, 
                  label: "Ceiling", 
                  value: typeof weatherData.ceiling === 'number' ? `${weatherData.ceiling.toLocaleString()} ft` : "Unlimited"
                },
                { // Flight Rules
                  icon: CheckCircle2, // Icon for VFR/Flight Rules
                  label: "Flight Rules", 
                  value: weatherData.flightCategory || "N/A" 
                },
                { // Heat Index
                  icon: ThermometerSun, 
                  label: "Heat Index", 
                  value: weatherData.heatIndex ? `${weatherData.heatIndex}°F` : "N/A" 
                },
            ].map(({ icon: Icon, label, value }) => (
                 <div key={label} className="flex items-center gap-1.5">
                    <Icon className="h-4 w-4 text-amber-500 flex-shrink-0" />
                    <div>
                        <span className="text-slate-500 dark:text-slate-400 text-xs leading-tight">
                        {label}
                        </span>
                        <span className="block font-medium text-sm leading-tight">
                        {value}
                        </span>
                    </div>
                 </div>
            ))}
          </div>
        </div>

        {weatherData.hourlyForecast && weatherData.hourlyForecast.length > 0 && (
          <div className="grid grid-cols-5 border-t border-amber-500/10 bg-background/10 dark:bg-black/10">
            {weatherData.hourlyForecast
              .slice(0, 5)
              .map((forecast, index) => (
                <div
                  key={index}
                  className="text-center p-2 flex flex-col items-center border-r border-amber-500/5 last:border-r-0"
                >
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mb-0.5">
                    {forecast.time}
                  </div>
                  {getWeatherIcon(forecast.condition, "h-5 w-5")}
                  <div className="text-xs font-medium mt-0.5">{forecast.temp}°F</div>
                </div>
              ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 