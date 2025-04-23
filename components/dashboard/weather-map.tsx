"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Map as MapIcon,
  Radar,
  Satellite,
  AlertTriangle,
  ExternalLink,
} from "lucide-react"

// TODO: Add props for preview data (e.g., route, area)

export function WeatherMap() {
  return (
    <Card className="h-full shadow-sm border-blue-500/20 bg-gradient-to-br from-blue-500/5 via-background to-background rounded-xl overflow-hidden flex flex-col">
      <CardHeader className="px-5 py-3 border-b border-blue-500/10 flex flex-row items-center justify-between">
        <CardTitle className="text-base font-medium text-blue-800 dark:text-blue-300">
          Map Overview
        </CardTitle>
        {/* Mini Tabs for quick layer preview selection */}
        <Tabs defaultValue="radar" className="-my-1">
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
      </CardHeader>
      <CardContent className="p-5 flex-grow flex flex-col items-center justify-center">
        {/* Improved Placeholder */}
        <div className="text-center text-muted-foreground">
          <MapIcon className="h-12 w-12 mx-auto mb-3 text-blue-500/30" />
          <p className="text-sm mb-1">Map Preview Unavailable</p>
          <p className="text-xs max-w-[200px]">
            Detailed map layers (Radar, Satellite, SIGMETs) are available on the
            full map page.
          </p>
        </div>
      </CardContent>
      {/* Link to Full Map Page */}
      <div className="p-3 border-t border-blue-500/10 mt-auto bg-background/30">
        <Button
          asChild
          size="sm"
          variant="outline"
          className="w-full h-8 text-xs border-blue-500/30 text-blue-700 dark:text-blue-300 hover:bg-blue-500/10 hover:text-blue-800 dark:hover:text-blue-200"
        >
          <Link href="/map">
            View Full Interactive Map{" "}
            <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
          </Link>
        </Button>
      </div>
    </Card>
  )
} 