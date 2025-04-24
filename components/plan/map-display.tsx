'use client'

import React from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, Polygon, Tooltip } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-defaulticon-compatibility'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css'
import { LatLngTuple, LatLngBounds } from 'leaflet'
import { BriefingApiResponse } from '@/lib/fetchers/briefing'

// Component to automatically fit map to the waypoints
function AutoFitBounds({ points }: { points: LatLngTuple[] }) {
  const map = useMap();
  
  React.useEffect(() => {
    if (points.length >= 2) {
      const bounds = new LatLngBounds(points);
      map.fitBounds(bounds, { padding: [30, 30] });
    }
  }, [map, points]);
  
  return null;
}

interface MapDisplayProps {
  waypoints: BriefingApiResponse['waypoints'];
  sigmets?: BriefingApiResponse['airsigmets'];
}

export function MapDisplay({ waypoints, sigmets }: MapDisplayProps) {
  // Filter waypoints with valid coordinates
  const validWaypoints = waypoints.filter(wp => wp.coords && wp.coords.length === 2);
  
  // Create polyline positions
  const positions = validWaypoints.map(wp => [wp.coords![0], wp.coords![1]] as LatLngTuple);

  if (validWaypoints.length < 2) {
    return (
      <div className="h-[400px] bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-900/20 dark:to-blue-900/20 rounded-lg flex items-center justify-center border border-dashed">
        <p className="text-sm text-muted-foreground text-center px-4">
          Need at least two waypoints with coordinates to display map route.
        </p>
      </div>
    );
  }

  // Default center - first waypoint
  const defaultCenter: LatLngTuple = validWaypoints.length > 0 
    ? [validWaypoints[0].coords![0], validWaypoints[0].coords![1]] 
    : [39.8283, -98.5795]; // Center of the US as fallback

  // Get SIGMET polygons if they exist
  const sigmetPolygons = sigmets?.filter(sigmet => 
    sigmet.area && Array.isArray(sigmet.area) && sigmet.area.length > 2
  ) || [];

  return (
    <div className="h-[400px] w-full rounded-lg overflow-hidden border">
      <MapContainer 
        center={defaultCenter}
        zoom={4}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Display SIGMET areas */}
        {sigmetPolygons.map((sigmet, idx) => {
          // Convert SIGMET area to LatLngTuple[]
          const polygonPoints = sigmet.area!.map(point => 
            [point.lat, point.lon] as LatLngTuple
          );
          
          return (
            <Polygon
              key={`sigmet-${idx}`}
              positions={polygonPoints}
              pathOptions={{ 
                color: 'red',
                fillColor: 'red',
                fillOpacity: 0.2,
                weight: 2
              }}
            >
              <Tooltip direction="center" permanent>
                <div className="text-xs font-medium">
                  {sigmet.hazard || 'SIGMET'} {sigmet.severity && `(${sigmet.severity})`}
                </div>
              </Tooltip>
            </Polygon>
          );
        })}
        
        {/* Flight route line */}
        {positions.length >= 2 && (
          <Polyline 
            positions={positions}
            pathOptions={{ color: '#3B82F6', weight: 3 }}
          />
        )}
        
        {/* Waypoint markers */}
        {validWaypoints.map((waypoint, index) => (
          <Marker 
            key={waypoint.id || index}
            position={[waypoint.coords![0], waypoint.coords![1]] as LatLngTuple}
          >
            <Popup>
              {waypoint.id || `Waypoint ${index + 1}`}
              {waypoint.alt_ft && <div>Altitude: {waypoint.alt_ft} ft</div>}
            </Popup>
          </Marker>
        ))}
        
        {/* Auto-fit map to waypoints */}
        <AutoFitBounds points={positions} />
      </MapContainer>
    </div>
  )
}
