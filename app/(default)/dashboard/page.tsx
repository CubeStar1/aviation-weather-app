'use client'

import { useState, useEffect, FormEvent } from "react"
import { useQuery } from "@tanstack/react-query"
import Link from 'next/link'

import { PageHeader } from "@/components/ui/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert as ShadcnAlert, AlertDescription, AlertTitle } from "@/components/ui/alert"

import { AirportInfo } from "@/components/dashboard/airport-info"
import { Alerts } from "@/components/dashboard/alerts"
import { WeatherStats } from "@/components/dashboard/weather-stats"
import { WeatherMap } from "@/components/dashboard/weather-map"
import { TemperatureChart } from "@/components/dashboard/temperature-chart"
import { FlightPlanning, Waypoint } from "@/components/dashboard/flight-planning"
import { WeatherSummary } from "@/components/dashboard/weather-summary"

import { fetchDashboardWeather, DashboardWeatherData } from "@/lib/fetchers/dashboard"
import { fetchFlightBriefing, BriefingApiResponse } from "@/lib/fetchers/briefing"

import { AlertCircle } from "lucide-react"

const DEFAULT_CITY = "London"
const DEFAULT_ICAO = "EGLL"

export default function DashboardPage() {
  const [cityInput, setCityInput] = useState("")
  const [icaoInput, setIcaoInput] = useState("")
  const [locationQuery, setLocationQuery] = useState<string | null>(null)
  const [currentPlanWaypoints, setCurrentPlanWaypoints] = useState<Waypoint[]>([])

  useEffect(() => {
    const savedCity = localStorage.getItem("userCity")
    const savedIcao = localStorage.getItem("userIcao")
    setCityInput(savedCity || DEFAULT_CITY)
    setIcaoInput(savedIcao || DEFAULT_ICAO)
    setLocationQuery(savedCity || DEFAULT_CITY)

    try {
      const savedPlanRaw = localStorage.getItem('flightPlanWaypoints')
      if (savedPlanRaw) {
        const parsedWaypoints = JSON.parse(savedPlanRaw)
        if (Array.isArray(parsedWaypoints)) {
          setCurrentPlanWaypoints(parsedWaypoints)
        }
      }
    } catch (error) {
      console.error("Failed to load flightPlanWaypoints:", error)
      setCurrentPlanWaypoints([])
    }
  }, [])

  const { 
    data: dashboardData, 
    isLoading: isLoadingWeather,
    isError: isWeatherError, 
    error: weatherError 
  } = useQuery<DashboardWeatherData, Error>({
    queryKey: ['dashboardWeather', locationQuery],
    queryFn: () => fetchDashboardWeather(locationQuery!),
    enabled: !!locationQuery,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  })

  const { 
    data: briefingData, 
    isLoading: isLoadingBriefing
  } = useQuery<BriefingApiResponse, Error>({
    queryKey: ['flightBriefing', currentPlanWaypoints],
    queryFn: () => {
      const planString = currentPlanWaypoints
        .map(wp => `${wp.airport},${wp.altitude}`)
        .join(',');
      return fetchFlightBriefing(planString);
    },
    enabled: currentPlanWaypoints.length > 0,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  })

  const handleLocationUpdate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (cityInput) {
      localStorage.setItem("userCity", cityInput)
      localStorage.setItem("userIcao", icaoInput)
      setLocationQuery(cityInput)
    }
  }

  if (isLoadingWeather || locationQuery === null) {
    return (
      <div className="container mx-auto px-4 py-6 space-y-6 animate-pulse">
        <PageHeader title="Dashboard" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          <Skeleton className="h-[300px] lg:col-span-1 rounded-xl" /> 
          <div className="lg:col-span-2 space-y-6 grid grid-rows-2">
            <Skeleton className="h-[150px] rounded-xl" />
            <Skeleton className="h-[150px] rounded-xl" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          <Skeleton className="h-[200px] rounded-xl" />
          <Skeleton className="h-[200px] rounded-xl" />
          <Skeleton className="h-[200px] rounded-xl" />
        </div>
        <div className="grid grid-cols-1 gap-6">
          <Skeleton className="h-[180px] rounded-xl" />
        </div>
      </div>
    )
  }

  if (isWeatherError) {
    return (
      <div className="container mx-auto px-4 py-6 space-y-6 flex flex-col items-center">
        <PageHeader title="Dashboard" />
        <ShadcnAlert variant="destructive" className="w-full max-w-lg">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Fetching Weather</AlertTitle>
          <AlertDescription>
            {weatherError?.message || "An unknown error occurred while fetching weather data."}
          </AlertDescription>
        </ShadcnAlert>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background">
      <div className="container mx-auto px-4 py-6 space-y-6">
        <PageHeader title="Dashboard" />
        
        <Card className="shadow-sm border-amber-500/20 bg-gradient-to-br from-amber-500/5 via-background to-background rounded-xl overflow-hidden">
          <CardHeader className="px-5 py-3 border-b border-amber-500/10">
            <CardTitle className="text-base font-medium text-amber-800 dark:text-amber-300">Location</CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            <form onSubmit={handleLocationUpdate} className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1">
                <Label htmlFor="cityInput" className="text-slate-500 dark:text-slate-400 text-xs">City</Label>
                <Input 
                  id="cityInput"
                  type="text" 
                  value={cityInput} 
                  onChange={(e) => setCityInput(e.target.value)} 
                  placeholder="Enter city name (e.g., London)"
                  required 
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="icaoInput" className="text-slate-500 dark:text-slate-400 text-xs">ICAO (Optional)</Label>
                <Input 
                  id="icaoInput"
                  type="text" 
                  value={icaoInput} 
                  onChange={(e) => setIcaoInput(e.target.value)} 
                  placeholder="Enter airport ICAO (e.g., EGLL)" 
                  maxLength={4}
                />
              </div>
              <Button 
                type="submit" 
                variant="outline" 
                className="border-amber-500/50 text-amber-700 hover:bg-amber-500/10 dark:text-amber-300 dark:hover:bg-amber-500/10"
              >
                Update Location
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          <div className="lg:col-span-1">
            {dashboardData && <WeatherSummary weatherData={dashboardData} />}
          </div>
          <div className="lg:col-span-2 space-y-6 grid grid-rows-2">
            <TemperatureChart forecastData={dashboardData?.hourlyForecast} />
            <AirportInfo airportData={{
              icao: icaoInput,
              name: dashboardData?.name || `Weather for ${locationQuery}`,
              runway: "N/A",
              elevation: "N/A",
              metar: "N/A",
              time: dashboardData?.lastUpdatedUTC || "N/A",
              status: "N/A",
              flightConditions: "N/A",
            }} />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          <FlightPlanning currentPlanWaypoints={currentPlanWaypoints} />
          <WeatherMap />
          <Alerts briefing={briefingData} />
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          <WeatherStats briefing={briefingData} />
        </div>
      </div>
    </div>
  )
} 