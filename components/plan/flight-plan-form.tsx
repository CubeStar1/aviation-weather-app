"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Plane, Plus, Trash2, SendHorizonal, MapPin, Landmark, MountainSnow
} from "lucide-react"

export interface Waypoint {
  airport: string;
  altitude: string;
}

interface FlightPlanFormProps {
  onPlanGenerated: (planString: string) => void;
}

const LOCAL_STORAGE_KEY = "flightPlanWaypoints";

// Helper function to get initial state
const getInitialWaypoints = (): Waypoint[] => {
  if (typeof window !== 'undefined') { // Ensure localStorage is available
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Basic validation: ensure it's an array of objects with correct keys
        if (Array.isArray(parsed) && parsed.length >= 2 && 
            parsed.every(item => typeof item === 'object' && 'airport' in item && 'altitude' in item)) {
          return parsed as Waypoint[];
        }
      } catch (error) {
        console.error("Failed to parse saved waypoints:", error);
      }
    }
  }
  // Default state if nothing valid in localStorage or SSR
  return [{ airport: "", altitude: "" }, { airport: "", altitude: "" }];
};

export function FlightPlanForm({ onPlanGenerated }: FlightPlanFormProps) {
  // Initialize state using the helper function
  const [waypoints, setWaypoints] = React.useState<Waypoint[]>(getInitialWaypoints);

  // Save waypoints to localStorage whenever they change
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
       localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(waypoints));
    }
  }, [waypoints]);

  const handleAddWaypoint = () => {
    const newWaypoints = [...waypoints];
    newWaypoints.splice(waypoints.length - 1, 0, { airport: "", altitude: "" });
    setWaypoints(newWaypoints);
  }

  const handleRemoveWaypoint = (index: number) => {
    if (waypoints.length <= 2 || index === 0 || index === waypoints.length - 1) return;
    const newWaypoints = [...waypoints];
    newWaypoints.splice(index, 1);
    setWaypoints(newWaypoints);
  }

  const handleWaypointChange = (index: number, field: "airport" | "altitude", value: string) => {
    const newWaypoints = [...waypoints];
    newWaypoints[index][field] = field === 'airport' ? value.toUpperCase() : value;
    setWaypoints(newWaypoints);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const planIsValid = waypoints.every((wp, index) => {
      return wp.airport.trim() !== "" && wp.altitude.trim() !== "";
    });

    if (!planIsValid || waypoints.length < 2) {
      console.error("All waypoints must have both Airport ID and Altitude filled.");
      return;
    }

    const planString = waypoints
      .map(wp => `${wp.airport.trim()},${wp.altitude.trim()}`)
      .join(',');

    console.log("Submitting flight plan string:", planString);
    onPlanGenerated(planString);
  }

  const getWaypointLabel = (index: number) => {
    if (index === 0) return { label: "Departure", icon: <Plane className="h-3.5 w-3.5 mr-1 text-primary" /> };
    if (index === waypoints.length - 1) return { label: "Arrival", icon: <MapPin className="h-3.5 w-3.5 mr-1 text-primary" /> };
    return { label: `Waypoint ${index}`, icon: <Landmark className="h-3.5 w-3.5 mr-1 text-muted-foreground" /> };
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 flex flex-col">
      <div className="overflow-y-auto max-h-[calc(100vh-20rem)] pr-3 -mr-3">
        <div className="space-y-4 pr-3">
          {waypoints.map((waypoint, index) => {
            const { label, icon } = getWaypointLabel(index);
            return (
              <div key={index} className={`space-y-2 border-l-2 pl-3 transition-colors duration-200 ${index === 0 ? 'border-green-500' : index === waypoints.length - 1 ? 'border-red-500' : 'border-border hover:border-primary/50'}`}>
                <div className="flex items-center justify-between pt-1">
                  <h3 className="text-xs font-medium flex items-center">
                    {icon}
                    {label}
                  </h3>
                  {waypoints.length > 2 && index !== 0 && index !== waypoints.length - 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveWaypoint(index)}
                      className="h-6 px-1.5 text-xs text-destructive hover:bg-destructive/10"
                      aria-label={`Remove ${label}`}
                    >
                      <Trash2 className="h-3 w-3 mr-1" /> Remove
                    </Button>
                  )}
                </div>

                <div className="flex space-x-3 items-end">
                  <div className="space-y-1 flex-1">
                    <Label htmlFor={`airport-${index}`} className="text-xs">ICAO ID</Label>
                    <Input
                      id={`airport-${index}`}
                      placeholder="e.g., KLAX"
                      value={waypoint.airport}
                      onChange={(e) => handleWaypointChange(index, "airport", e.target.value)}
                      className="h-9 text-sm"
                      maxLength={4}
                      required={index === 0 || index === waypoints.length - 1}
                    />
                  </div>
                  <div className="space-y-1 flex-1">
                    <Label htmlFor={`altitude-${index}`} className="text-xs flex items-center">
                      <MountainSnow className="h-3 w-3 mr-1 text-muted-foreground"/> Altitude (ft)
                    </Label>
                    <Input
                      id={`altitude-${index}`}
                      type="number"
                      placeholder="e.g., 10000"
                      value={waypoint.altitude}
                      onChange={(e) => handleWaypointChange(index, "altitude", e.target.value)}
                      className="h-9 text-sm"
                      min="0"
                      required={index === 0 || index === waypoints.length - 1}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-auto pt-3 border-t">
        <Separator className="mb-3"/>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddWaypoint}
            className="flex-1 text-xs h-9"
          >
            <Plus className="h-4 w-4 mr-1" /> Add Waypoint
          </Button>

          <Button
            type="submit"
            size="sm"
            className="flex-1 text-xs h-9 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <SendHorizonal className="h-4 w-4 mr-1" /> Update Preview
          </Button>
        </div>
      </div>
    </form>
  )
} 