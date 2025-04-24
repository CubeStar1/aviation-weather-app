import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import ReactMarkdown from 'react-markdown'
import type { Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {
  Bot,
  Loader2,
  RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { BriefingApiResponse } from "@/lib/fetchers/briefing"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios"

interface AiSummaryTabProps {
  briefing: BriefingApiResponse;
}

const markdownComponents: Components = {
  p: ({ node, ...props }) => (
    <p className="mb-4 text-sm text-foreground/80" {...props} />
  ),
  h3: ({ node, ...props }) => (
    <h3 className="text-sm font-medium text-foreground mt-5 mb-2" {...props} />
  ),
  ul: ({ node, ...props }) => (
    <ul className="list-disc pl-4 mb-4" {...props} />
  ),
  li: ({ node, ...props }) => (
    <li className="mb-1 text-foreground/80" {...props} />
  ),
  strong: ({ node, ...props }) => (
    <strong className="text-foreground font-semibold" {...props} />
  ),
  em: ({ node, ...props }) => (
    <em className="text-foreground/70" {...props} />
  ),
};

// Create an axios instance with custom config
const api = axios.create({
  timeout: 60000, // 60 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to fetch AI summary
const fetchAiSummary = async (briefing: BriefingApiResponse) => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const { data } = await api.post(`${API_BASE_URL}/weather_summary`, briefing);
  return data.summary;
};

export function AiSummaryTab({ briefing }: AiSummaryTabProps) {
  const queryClient = useQueryClient();

  const { data: aiSummary, isLoading, error, refetch } = useQuery({
    queryKey: ['aiSummary', briefing],
    queryFn: () => fetchAiSummary(briefing),
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    retry: 1, // Only retry once on failure
    enabled: !!briefing, // Only run query if briefing data exists
  });

  return (
    <ScrollArea style={{ height: 'calc(100vh - 22rem)' }} className="pr-4">
      <div className="space-y-4 pb-4">
        <Card className="bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-background border border-blue-500/20 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium flex items-center text-blue-600 dark:text-blue-400">
                <Bot className="h-4 w-4 mr-1.5"/> AI Weather Analysis
              </h3>
              {!isLoading && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => refetch()}
                  className="h-7 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/40"
                >
                  <RefreshCw className="h-3.5 w-3.5 mr-1"/> Regenerate
                </Button>
              )}
            </div>
            
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                <Loader2 className="h-6 w-6 mb-3 animate-spin text-blue-500/70"/>
                <p className="text-sm">Analyzing weather data...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-10 text-destructive space-y-2">
                <p className="text-sm">{(error as Error).message || 'Failed to fetch AI summary'}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => refetch()}
                  className="mt-2 border-destructive/30 text-destructive hover:bg-destructive/10"
                >
                  Try Again
                </Button>
              </div>
            ) : aiSummary ? (
              <div className="pb-1">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={markdownComponents}
                >
                  {aiSummary}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                <p className="text-sm">No analysis available.</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => refetch()}
                  className="mt-3"
                >
                  Generate Analysis
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-amber-500/30 bg-amber-50/30 dark:bg-amber-900/10">
          <CardContent className="p-3 text-xs text-muted-foreground">
            <p className="flex items-center">
              <Bot className="h-3 w-3 mr-1.5 text-amber-600 dark:text-amber-500"/> 
              This analysis is generated by AI and should be used as a supplementary tool only. 
              Always verify with official weather sources and exercise proper pilot judgment.
            </p>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}