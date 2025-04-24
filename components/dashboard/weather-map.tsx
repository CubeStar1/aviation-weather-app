"use client"

import React from "react"
import Link from "next/link"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Map as MapIcon,
  Radar,
  Satellite,
  AlertTriangle,
  ExternalLink,
  RefreshCw,
} from "lucide-react"

// Define a simplified MapDisplay component
// Dynamically import Leaflet components to prevent SSR issues
const DynamicMapDisplay = dynamic(
  () => import('./weather-map-display').then(mod => mod.WeatherMapDisplay),
  { 
    loading: () => (
      <div className="h-full flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <MapIcon className="h-8 w-8 mx-auto mb-2 text-blue-500/30 animate-pulse" />
          <p className="text-xs">Loading map...</p>
        </div>
      </div>
    ),
    ssr: false 
  }
)

export function WeatherMap() {
  const [selectedMapLayer, setSelectedMapLayer] = React.useState<string>("radar")
  const [isRefreshing, setIsRefreshing] = React.useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    // Simulate a refresh delay
    setTimeout(() => {
      setIsRefreshing(false)
    }, 800)
  }

  return (
    <Card className="h-full shadow-sm border-blue-500/20 bg-gradient-to-br from-blue-500/5 via-background to-background rounded-xl overflow-hidden flex flex-col">
      <CardHeader className="px-4 py-2 border-b border-blue-500/10 flex flex-row items-center justify-between">
        <CardTitle className="text-base font-medium text-blue-800 dark:text-blue-300">
          Map Overview
        </CardTitle>
        <div className="flex items-center gap-1">
          {/* Mini Tabs for quick layer preview selection */}
          <Tabs 
            value={selectedMapLayer} 
            onValueChange={setSelectedMapLayer}
            className="-my-1"
          >
            <TabsList className="h-7 text-xs px-0.5 bg-blue-500/10">
              <TabsTrigger
                value="radar"
                className="h-6 px-1.5 text-blue-700 dark:text-blue-300 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm"
              >
                <Radar className="h-3.5 w-3.5" />
              </TabsTrigger>
              <TabsTrigger
                value="satellite"
                className="h-6 px-1.5 text-blue-700 dark:text-blue-300 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm"
              >
                <Satellite className="h-3.5 w-3.5" />
              </TabsTrigger>
              <TabsTrigger
                value="sigmet"
                className="h-6 px-1.5 text-blue-700 dark:text-blue-300 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm"
              >
                <AlertTriangle className="h-3.5 w-3.5" />
              </TabsTrigger>
            </TabsList>
          </Tabs>
          {/* Refresh button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 rounded-full text-blue-700 dark:text-blue-300"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-grow relative min-h-[180px]">
        {isRefreshing ? (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
            <div className="text-center text-muted-foreground">
              <RefreshCw className="h-5 w-5 mx-auto mb-1 text-blue-500/60 animate-spin" />
              <p className="text-xs">Updating map data...</p>
            </div>
          </div>
        ) : null}
        <DynamicMapDisplay layer={selectedMapLayer} />
      </CardContent>
      {/* Link to Full Map Page */}
      <div className="p-2 border-t border-blue-500/10 mt-auto bg-background/30">
        <Button
          asChild
          size="sm"
          variant="outline"
          className="w-full h-7 text-xs border-blue-500/30 text-blue-700 dark:text-blue-300 hover:bg-blue-500/10 hover:text-blue-800 dark:hover:text-blue-200"
        >
          <Link href="/map">
            View Full Interactive Map{" "}
            <ExternalLink className="h-3 w-3 ml-1" />
          </Link>
        </Button>
      </div>
    </Card>
  )
} 