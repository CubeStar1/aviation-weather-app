import axios from 'axios';
export interface DashboardWeatherData {
  name?: string; 
  temperature: number | null;
  feelsLike?: number | null;
  condition: string;
  windSpeed: number | null;
  windGust?: number | null;
  windDirection: string;
  humidity: number | null;
  pressure: number | null;
  visibility: number | null;
  dewPoint: number | null;
  altimeterInHg?: number | null;
  ceiling?: number | null;
  flightCategory?: string | null;
  heatIndex?: number | null;
  warnings?: any[];
  hourlyForecast: { 
      time: string; 
      condition: string; 
      temp: number; 
  }[];
  query?: string;
  lastUpdatedUTC?: string;
  errors?: string[]; 
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchDashboardWeather = async (locationQuery: string): Promise<DashboardWeatherData> => {
  if (!locationQuery) {
    throw new Error("Location query cannot be empty.");
  }

  try {
    const encodedQuery = encodeURIComponent(locationQuery);
    const response = await axios.get<DashboardWeatherData>(
      `${API_BASE_URL}/basic_weather/${encodedQuery}`
    );
    
    if (response.data.errors && response.data.errors.length > 0) {
        console.warn(`Weather API returned errors for ${locationQuery}:`, response.data.errors);
    }
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching dashboard weather for ${locationQuery}:`, error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.error || error.response.data?.details?.[0] || `Failed to fetch weather data (${error.response.status})`);
    } else if (error instanceof Error) {
        throw error; 
    }
     throw new Error('An unknown error occurred while fetching dashboard weather.');
  }
}; 