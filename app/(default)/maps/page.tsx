"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from '@/components/ui/separator';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/ui/page-header";

const mapData = [
//   {
//     title: "SIGMET",
//     images: [{ label: "All Active", url: "https://aviationweather.gov/data/products/sigmet/sigmet_all.gif" }]
//   },
  {
    title: "Surface Prog Chart",
    images: [{ label: "Analysis", url: "https://www.1800wxbrief.com/Website/weather/graphic/image?product=SURFACE_ANALYSIS&seed=762675937" }]
  },
  {
    title: "Precipitable Water",
    images: [{ label: "Total", url: "https://www.1800wxbrief.com/Website/weather/graphic/image?product=PRECIP_WATER&seed=-1225179565" }]
  },
  {
    title: "Temperature Forecast (24hr)",
    images: [
      { label: "Max Temp", url: "https://www.1800wxbrief.com/Website/weather/graphic/image?product=MAX_TEMP_24HR&seed=-1712161124" },
      { label: "Min Temp", url: "https://www.1800wxbrief.com/Website/weather/graphic/image?product=MIN_TEMP_24HR&seed=-764368662" }
    ]
  },
  {
    title: "Winds/Temps Aloft (Current)",
    images: [
      { label: "FL050", url: "https://www.1800wxbrief.com/Website/weather/graphic/image?product=CURRENT_FL050_WINDS_TEMP&seed=-1429119848" },
      { label: "FL100", url: "https://www.1800wxbrief.com/Website/weather/graphic/image?product=CURRENT_FL100_WINDS_TEMP&seed=-312108881" },
      { label: "FL180", url: "https://www.1800wxbrief.com/Website/weather/graphic/image?product=CURRENT_FL180_WINDS_TEMP&seed=-892712536" }
    ]
  },
  {
    title: "Average Relative Humidity",
    images: [{ label: "Mean RH", url: "https://www.1800wxbrief.com/Website/weather/graphic/image?product=MEAN_RH&seed=152226039" }]
  }
];

export default function MapsPage() {
  const [cacheBuster, setCacheBuster] = useState<string>(`t=${Date.now()}`);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState<boolean>(true);

  const refreshImages = () => {
    setCacheBuster(`t=${Date.now()}`);
  };

  // Auto-refresh logic
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    if (autoRefreshEnabled) {
      intervalId = setInterval(refreshImages, 5 * 60 * 1000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [autoRefreshEnabled]);

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 flex flex-col h-[calc(100vh-10rem)]">
       {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4 flex-shrink-0">
        <PageHeader title="Weather Maps" />
        <div className="flex items-center gap-4">
             <div className="flex items-center space-x-2">
                 <Switch 
                     id="auto-refresh-switch" 
                     checked={autoRefreshEnabled}
                     onCheckedChange={setAutoRefreshEnabled}
                 />
                 <Label htmlFor="auto-refresh-switch" className="text-sm font-medium">Auto Refresh (5 min)</Label>
             </div>
            <Button variant="outline" size="sm" onClick={refreshImages}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Now
            </Button>
        </div>
      </div>

       <Carousel
           opts={{
               align: "start",
               loop: false, 
           }}
           className="w-full flex-grow flex flex-col" 
       >
           <CarouselContent className="-ml-4 flex-grow"> 
               {mapData.map((category, index) => (
                   <CarouselItem key={index} className="pl-4 basis-full"> 
                           <Card className="h-full overflow-hidden flex flex-col shadow-md border border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background">
                               <CardHeader className="pb-2 flex-shrink-0">
                                   <CardTitle className="text-lg">{category.title}</CardTitle>
                               </CardHeader>
                               <CardContent className="flex-grow flex flex-col space-y-3 pt-0 pb-4 px-4 overflow-y-auto"> 
                                   {category.images.map((image, imgIndex) => (
                                       <div key={image.label} className="flex flex-col flex-grow">
                                           {category.images.length > 1 && (
                                               <h3 className="text-sm font-medium mb-2 flex-shrink-0">{image.label}</h3>
                                           )}
                                           <div className="border rounded overflow-hidden bg-muted/30 relative flex-grow min-h-[200px]"> 
                                               {/* eslint-disable-next-line @next/next/no-img-element */}
                                               <img
                                                   src={`${image.url}&${cacheBuster}`}
                                                   alt={`${category.title} - ${image.label}`}
                                                   className="object-contain w-full h-full absolute top-0 left-0" 
                                                   loading="lazy"
                                               />
                                           </div>
                                           {imgIndex < category.images.length - 1 && <Separator className="my-3 flex-shrink-0" />}
                                       </div>
                                   ))}
                               </CardContent>
                           </Card>
                   </CarouselItem>
               ))}
           </CarouselContent>
           <div className="flex justify-center items-center pt-4 flex-shrink-0"> 
               <CarouselPrevious className="relative static sm:absolute left-2 transform-none" />
               <CarouselNext className="relative static sm:absolute right-2 transform-none" />
           </div>
       </Carousel>
    </div>
  );
}
