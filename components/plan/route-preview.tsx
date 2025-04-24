"use client"

import * as React from "react"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ExternalLink, List, Map, FileText, Loader2, AlertCircle, Plane, Navigation, ArrowRight } from "lucide-react"

import { fetchFlightBriefing, BriefingApiResponse } from "@/lib/fetchers/briefing"

import { WaypointList } from "./waypoint-list"
import { MapView } from "./map-view"
import { BriefingSummaryTab } from "./briefing-summary-tab"

interface RoutePreviewProps {
  plan: string | null;
}

export function RoutePreview({ plan: planString }: RoutePreviewProps) {
  
  const { 
    data: briefingData, 
    isLoading, 
    isError, 
    error 
  } = useQuery<BriefingApiResponse, Error>({
    queryKey: ['flightBriefing', planString], 
    queryFn: () => fetchFlightBriefing(planString), 
    enabled: !!planString, 
    staleTime: 5 * 60 * 1000, 
    refetchOnWindowFocus: false, 
  });

  if (isLoading && planString) {
    return (
      <div className="h-80 flex flex-col items-center justify-center text-center text-muted-foreground text-sm border border-dashed rounded-lg bg-muted/30">
         <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
        <p>Fetching weather briefing for your route...</p>
      </div>
    );
  }

  if (!planString) {
    return (
      <div className="h-80 flex flex-col items-center justify-center text-center px-4 py-6 bg-gradient-to-b from-background to-muted/30 border border-dashed rounded-lg">
        <Plane className="h-10 w-10 text-primary/30 mb-3 rotate-45" />
        <h3 className="text-base font-semibold text-primary">Ready for Takeoff</h3>
        <p className="text-sm text-muted-foreground mt-2 max-w-sm">
          Complete your flight plan with at least a departure and arrival airport, then click "Update Preview" to see your route details.
        </p>
        
        <div className="flex items-center justify-center mt-6 space-x-2 text-muted-foreground/50">
          <Navigation className="h-4 w-4" />
          <ArrowRight className="h-3 w-3" />
          <Map className="h-4 w-4" />
          <ArrowRight className="h-3 w-3" />
          <FileText className="h-4 w-4" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
       <div className="h-80 flex items-center justify-center text-center text-destructive text-sm border border-destructive/30 rounded-lg bg-destructive/5 px-4">
         <Alert variant="destructive" className="text-left">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Fetching Briefing</AlertTitle>
          <AlertDescription>
            {error?.message || "An unknown error occurred."}
          </AlertDescription>
        </Alert>
       </div>
    );
  }
  
  const hasApiErrors = briefingData?.errors && briefingData.errors.length > 0;

  if (!briefingData || hasApiErrors) {
      return (
        <div className="h-80 flex items-center justify-center text-center text-destructive text-sm border border-destructive/30 rounded-lg bg-destructive/5 px-4">
           <Alert variant="destructive" className="text-left">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Briefing Error</AlertTitle>
            <AlertDescription>
              {briefingData?.errors?.join(", ") || "Could not retrieve briefing details."}
            </AlertDescription>
          </Alert>
        </div>
      )
  }

  const briefingLink = `/briefing?route=${encodeURIComponent(planString || '')}`;

  return (
    <Tabs defaultValue="list" className="relative flex flex-col h-full">
      {/* Tabs List */} 
      <TabsList className="grid w-full grid-cols-3 gap-2 mb-4 shrink-0">
        <TabsTrigger value="list" className="text-xs px-3 py-1.5 h-auto data-[state=active]:shadow-sm flex items-center justify-center">
          <List className="h-3.5 w-3.5 mr-1.5" /> List View
        </TabsTrigger>
        <TabsTrigger value="map" className="text-xs px-3 py-1.5 h-auto data-[state=active]:shadow-sm flex items-center justify-center">
          <Map className="h-3.5 w-3.5 mr-1.5" /> Map View
        </TabsTrigger>
        <TabsTrigger value="briefing" className="text-xs px-3 py-1.5 h-auto data-[state=active]:shadow-sm flex items-center justify-center">
          <FileText className="h-3.5 w-3.5 mr-1.5" /> Briefing Summary
        </TabsTrigger>
      </TabsList>

      {/* Tabs Content Area */} 
      <div className="flex-grow overflow-hidden">
         {/* Pass fetched data to sub-components */}
          <TabsContent value="list" className="mt-0 h-full">
             <WaypointList waypoints={briefingData.waypoints} metarData={briefingData.metar} />
          </TabsContent>
          
          <TabsContent value="map" className="mt-0 h-full">
             <MapView waypoints={briefingData.waypoints} sigmets={briefingData.airsigmets} /> { /* Pass relevant data */}
          </TabsContent>
          
          <TabsContent value="briefing" className="mt-0 h-full">
            <BriefingSummaryTab briefing={briefingData} />
          </TabsContent>
      </div>

      {/* Footer Button - kept outside scroll usually */}
      <div className="p-4 pt-4 border-t mt-auto shrink-0">
        <Button asChild size="sm" className="w-full h-9">
          <Link href={briefingLink}>
             View Full Detailed Briefing <ExternalLink className="h-4 w-4 ml-1.5" />
          </Link>
        </Button>
      </div>
    </Tabs>
    
  )
}