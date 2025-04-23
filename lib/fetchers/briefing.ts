import axios from 'axios';
import { Waypoint } from '@/components/plan/flight-plan-form';


export interface MetarData {
  raw: string;
  general: string;
  cloud: string | null;
  remarks: string[];
  receipt_time: string | null;
  station_id: string;
  station_name: string | null;
  vfr_allowed: boolean | null;
  api_response: any; 
  error?: string;
}

export interface PirepReportData {

  raw?: string;
  location?: { repr: string };
  time?: { repr: string };
  [key: string]: any; 
}

export interface PirepData {
  status: string;
  reports: PirepReportData[];
  error?: string;
}

export interface AirSigmetData {
  airSigmetId?: number;
  hazard?: string;
  severity?: string;
  altitudeHi1?: number | null;
  altitudeLo1?: number | null;
  movementDir?: number | null;
  movementSpd?: number | null;
  area?: { lat: number, lon: number }[];
  simplified_summary?: string;
  [key: string]: any; 
}

interface WaypointData {
  id: string;
  alt_ft: number;
  coords: [number, number] | null;
}

interface LegData {
  from: string;
  to: string;
  intersecting_sigmets: AirSigmetData[];
  error?: string;
}

export interface BriefingApiResponse {
  flight_plan: string;
  waypoints: WaypointData[];
  legs: LegData[];
  metar: { [key: string]: MetarData }; 
  pireps: { [key: string]: PirepData }; 
  airsigmets: AirSigmetData[];
  errors: string[];
  warnings: string[];
  ai_summary: string;
}

 

const API_BASE_URL = '/api'; 

export const fetchFlightBriefing = async (planString: string | null): Promise<BriefingApiResponse> => {
  if (!planString) {

    throw new Error("Flight plan string cannot be null or empty.");
  }

  try {
    const response = await axios.post<BriefingApiResponse>(
      `/api/flight_briefing`,
      { plan: planString } 
    );
    return response.data; 
  } catch (error) {
    console.error("Error fetching flight briefing:", error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.error || error.message);
    }
    throw error; 
  } 
}; 