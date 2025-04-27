'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Mic, StopCircle, MessageSquare, AlertCircle, Info, Loader2, MapPin, Settings, PlaneTakeoff, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useAudioStream } from './hooks/useAudioStream';
import { useAudioPlayback } from './hooks/useAudioPlayback';
import type { Config } from './types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { VoiceSettings } from './components/VoiceSettings';
import { ControlDock } from './components/ControlDock';
import { PageHeader } from '@/components/ui/page-header';
import { useWeatherBriefingContext } from './hooks/useWeatherBriefingContext';
import { formatBriefingForPrompt } from '@/lib/utils/formatters';
import { FlightPlanForm, Waypoint } from '@/components/plan/flight-plan-form';
import { BriefingContextDisplay } from '@/components/voice-assistant/briefing-context-display';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL;

declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

const voices = ["Puck", "Charon", "Kore", "Fenrir", "Aoede"];

const BASE_SYSTEM_PROMPT = "You are an AI aviation weather assistant. Respond verbally with concise, accurate weather information for pilots based on their requests about the provided flight context. Use the context to answer questions about METARs, PIREPs, SIGMETs, AIRMETs, and general conditions along the route.";

export default function VoiceAssistantPage() {
  const [isStreaming, setIsStreaming] = useState(false);
  const [config, setConfig] = useState<Config>({
    systemPrompt: BASE_SYSTEM_PROMPT,
    voice: "Puck",
    googleSearch: false,
    allowInterruptions: false
  });
  const [isConnected, setIsConnected] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const clientId = useRef(crypto.randomUUID());
  
  const { 
    briefingData, 
    waypoints: contextWaypoints,
    isLoading: isLoadingContext, 
    isError: isContextError, 
    error: contextError, 
    refetch: refetchBriefing 
  } = useWeatherBriefingContext();

  const { error: streamError, startAudioStream, stopAudioStream } = useAudioStream();
  const { handleAudioMessage } = useAudioPlayback();

  useEffect(() => {
    if (briefingData) {
       const briefingContext = formatBriefingForPrompt(briefingData);
       console.log("Updating system prompt with context:", briefingContext.substring(0, 100) + "...");
       setConfig(prevConfig => ({
         ...prevConfig,
         systemPrompt: `${BASE_SYSTEM_PROMPT}\n\n${briefingContext}`
       }));
    } else {
       console.log("Reverting to base system prompt.");
       setConfig(prevConfig => ({
         ...prevConfig,
         systemPrompt: BASE_SYSTEM_PROMPT
       }));
    }
    
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        console.log("Briefing context changed, closing WebSocket to apply new prompt on next start.");
        wsRef.current.close(1000, "Context updated");
        wsRef.current = null;
        setIsStreaming(false);
        setIsConnected(false);
    }
  }, [briefingData]);

  const displayError = streamError || contextError?.message;

  const startStream = async () => {
    if (isStreaming) {
        console.log("Already streaming.");
        return;
    }
    if (isLoadingContext || isContextError) {
        console.log("Cannot start stream: Briefing context is loading or in error state.");
        return;
    }
    
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    wsRef.current = new WebSocket(`${WS_URL}/${clientId.current}`);
    console.log(`Attempting to connect WebSocket for client: ${clientId.current}`);

    wsRef.current.onopen = async () => {
      if (!wsRef.current) return;
      console.log("WebSocket opened. Sending config...");
      wsRef.current.send(JSON.stringify({
        type: 'config',
        config: config 
      }));
      setIsConnected(true);
      try {
          await startAudioStream(wsRef);
          setIsStreaming(true); 
          console.log("Audio stream started.");
      } catch (audioError) {
          console.error("Failed to start audio stream:", audioError);
          setIsConnected(false);
          setIsStreaming(false);
          if (wsRef.current) {
             wsRef.current.close(1011, "Audio setup failed");
             wsRef.current = null;
          }
      }
    };

    wsRef.current.onmessage = async (event: MessageEvent) => {
      try {
          const response = JSON.parse(event.data);
          if (response.type === 'audio') {
            await handleAudioMessage(response.data);
          } else if (response.type === 'text') {
            console.log("Received text (not displayed):", response.text);
          } else if (response.type === 'error') {
             console.error("Error message from server:", response.message);
          }
      } catch (parseError) {
         console.error("Failed to parse message:", event.data, parseError);
      }
    };

    wsRef.current.onerror = (error: Event) => {
      const err = error as ErrorEvent;
      console.error('WebSocket error:', err.message || 'Unknown error');
      setIsStreaming(false);
      setIsConnected(false);
      wsRef.current = null;
    };

    wsRef.current.onclose = (event: CloseEvent) => {
      console.log("WebSocket closed:", event.code, event.reason);
      stopAudioStream(); 
      setIsStreaming(false);
      setIsConnected(false);
      wsRef.current = null;
    };
  };

  const stopStream = () => {
    stopAudioStream();
    if (wsRef.current) {
       if (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING) {
           console.log("Closing WebSocket connection from stopStream.");
           wsRef.current.close(1000, "Client requested stop"); 
       }
       wsRef.current = null;
    }
    setIsStreaming(false);
    setIsConnected(false);
  };

  const handlePlanUpdate = (planString: string) => {
      console.log("Flight plan updated by form, refetching briefing...");
      refetchBriefing();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="container mx-auto px-4 py-6 space-y-6 flex-grow">
        <div className="flex items-center justify-between">
           <PageHeader title="Voice Weather Briefing" />
           <Popover>
                <PopoverTrigger asChild>
                    <Button variant="secondary" size="sm" aria-label="Voice Settings">
                        <Settings className="h-4 w-4 mr-1.5" /> Voice Settings
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 mr-4" side="bottom" align="end">
                    <div className="space-y-4 p-4">
                        <h4 className="font-medium leading-none">Voice Settings</h4>
                        <VoiceSettings
                            config={config}
                            setConfig={setConfig}
                            isConnected={isConnected}
                            voices={voices}
                        />
                    </div>
                </PopoverContent>
            </Popover>
        </div>

        {displayError && (
          <Alert variant="destructive" className="w-full">
             <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{displayError}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start flex-grow">
          <Card className="lg:col-span-1 shadow-sm border-green-500/20 bg-gradient-to-br from-green-500/5 via-background to-background rounded-xl overflow-hidden flex flex-col h-full">
              <CardHeader className="px-5 py-3 border-b border-green-500/10 flex-shrink-0">
                  <CardTitle className="text-base font-medium text-green-800 dark:text-green-300 flex items-center">
                      <PlaneTakeoff className="h-4 w-4 mr-2"/> Flight Plan
                  </CardTitle>
              </CardHeader>
              <CardContent className="p-5 flex flex-col flex-grow min-h-0">
                  <FlightPlanForm onPlanGenerated={handlePlanUpdate} />
              </CardContent>
          </Card>
              
          <div className="lg:col-span-1 h-full">
             <BriefingContextDisplay 
                 briefing={briefingData}
                 isLoading={isLoadingContext}
                 isError={isContextError}
                 error={contextError}
                 waypoints={contextWaypoints}
             />
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 bg-background/80 backdrop-blur-sm border-t py-3 z-10">
          <div className="container mx-auto px-4 flex items-center justify-center relative">
            <ControlDock
                isStreaming={isStreaming}
                onStartAudio={startStream}
                onStartVideo={() => {}}
                onStop={stopStream}
            />
          </div>
      </div>
    </div>
  );
}