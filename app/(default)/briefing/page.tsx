'use client'

import { useSearchParams, useRouter } from 'next/navigation' 
import { useQuery } from '@tanstack/react-query' 
import { useEffect, useState, Suspense } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, AlertCircle } from 'lucide-react'

import { fetchFlightBriefing, BriefingApiResponse } from "@/lib/fetchers/briefing"

import { FlightRouteHeader } from "@/components/briefing/flight-route-header"
import { SummaryTab } from "@/components/briefing/summary-tab"
import { MetarTafTab } from "@/components/briefing/metar-taf-tab"
import { SigmetAirmetTab } from "@/components/briefing/sigmet-airmet-tab"
import { PirepTab } from "@/components/briefing/pirep-tab"
import { AiSummaryTab } from "@/components/briefing/ai-summary-tab" 
import { PageHeader } from "@/components/ui/page-header"

function LoadingState() {
  return (
    <div className="container mx-auto px-4 py-2 space-y-6 flex flex-col items-center justify-center h-[calc(100vh-10rem)]">
      <PageHeader title="Weather Briefing" />
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <p className="text-muted-foreground">Loading briefing...</p>
    </div>
  );
}

function BriefingContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const routeString = searchParams.get('route')
  const [isInitializing, setIsInitializing] = useState(true)

  useEffect(() => {
    if (!routeString) {
      try {
        const savedPlanRaw = localStorage.getItem('flightPlanWaypoints')
        if (savedPlanRaw) {
          const waypoints = JSON.parse(savedPlanRaw)
          if (Array.isArray(waypoints) && waypoints.length > 0) {
            const planString = waypoints
              .map(wp => `${wp.airport},${wp.altitude}`)
              .join(',')
            router.replace(`/briefing?route=${encodeURIComponent(planString)}`)
            return
          }
        }
      } catch (error) {
        console.error("Failed to load flightPlanWaypoints:", error)
      }
      router.replace('/plan')
      return
    }
    setIsInitializing(false)
  }, [routeString, router])

  const { 
    data: briefingData, 
    isLoading, 
    isError, 
    error 
  } = useQuery<BriefingApiResponse, Error>({
    queryKey: ['flightBriefing', routeString], 
    queryFn: () => fetchFlightBriefing(routeString!), 
    enabled: !!routeString && !isInitializing, 
    staleTime: 5 * 60 * 1000, 
    refetchOnWindowFocus: false, 
  });

  if (isInitializing || isLoading) {
    return <LoadingState />;
  }
  
  if (!routeString) {
    return (
      <div className="container mx-auto px-4 py-2 space-y-6 flex flex-col items-center justify-center h-[calc(100vh-10rem)]">
        <PageHeader title="Weather Briefing" />
        <Alert variant="destructive" className="w-full max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Missing Route</AlertTitle>
          <AlertDescription>
            No flight route was provided in the URL. Please go back and generate a route first.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!isInitializing && (isError || !briefingData)) {
    return (
      <div className="container mx-auto px-4 py-2 space-y-6 flex flex-col items-center justify-center h-[calc(100vh-10rem)]">
        <PageHeader title="Weather Briefing" />
        <Alert variant="destructive" className="w-full max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Fetching Briefing</AlertTitle>
          <AlertDescription>
            {error?.message || "An unknown error occurred while fetching the briefing data."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  if (!briefingData) return null;
  
  return (
    <div className="container mx-auto px-4 py-2 space-y-6">
      <PageHeader title="Weather Briefing" />
      
      <FlightRouteHeader briefing={briefingData} /> 
      
      <Card className="shadow-md border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background overflow-hidden">
        <CardContent className="p-4">
          <Tabs defaultValue="summary" className="relative">
            <TabsList className="grid grid-cols-5 gap-2 mb-4 border border-primary/20">
              <TabsTrigger value="summary" className="text-xs px-3 py-1.5 h-auto">Summary</TabsTrigger>
              <TabsTrigger value="ai-summary" className="text-xs px-3 py-1.5 h-auto">AI Analysis</TabsTrigger>
              <TabsTrigger value="metar-taf" className="text-xs px-3 py-1.5 h-auto">METAR</TabsTrigger>
              <TabsTrigger value="sigmet" className="text-xs px-3 py-1.5 h-auto">SIGMET/AIRMET</TabsTrigger>
              <TabsTrigger value="pirep" className="text-xs px-3 py-1.5 h-auto">PIREP</TabsTrigger>
            </TabsList>
            
            <div className="max-h-[calc(100vh-22rem)] pr-2 border-t pt-4">
              <TabsContent value="summary" className="mt-0">
                <SummaryTab briefing={briefingData} />
              </TabsContent>

              <TabsContent value="ai-summary" className="mt-0">
                <AiSummaryTab briefing={briefingData} />
              </TabsContent>
              
              <TabsContent value="metar-taf" className="mt-0">
                <MetarTafTab briefing={briefingData} />
              </TabsContent>
              
              <TabsContent value="sigmet" className="mt-0">
                 <SigmetAirmetTab briefing={briefingData} />
              </TabsContent>
              
              <TabsContent value="pirep" className="mt-0">
                 <PirepTab briefing={briefingData} />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

export default function BriefingPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <BriefingContent />
    </Suspense>
  );
}