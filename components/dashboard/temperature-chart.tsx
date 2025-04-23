"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sun, Thermometer, CloudSun, Cloud, CloudRain, HelpCircle } from "lucide-react"

// Import the necessary types (adjust path if needed)
import { DashboardWeatherData } from "@/lib/fetchers/dashboard"

// Type for the incoming prop
interface TemperatureChartProps {
    forecastData?: DashboardWeatherData['hourlyForecast'];
}

// Simple icon mapping based on OWM condition strings
const getForecastIcon = (condition: string | undefined | null, sizeClass: string = "h-4 w-4") => {
    const lowerCondition = condition?.toLowerCase() || '';
    if (lowerCondition.includes("clear")) return <Sun className={`${sizeClass} text-amber-400`} />
    if (lowerCondition.includes("few clouds")) return <CloudSun className={`${sizeClass} text-slate-400`} />
    if (lowerCondition.includes("clouds")) return <Cloud className={`${sizeClass} text-slate-400`} /> // Covers scattered, broken, overcast
    if (lowerCondition.includes("rain") || lowerCondition.includes("shower")) return <CloudRain className={`${sizeClass} text-blue-400`} />
    // TODO: Add more specific conditions 
    return <HelpCircle className={`${sizeClass} text-slate-400`} />
}

export function TemperatureChart({ forecastData }: TemperatureChartProps) {
  // Use forecastData prop if available, otherwise use an empty array
  const chartData = forecastData || [];

  // Calculate max/min temp, handling empty array
  const temps = chartData.map(d => d.temp);
  const maxTemp = temps.length > 0 ? Math.max(...temps) : 0;
  const minTemp = temps.length > 0 ? Math.min(...temps) : 0;

  // Simplified height calculation relative to temp range
  const calculateHeight = (temp: number) => {
    const range = maxTemp > minTemp ? maxTemp - minTemp : 1; // Avoid division by zero
    const relativeTemp = temp - minTemp;
    const maxHeight = 60; 
    const minHeight = 10;
    // Scale height, ensure it's at least minHeight even if temp equals minTemp
    const scaledHeight = minHeight + (range > 0 ? (relativeTemp / range) * (maxHeight - minHeight) : 0);
    return Math.min(Math.max(scaledHeight, minHeight), maxHeight + minHeight); 
  };
  
  return (
    <Card className="h-full shadow-sm border-orange-500/20 bg-gradient-to-br from-orange-500/5 via-background to-background rounded-xl overflow-hidden flex flex-col">
      <CardHeader className="px-5 py-3 border-b border-orange-500/10 flex flex-row items-center justify-between">
        <CardTitle className="text-base font-medium text-orange-800 dark:text-orange-300">Temperature Today</CardTitle>
        {/* Optional: Unit Display */} 
        {chartData.length > 0 && (
            <div className="text-xs text-muted-foreground">°F</div> 
        )}
      </CardHeader>
      <CardContent className="pt-14 flex flex-col justify-center items-center flex-grow">
        {chartData.length > 0 ? (
          <>
            <div className="flex justify-between items-end h-[100px] w-full mb-2 px-2"> {/* Ensure full width */} 
              {chartData.map((data, index) => {
                  const Icon = getForecastIcon(data.condition); // Get icon based on condition
                  return (
                     <div key={index} className="flex flex-col items-center space-y-1 flex-1 text-center"> {/* Use flex-1 for even spacing */} 
                        <span className="text-xs font-medium">{data.temp}°</span>
                        <div 
                            className="bg-gradient-to-t from-amber-400 to-orange-400 rounded-full w-5 transition-all duration-300 ease-in-out" 
                            style={{ height: `${calculateHeight(data.temp)}px` }}
                            title={`${data.temp}°F - ${data.condition} at ${data.time}`}
                        ></div>
                        {Icon} {/* Display the mapped icon */}
                        <span className="text-xs text-muted-foreground">{data.time}</span>
                      </div>
                  )
              })}
            </div>
            <div className="flex justify-center items-center text-xs text-muted-foreground space-x-4 pt-2 border-t border-orange-500/10 w-full mt-auto"> {/* Push to bottom */}
                <span><span className="inline-block w-2 h-2 bg-orange-400 rounded-full mr-1"></span>Today</span>
                <span>High: <span className="font-medium text-foreground">{maxTemp}°F</span></span>
                <span>Low: <span className="font-medium text-foreground">{minTemp}°F</span></span>
            </div>
          </>
        ) : (
          <div className="text-center text-muted-foreground text-sm py-10">
            Temperature forecast data is unavailable.
          </div>
        )}
      </CardContent>
    </Card>
  );
} 