"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sun, Thermometer } from "lucide-react"

// TODO: Add props for chart data

export function TemperatureChart() {
  // Hardcoded data for demonstration
  const tempData = [
    { time: "06:00", temp: 20, icon: Sun },
    { time: "09:00", temp: 24, icon: Sun },
    { time: "12:00", temp: 28, icon: Sun },
    { time: "15:00", temp: 30, icon: Sun },
    { time: "18:00", temp: 26, icon: Sun },
    { time: "21:00", temp: 22, icon: Sun },
  ];

  const maxTemp = Math.max(...tempData.map(d => d.temp));
  const minTemp = Math.min(...tempData.map(d => d.temp));

  // Simplified height calculation relative to max temp
  const calculateHeight = (temp: number) => {
    // Avoid division by zero or negative range
    const range = maxTemp > minTemp ? maxTemp - minTemp : 1;
    const relativeTemp = temp - minTemp;
    // Scale height (e.g., max height 80px), minimum height 10px
    const maxHeight = 60; 
    const minHeight = 10;
    const scaledHeight = minHeight + (relativeTemp / range) * (maxHeight - minHeight);
    // Cap height just in case
    return Math.min(Math.max(scaledHeight, minHeight), maxHeight + minHeight); 
  };
  
  return (
    <Card className="h-full shadow-sm border-orange-500/20 bg-gradient-to-br from-orange-500/5 via-background to-background rounded-xl overflow-hidden">
      <CardHeader className="px-5 py-3 border-b border-orange-500/10 flex flex-row items-center justify-between">
        <CardTitle className="text-base font-medium text-orange-800 dark:text-orange-300">Temperature Today</CardTitle>
        <div className="text-xs text-muted-foreground">°C</div> {/* Example unit toggle */} 
      </CardHeader>
      <CardContent className="pt-14">
        <div className="flex justify-between items-end h-[100px] mb-2"> {/* Set fixed height for chart area */}
          {tempData.map((data, index) => (
            <div key={index} className="flex flex-col items-center space-y-1 w-1/6">
              <span className="text-xs font-medium">{data.temp}°</span>
              <div 
                className="bg-gradient-to-t from-amber-400 to-orange-400 rounded-full w-5 transition-all duration-300 ease-in-out" 
                style={{ height: `${calculateHeight(data.temp)}px` }}
                title={`${data.temp}°C at ${data.time}`}
              ></div>
              <data.icon className="h-4 w-4 text-amber-400 mt-1" />
              <span className="text-xs text-muted-foreground">{data.time}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-center items-center text-xs text-muted-foreground space-x-4 pt-2 border-t border-orange-500/10">
          <span><span className="inline-block w-2 h-2 bg-orange-400 rounded-full mr-1"></span>Today</span>
          <span>High: <span className="font-medium text-foreground">{maxTemp}°C</span></span>
          <span>Low: <span className="font-medium text-foreground">{minTemp}°C</span></span>
        </div>
      </CardContent>
    </Card>
  );
} 