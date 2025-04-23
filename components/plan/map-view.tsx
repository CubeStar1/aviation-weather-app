"use client"

import React from 'react';
import { BriefingApiResponse } from "@/lib/fetchers/briefing";
import { MapPin } from 'lucide-react';

interface MapViewProps {
  waypoints: BriefingApiResponse['waypoints'];
  sigmets: BriefingApiResponse['airsigmets'];
  // sigmets prop is no longer used in this simple version
}

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export function MapView({ waypoints }: MapViewProps) {

  // Filter waypoints with valid coordinates
  const validWaypoints = waypoints.filter(wp => wp.coords && wp.coords.length === 2);

  if (!GOOGLE_MAPS_API_KEY) {
    return (
       <div className="h-full w-full flex items-center justify-center bg-destructive/10 text-destructive text-sm p-4 rounded-lg border border-destructive/30">
          Google Maps API Key is not configured. Please set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY.
       </div>
    );
  }
  
  if (validWaypoints.length < 2) {
     return (
      <div className="h-full bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-900/20 dark:to-blue-900/20 rounded-lg flex items-center justify-center border border-dashed">
        <p className="text-sm text-muted-foreground text-center px-4">
          <MapPin className="h-8 w-8 mx-auto mb-2 text-primary/50" />
          Need at least two waypoints with coordinates to display map route.
        </p>
      </div>
    );
  }

  // Construct the Google Maps Embed URL
  const origin = `${validWaypoints[0].coords![0]},${validWaypoints[0].coords![1]}`;
  const destination = `${validWaypoints[validWaypoints.length - 1].coords![0]},${validWaypoints[validWaypoints.length - 1].coords![1]}`;
  const intermediateWaypoints = validWaypoints
    .slice(1, -1) // Get waypoints between origin and destination
    .map(wp => `${wp.coords![0]},${wp.coords![1]}`)
    .join('|'); // Pipe-separated for the API

  const embedUrl = `https://www.google.com/maps/embed/v1/directions?key=${GOOGLE_MAPS_API_KEY}&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}${intermediateWaypoints ? `&waypoints=${encodeURIComponent(intermediateWaypoints)}` : ''}&mode=driving`; // mode=driving is usually the best fit

  return (
    <div className="h-full w-full rounded-lg overflow-hidden border">
      <iframe
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src={embedUrl}>
      </iframe>
    </div>
  );
} 