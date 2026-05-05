// DTOs for Cloud Functions API responses

// Generic API response structure
export interface CloudApiResponse<T> {
  total: number
  data: T[]
}

// Raw temperature data from vw_temperatura view
export interface TemperatureDto {
  id: number
  fecha: string // ISO date string
  hora: string
  temperatura_exterior: string | null
  temperatura_interior: string | null
  humedad_exterior: string | null
  humedad_interior: string | null
  sensacion_termica: string | null
  punto_rocio: string | null
}

// Raw wind data from vw_viento view
export interface WindDto {
  id: number
  fecha: string
  hora: string
  velocidad_kmh: string | null
  rafaga_kmh: string | null
  direccion: string | null
  direccion_rafaga: string | null
}

// Raw rain data from vw_lluvia view
export interface RainDto {
  id: number
  fecha: string
  hora: string
  lluvia_mm: string | null
  tasa_lluvia: string | null
  lluvia_diaria: string | null
}

// Raw pressure data from vw_presion view
export interface PressureDto {
  id: number
  fecha: string
  hora: string
  presion_hpa: string | null
  tendencia: string | null
}

// Raw clean weather data from vw_clean_weather view
export interface CleanWeatherDto {
  id: number
  fecha: string
  hora: string
  temperatura_exterior: string | null
  temperatura_interior: string | null
  humedad_exterior: string | null
  humedad_interior: string | null
  velocidad_kmh: string | null
  rafaga_kmh: string | null
  direccion: string | null
  presion_hpa: string | null
  lluvia_mm: string | null
  tasa_lluvia: string | null
}

// Union type for all DTOs
export type HistoricalDto = TemperatureDto | WindDto | RainDto | PressureDto | CleanWeatherDto
