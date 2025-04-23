import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col items-center justify-center space-y-6 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Aviation Weather Dashboard</h1>
        <p className="max-w-[700px] text-lg text-muted-foreground">
          Get real-time weather data for your flight plans including METAR, TAF, PIREP, and SIGMET reports.
        </p>

        <div className="flex gap-4">
          <Button asChild size="lg">
            <Link href="/dashboard">Dashboard</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/plan">Create Flight Plan</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Weather Briefing</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Get detailed weather briefings for your entire flight plan or individual waypoints.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Real-time Data</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Access the latest aviation weather data including METAR, TAF, PIREP, and SIGMET reports.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Flight Planning</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Create and analyze flight plans with comprehensive weather information at each waypoint.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
