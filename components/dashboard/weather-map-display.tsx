'use client'

import React from 'react'
import { MapContainer, TileLayer, LayerGroup, Popup, useMap, Marker, Circle } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-defaulticon-compatibility'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css'
import { LatLngTuple, Icon } from 'leaflet'

// Default center coordinates (US center)
const DEFAULT_CENTER: LatLngTuple = [39.8283, -98.5795]

// Component to change map layers based on selection
function MapLayerController({ layer }: { layer: string }) {
  const map = useMap()
  
  React.useEffect(() => {
    // Map layer would ideally connect to a weather data service
    // For now, we're just changing the view based on layer type
    if (layer === 'radar') {
      map.setView(DEFAULT_CENTER, 4)
    } else if (layer === 'satellite') {
      map.setView(DEFAULT_CENTER, 5)
    } else if (layer === 'sigmet') {
      map.setView(DEFAULT_CENTER, 3)
    }
  }, [map, layer])
  
  return null
}

interface WeatherMapDisplayProps {
  layer: string
}

export function WeatherMapDisplay({ layer }: WeatherMapDisplayProps) {
  // Simulated data for demonstration
  const demoSigmetAreas = [
    { 
      id: 'demo-1',
      name: 'CONVECTIVE SIGMET',
      position: [42.5, -95.7] as LatLngTuple
    },
    {
      id: 'demo-2',
      name: 'TURBULENCE',
      position: [35.1, -106.3] as LatLngTuple
    }
  ]

  return (
    <div className="h-full w-full">
      <MapContainer 
        center={DEFAULT_CENTER}
        zoom={4}
        scrollWheelZoom={false}
        dragging={false}
        doubleClickZoom={false}
        zoomControl={false}
        attributionControl={false}
        style={{ height: '100%', width: '100%' }}
        className="bg-blue-50 dark:bg-blue-950/20"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          opacity={0.6}
        />
        
        {/* Layer for radar data */}
        {layer === 'radar' && (
          <LayerGroup>
            {/* Simplified radar visualization */}
            <Circle 
              center={[37.7, -97.3]} 
              radius={300000} 
              pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.2 }}
            />
            <Circle 
              center={[40.7, -84.5]} 
              radius={200000} 
              pathOptions={{ color: 'darkblue', fillColor: 'darkblue', fillOpacity: 0.3 }}
            />
          </LayerGroup>
        )}
        
        {/* Layer for satellite data */}
        {layer === 'satellite' && (
          <LayerGroup>
            {/* Simplified satellite visualization */}
            <Circle 
              center={[32.8, -117.2]} 
              radius={400000} 
              pathOptions={{ color: 'grey', fillColor: 'grey', fillOpacity: 0.3 }}
            />
            <Circle 
              center={[45.5, -73.6]} 
              radius={350000} 
              pathOptions={{ color: 'grey', fillColor: 'grey', fillOpacity: 0.2 }}
            />
          </LayerGroup>
        )}
        
        {/* Layer for SIGMET data */}
        {layer === 'sigmet' && (
          <LayerGroup>
            {/* Simplified SIGMET visualization */}
            {demoSigmetAreas.map(area => (
              <Circle
                key={area.id}
                center={area.position}
                radius={250000}
                pathOptions={{ 
                  color: 'red', 
                  fillColor: 'red', 
                  fillOpacity: 0.2,
                  weight: 2
                }}
              >
                <Popup>
                  <div className="text-xs font-medium text-red-600">
                    {area.name}
                  </div>
                </Popup>
              </Circle>
            ))}
          </LayerGroup>
        )}
        
        {/* Controller to handle map layer changes */}
        <MapLayerController layer={layer} />
      </MapContainer>
    </div>
  )
} 