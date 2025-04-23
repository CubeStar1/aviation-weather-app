"use client"

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FlightPlanForm, Waypoint } from "@/components/plan/flight-plan-form"
import { RoutePreview } from "@/components/plan/route-preview"
import { PageHeader } from "@/components/ui/page-header"

export default function FlightPlanPage() {
  const [planString, setPlanString] = React.useState<string | null>(null);

  const handlePlanGenerated = (newPlanString: string) => {
    setPlanString(newPlanString);
    
    const waypoints = newPlanString.split(',').reduce<Waypoint[]>((acc, curr, i) => {
      if (i % 2 === 0) {
        acc.push({ airport: curr, altitude: '' });
      } else if (acc.length > 0) {
        acc[acc.length - 1].altitude = curr;
      }
      return acc;
    }, []);

    try {
      localStorage.setItem('flightPlanWaypoints', JSON.stringify(waypoints));
    } catch (error) {
      console.error("Failed to save flight plan to localStorage:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-4 space-y-4">
      <PageHeader title="Flight Plan" />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 border-primary/20 shadow-sm bg-gradient-to-br from-primary/5 via-background to-background">
          <CardHeader className="py-3">
            <CardTitle className="text-base text-primary font-semibold">Plan Your Flight</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <FlightPlanForm onPlanGenerated={handlePlanGenerated} />
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2 shadow-sm border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background">
          <CardHeader className="py-3">
            <CardTitle className="text-base">Route Preview</CardTitle>
          </CardHeader>
          <CardContent className="p-0 sm:p-4">
            <RoutePreview plan={planString} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 