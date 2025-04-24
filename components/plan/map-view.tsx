"use client"

import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { BriefingApiResponse } from "@/lib/fetchers/briefing";
import { MapPin } from 'lucide-react';

interface MapViewProps {
  waypoints: BriefingApiResponse['waypoints'];
  sigmets: BriefingApiResponse['airsigmets'];
}

export function MapView({ waypoints, sigmets }: MapViewProps) {
  // Dynamically import the MapDisplay component with no SSR
  const DynamicMapDisplay = useMemo(() => dynamic(
    () => import('./map-display').then(mod => mod.MapDisplay),
    { 
      loading: () => (
        <div className="h-[400px] flex items-center justify-center bg-muted/20 rounded-lg border border-dashed">
          <p className="text-sm text-muted-foreground">Loading map...</p>
        </div>
      ),
      ssr: false 
    }
  ), []);

  // Filter waypoints with valid coordinates
  const validWaypoints = waypoints.filter(wp => wp.coords && wp.coords.length === 2);

  if (validWaypoints.length < 2) {
    return (
      <div className="h-[400px] bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-900/20 dark:to-blue-900/20 rounded-lg flex items-center justify-center border border-dashed">
        <p className="text-sm text-muted-foreground text-center px-4">
          <MapPin className="h-8 w-8 mx-auto mb-2 text-primary/50" />
          Need at least two waypoints with coordinates to display map route.
        </p>
      </div>
    );
  }

  return <DynamicMapDisplay waypoints={waypoints} sigmets={sigmets} />;
} 