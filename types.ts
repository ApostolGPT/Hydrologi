export interface WaterEntry {
  id: string;
  date: string; // ISO String
  locationName: string;
  
  // Water Metrics
  temperature: number; // Celsius
  ph: number; // 0-14
  tds: number; // ppm
  radon: number; // Bq/L
  
  // Meteo Metrics
  airTemperature?: number; // Celsius
  humidity?: number; // %
  pressure?: number; // mmHg
  
  notes?: string;
  timestamp: number;
}

export type ViewState = 'form' | 'list' | 'stats' | 'analysis';