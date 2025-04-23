import axios from 'axios';
import { Waypoint } from '@/components/plan/flight-plan-form'; // Assuming Waypoint interface is exported

// Define expected structure based on Flask API output (adjust keys/types as needed)

// Basic METAR data structure (adjust based on actual metar.py output)
interface MetarData {
  raw: string;
  general: string;
  cloud: string | null;
  remarks: string[];
  receipt_time: string | null;
  station_id: string;
  station_name: string | null;
  vfr_allowed: boolean | null;
  api_response: any; // The raw JSON from aviationweather.gov
  error?: string;
}

// Basic PIREP data structure (adjust based on actual pirep.py output)
interface PirepReportData { 
  // Define fields from the parser.data[0].__dict__ in pirep.py
  // Example:
  raw?: string;
  location?: { repr: string };
  time?: { repr: string };
  // ... other potential fields: altitude_ft, type, clouds, icing, turbulence etc.
  [key: string]: any; // Allow other fields
}
interface PirepData {
  status: string;
  reports: PirepReportData[];
  error?: string;
}

// Basic SIGMET data structure (adjust based on actual sigmet.py output)
interface AirSigmetData {
  airSigmetId?: number;
  hazard?: string;
  severity?: string;
  altitudeHi1?: number | null;
  altitudeLo1?: number | null;
  movementDir?: number | null;
  movementSpd?: number | null;
  area?: { lat: number, lon: number }[];
  simplified_summary?: string;
  [key: string]: any; // Allow other fields
}

interface WaypointData {
  id: string;
  alt_ft: number;
  coords: [number, number] | null; // [lat, lon]
}

interface LegData {
  from: string;
  to: string;
  intersecting_sigmets: AirSigmetData[];
  error?: string;
}

// Overall API Response Type
export interface BriefingApiResponse {
  flight_plan: string;
  waypoints: WaypointData[];
  legs: LegData[];
  metar: { [key: string]: MetarData }; 
  pireps: { [key: string]: PirepData }; 
  airsigmets: AirSigmetData[];
  errors: string[];
  warnings: string[];
}

// --- Fetcher Function --- 

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000'; // Use env var or default

export const fetchFlightBriefing = async (planString: string | null): Promise<BriefingApiResponse> => {
  if (!planString) {
    // Handle null plan string case appropriately, maybe throw error or return default state
    // Throwing an error might be better for react-query handling
    throw new Error("Flight plan string cannot be null or empty.");
  }

  try {
    const response = await axios.post<BriefingApiResponse>(
      `${API_BASE_URL}/api/flight_briefing`,
      { plan: planString } // Request body
    );
    return response.data; 
  } catch (error) {
    console.error("Error fetching flight briefing:", error);
    // Re-throw or handle error appropriately for react-query
    if (axios.isAxiosError(error) && error.response) {
      // Include backend error message if available
      throw new Error(error.response.data?.error || error.message);
    }
    throw error; // Re-throw other errors
  } 
}; 