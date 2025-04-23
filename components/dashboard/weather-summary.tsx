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

// Import the type from the fetcher
import { DashboardWeatherData } from "@/lib/fetchers/dashboard"

// Define props using the imported type
interface WeatherSummaryProps {
  weatherData: DashboardWeatherData;
}

export function WeatherSummary({ weatherData }: WeatherSummaryProps) { 
  
  // Determine weather icon based on condition string from API
  const getWeatherIcon = (condition: string | undefined | null, sizeClass: string = "h-14 w-14") => {
    const lowerCondition = condition?.toLowerCase() || '';
    if (lowerCondition.includes("clear")) return <Sun className={`${sizeClass} text-amber-400`} />
    if (lowerCondition.includes("few clouds")) return <CloudSun className={`${sizeClass} text-slate-400`} />
    if (lowerCondition.includes("clouds")) return <Cloud className={`${sizeClass} text-slate-400`} /> // Covers scattered, broken, overcast
    if (lowerCondition.includes("rain") || lowerCondition.includes("shower")) return <CloudRain className={`${sizeClass} text-blue-400`} />
    // TODO: Add more specific conditions (Snow, Fog, Thunderstorm etc.) based on OWM descriptions
    return <HelpCircle className={`${sizeClass} text-slate-400`} />
  }

  // Get badge color based on warning type (kept for potential future use, but OWM basic doesn't provide warnings)
  const getWarningBadgeClass = (type: string) => {
      // ... (logic remains same) ...
      switch (type) {
        case "danger": return "bg-red-500 hover:bg-red-600 text-white";
        case "warning": return "bg-amber-500 hover:bg-amber-600 text-white";
        case "info": default: return "bg-emerald-500 hover:bg-emerald-600 text-white";
      }
  }

  // Get wind direction arrow rotation
  const getWindArrowRotation = (direction: string | undefined | null) => {
      if (!direction || typeof direction !== "string") return 0;
      // ... (logic remains same) ...
      const directions: Record<string, number> = {
          N: 0,    NNE: 22.5, NE: 45,   ENE: 67.5,
          E: 90,   ESE: 112.5,SE: 135,  SSE: 157.5,
          S: 180,  SSW: 202.5,SW: 225,  WSW: 247.5,
          W: 270,  WNW: 292.5,NW: 315,  NNW: 337.5,
          VAR: 0, // Handle Variable if provided
        }
        return directions[direction.toUpperCase()] || 0;
  }

  const mainIconCondition = weatherData.condition;
  const mainIconSvg = getWeatherIcon(mainIconCondition, "h-14 w-14");

  // Helper to display value or fallback
  const displayValue = (value: number | string | null | undefined, unit: string = '', fallback: string = 'N/A') => {
      return (value !== null && value !== undefined) ? `${value}${unit}` : fallback;
  }

  return (
    <Card className="h-full shadow-sm border-amber-500/20 bg-gradient-to-br from-amber-500/5 via-background to-background rounded-xl overflow-hidden flex flex-col">
      <CardHeader className="px-5 py-3 border-b border-amber-500/10">
        <CardTitle className="text-base font-medium text-amber-800 dark:text-amber-300">
          Current Weather {weatherData.name ? `- ${weatherData.name}` : ''} {/* Display location name */}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex flex-col h-full">
        <div className="p-5 space-y-4 flex-grow">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="text-amber-400">{mainIconSvg}</div>
              <div>
                <div className="text-4xl font-bold leading-none">
                  {displayValue(weatherData.temperature, '°F', '--')}
                </div>
                {weatherData.feelsLike !== null && (
                    <div className="text-xs text-slate-500 dark:text-slate-400 -mt-1">
                        Feels like {displayValue(weatherData.feelsLike, '°F')}
                    </div>
                )}
                <div className="text-sm text-slate-600 dark:text-slate-300 capitalize mt-1">
                  {weatherData.condition || 'N/A'}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end text-sm text-amber-700 dark:text-amber-300">
              <div className="flex items-center gap-1.5">
                <ArrowUp
                  className="h-4 w-4"
                  style={{
                    transform: `rotate(${getWindArrowRotation(weatherData.windDirection)}deg)`,
                  }}
                />
                <span className="font-medium">
                   {weatherData.windDirection || 'N/A'} {displayValue(weatherData.windSpeed, ' mph')} {/* Use mph from OWM */}
                </span>
              </div>
              {weatherData.windGust && weatherData.windGust > (weatherData.windSpeed ?? 0) && (
                <div className="text-xs text-muted-foreground mt-0.5">
                  Gusts: {displayValue(weatherData.windGust, ' mph')}
                </div>
              )}
            </div>
          </div>

          {/* Warnings section kept, though data isn't provided by basic OWM */}
          {weatherData.warnings && weatherData.warnings.length > 0 && (
            <div>
              {weatherData.warnings.map((warning, index) => (
                <div
                  key={index}
                  className={cn(
                    "px-3 py-1.5 rounded-md text-center font-medium text-xs shadow-sm",
                    getWarningBadgeClass(warning.type) // Assuming warning has a 'type'
                  )}
                >
                  {warning.text} {/* Assuming warning has 'text' */}
                </div>
              ))}
            </div>
          )}

          {/* Weather details grid - uses displayValue helper */}
          <div className="grid grid-cols-2 gap-x-5 gap-y-4 pt-2"> 
            {[ 
                { icon: Droplet, label: "Humidity", value: displayValue(weatherData.humidity, '%') },
                { icon: Thermometer, label: "Dew Point", value: displayValue(weatherData.dewPoint, '°F') },
                { icon: Gauge, label: "Pressure", value: displayValue(weatherData.pressure, ' hPa') },
                { icon: Eye, label: "Visibility", value: displayValue(weatherData.visibility, ' mi') },
                { icon: Gauge, label: "Altimeter", value: displayValue(weatherData.altimeterInHg, ' inHg') },
                { icon: Layers, label: "Ceiling", value: weatherData.ceiling ? `${weatherData.ceiling.toLocaleString()} ft` : "Unlimited" },
                { icon: CheckCircle2, label: "Flight Rules", value: displayValue(weatherData.flightCategory) },
                { icon: ThermometerSun, label: "Heat Index", value: displayValue(weatherData.heatIndex, '°F') },
            ].map(({ icon: Icon, label, value }) => (
                 value !== 'N/A' && value !== 'Unlimited' && value !== '--' && value !== '--°F' && value !== '--%' && value !== '-- hPa' && value !== '-- mi' && value !== '-- inHg' && (
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
                 )
            ))}
          </div>
        </div>

        {/* Hourly forecast display */}
        {weatherData.hourlyForecast && weatherData.hourlyForecast.length > 0 && (
          <div className="grid grid-cols-5 border-t border-amber-500/10 bg-background/10 dark:bg-black/10">
            {weatherData.hourlyForecast
              .slice(0, 5) // Show first 5 forecasts
              .map((forecast, index) => (
                <div
                  key={index}
                  className="text-center p-2 flex flex-col items-center border-r border-amber-500/5 last:border-r-0"
                >
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mb-0.5">
                    {forecast.time}
                  </div>
                  {getWeatherIcon(forecast.condition, "h-5 w-5")} {/* Use condition for icon */}
                  <div className="text-xs font-medium mt-0.5">{forecast.temp}°F</div>
                </div>
              ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 