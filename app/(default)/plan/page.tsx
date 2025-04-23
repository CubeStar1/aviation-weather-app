"use client"

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FlightPlanForm, Waypoint } from "@/components/plan/flight-plan-form"
import { RoutePreview } from "@/components/plan/route-preview"
import { GradientText } from "@/components/ui/gradient-text"
import { PageHeader } from "@/components/ui/page-header"

export default function FlightPlanPage() {
  const [currentPlan, setCurrentPlan] = React.useState<Waypoint[] | null>(null);

  const handlePlanGenerated = (plan: Waypoint[]) => {
    console.log("Plan generated in parent:", plan);
    setCurrentPlan(plan);
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
            <RoutePreview plan={currentPlan} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 