import type { BriefingApiResponse, MetarData, PirepData, AirSigmetData } from '@/lib/fetchers/briefing';

/**
 * Formats the complex briefing data into a detailed, structured string 
 * suitable for providing context in an AI system prompt, similar to the backend AI summary generation.
 */
export function formatBriefingForPrompt(briefing: BriefingApiResponse | null | undefined): string {
  if (!briefing || !briefing.waypoints || briefing.waypoints.length === 0) {
    return "No briefing data available.";
  }

  const waypointsStr = briefing.waypoints.map(wp => `${wp.id}(${wp.alt_ft}')`).join(' -> ');
  let context = `Current Flight Context:\nRoute: ${waypointsStr}\n`;

  // ### METAR Summary ###
  if (briefing.metar && Object.keys(briefing.metar).length > 0) {
    context += "\n### METAR Summary:\n";
    for (const [airport, data] of Object.entries(briefing.metar)) {
      if (data.error) continue; // Skip errored METARs
      context += `\nAirport ${airport}:\n`;
      if (data.general) {
        context += `- General: ${data.general}\n`;
      }
      // Add Cloud info if available (using api_response as cloud field might be null)
      const clouds = data.api_response?.clouds;
      if (clouds && Array.isArray(clouds) && clouds.length > 0) {
          const cloudStr = clouds.map((c: { cover: string; base: number | null }) => 
              `${c.cover}${c.base !== null ? `@${c.base}ft` : ''}`
          ).join(', ');
          context += `- Clouds: ${cloudStr}\n`;
      } else if (data.api_response?.clouds?.length === 0) {
           context += `- Clouds: Sky Clear\n`;
      }
      if (data.remarks && data.remarks.length > 0) {
        context += `- Remarks: ${data.remarks.join('; ')}\n`;
      }
    }
  }

  // ### PIREP Summary ###
  let relevantPireps = false;
  let pirepSummary = "\n### PIREP Summary:\n";
  if (briefing.pireps) {
    for (const [location, data] of Object.entries(briefing.pireps)) {
      if (data.error || !data.reports || data.reports.length === 0 || data.reports[0].raw === "No matching AIREP/PIREPs") {
        continue; // Skip errors or non-relevant PIREPs
      }
      relevantPireps = true;
      pirepSummary += `\nReports near ${location}:\n`;
      data.reports.forEach((report, index) => {
        pirepSummary += `- Report ${index + 1}:`;
        if (report.time?.repr) pirepSummary += ` Time: ${report.time.repr}Z;`;
        if (report.location?.repr) pirepSummary += ` Loc: ${report.location.repr};`;
        if (report.altitude?.value) pirepSummary += ` Alt: FL${String(report.altitude.value).padStart(3, '0')};`;
        if (report.type) pirepSummary += ` Type: ${report.type};`;
        if (report.turbulence?.repr) pirepSummary += ` Turb: ${report.turbulence.repr};`;
        if (report.icing?.repr) pirepSummary += ` Icing: ${report.icing.repr};`;
        pirepSummary += '\n'; 
        // Add more fields as needed, keep it concise
      });
    }
  }
  if (relevantPireps) {
    context += pirepSummary;
  }

  // ### AIRMET/SIGMET Summary ###
  if (briefing.airsigmets && briefing.airsigmets.length > 0) {
    context += "\n### AIRMET/SIGMET Summary:\n";
    briefing.airsigmets.forEach((sigmet, index) => {
       if (sigmet.simplified_summary) {
         context += `- ${sigmet.simplified_summary}\n`;
       } else {
         // Fallback if simplified_summary isn't available
         context += `- Report ${index + 1}: ${sigmet.hazard || 'Unknown Hazard'} from ${sigmet.altitudeLo1 ?? '?'}ft to ${sigmet.altitudeHi1 ?? '?'}ft\n`;
       }
    });
  }

  // Removed AI Summary section

  return context.trim();
}

// Add other formatting functions as needed... 