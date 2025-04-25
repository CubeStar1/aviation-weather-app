import React from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, Polygon, Tooltip, LayerGroup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-defaulticon-compatibility'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css'
import { LatLngTuple, LatLngBounds } from 'leaflet'
import { BriefingApiResponse } from '@/lib/fetchers/briefing'
import { format } from 'date-fns'

// Component to automatically fit map to the waypoints
function AutoFitBounds({ points }: { points: LatLngTuple[] }) {
  const map = useMap();
  
  React.useEffect(() => {
    if (points.length >= 2) {
      const bounds = new LatLngBounds(points);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, points]);
  
  return null;
}

function formatAltitude(altitude: number | null): string {
  if (!altitude) return 'Unknown';
  return `FL${Math.round(altitude/100)}`;
}

function formatTime(timestamp: number): string {
  return format(new Date(timestamp * 1000), 'HH:mm');
}

interface SigmetPoint {
  lat: number;
  lon: number;
}

interface BriefingMapDisplayProps {
  briefing: BriefingApiResponse;
}

export function BriefingMapDisplay({ briefing }: BriefingMapDisplayProps) {
  // Filter waypoints with valid coordinates
  const validWaypoints = briefing.waypoints.filter(wp => wp.coords && wp.coords.length === 2);
  
  // Create polyline positions for the route
  const positions = validWaypoints.map(wp => [wp.coords![0], wp.coords![1]] as LatLngTuple);

  // Get SIGMET polygons with coords field instead of area and valid altitude information
  const sigmetPolygons = briefing.airsigmets?.filter(sigmet => 
    sigmet.coords && 
    Array.isArray(sigmet.coords) && 
    sigmet.coords.length > 2 &&
    sigmet.altitudeHi1 !== null && 
    sigmet.altitudeHi1 !== undefined
  ) || [];

  // Get intersecting SIGMETs from legs
  const intersectingSigmets = new Set(
    briefing.legs
      .flatMap(leg => leg.intersecting_sigmets)
      .map(sigmet => sigmet.airSigmetId)
  );

  // Default center - first waypoint
  const defaultCenter: LatLngTuple = validWaypoints.length > 0 
    ? [validWaypoints[0].coords![0], validWaypoints[0].coords![1]] 
    : [39.8283, -98.5795]; // Center of the US as fallback

  return (
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
      
      <LayerGroup>
        {/* Display SIGMET areas */}
        {sigmetPolygons.map((sigmet, idx) => {
          const polygonPoints = sigmet.coords!.map((point: SigmetPoint) => 
            [point.lat, point.lon] as LatLngTuple
          );
          
          const isIntersecting = intersectingSigmets.has(sigmet.airSigmetId);
          
          return (
            <Polygon
              key={`sigmet-${idx}`}
              positions={polygonPoints}
              pathOptions={{ 
                color: isIntersecting ? 'red' : 'orange',
                fillColor: isIntersecting ? 'red' : 'orange',
                fillOpacity: isIntersecting ? 0.3 : 0.1,
                weight: isIntersecting ? 2 : 1
              }}
            >
              <Tooltip direction="center">
                <div className="text-xs space-y-0.5">
                  <div className="font-medium">{sigmet.hazard} {sigmet.alphaChar && `(${sigmet.alphaChar})`}</div>
                  <div>Top: {formatAltitude(sigmet.altitudeHi1 || null)}</div>
                  {sigmet.altitudeLow1 && <div>Base: {formatAltitude(sigmet.altitudeLow1)}</div>}
                  {sigmet.movementDir && sigmet.movementSpd && (
                    <div>Moving {sigmet.movementDir}° at {sigmet.movementSpd}kt</div>
                  )}
                  <div className="text-muted-foreground">
                    Valid until {formatTime(sigmet.validTimeTo)}Z
                  </div>
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
              <div className="text-xs">
                <strong>{waypoint.id || `Waypoint ${index + 1}`}</strong>
                {waypoint.alt_ft && <div>Altitude: {waypoint.alt_ft} ft</div>}
              </div>
            </Popup>
          </Marker>
        ))}
      </LayerGroup>
      
      {/* Auto-fit map to waypoints */}
      <AutoFitBounds points={positions} />
    </MapContainer>
  );
} 