export type Language = 'en' | 'es'

export const translations = {
  en: {
    // Navigation
    nav: {
      dashboard: 'Dashboard',
      charts: 'Historical Charts',
      settings: 'Settings',
    },
    // Header
    header: {
      weatherStation: 'Weather Station',
      lastUpdated: 'Last updated',
      connecting: 'Connecting...',
      refresh: 'Refresh data',
    },
    // Settings
    settings: {
      language: 'Language',
      units: 'Units',
      theme: 'Theme',
      imperial: 'Imperial',
      metric: 'Metric',
      dark: 'Dark',
      light: 'Light',
      english: 'English',
      spanish: 'Spanish',
    },
    // Cards
    cards: {
      temperature: 'Temperature',
      humidity: 'Humidity',
      feelsLike: 'Feels like',
      wind: 'Wind',
      gust: 'Gust',
      barometer: 'Barometer',
      rising: 'Rising',
      falling: 'Falling',
      steady: 'Steady',
      rainfall: 'Rainfall',
      rate: 'Rate',
      today: 'Today',
      yearly: 'Yearly',
      indoor: 'Indoor',
      sunTimes: 'Sun Times',
      sunrise: 'Sunrise',
      sunset: 'Sunset',
    },
    // Charts
    charts: {
      title: 'Historical Data',
      subtitle: 'Weather data from the last 24 hours',
      temperatureChart: 'Temperature Over Time',
      humidityChart: 'Humidity Over Time',
      windChart: 'Wind Speed Over Time',
      pressureChart: 'Barometric Pressure Over Time',
      rainChart: 'Rainfall Over Time',
      outdoorTemp: 'Outdoor Temp',
      indoorTemp: 'Indoor Temp',
      outdoorHumidity: 'Outdoor Humidity',
      indoorHumidity: 'Indoor Humidity',
      windSpeed: 'Wind Speed',
      windGust: 'Wind Gust',
      pressure: 'Pressure',
      rainRate: 'Rain Rate',
      loading: 'Loading historical data...',
      error: 'Failed to load historical data',
      noData: 'No data available',
      dateTime: 'Date of fetch of data',
    },
    // Footer
    footer: {
      stationInfo: 'Station Information',
      firmware: 'Firmware',
      uptime: 'Uptime',
      battery: 'Battery',
      signal: 'Signal',
      minutes: 'minutes',
    },
  },
  es: {
    // Navigation
    nav: {
      dashboard: 'Panel Principal',
      charts: 'Graficos Historicos',
      settings: 'Configuracion',
    },
    // Header
    header: {
      weatherStation: 'Estacion Meteorologica',
      lastUpdated: 'Ultima actualizacion',
      connecting: 'Conectando...',
      refresh: 'Actualizar datos',
    },
    // Settings
    settings: {
      language: 'Idioma',
      units: 'Unidades',
      theme: 'Tema',
      imperial: 'Imperial',
      metric: 'Metrico',
      dark: 'Oscuro',
      light: 'Claro',
      english: 'Ingles',
      spanish: 'Español',
    },
    // Cards
    cards: {
      temperature: 'Temperatura',
      humidity: 'Humedad',
      feelsLike: 'Sensacion termica',
      wind: 'Viento',
      gust: 'Rafaga',
      barometer: 'Barometro',
      rising: 'Subiendo',
      falling: 'Bajando',
      steady: 'Estable',
      rainfall: 'Lluvia',
      rate: 'Intensidad',
      today: 'Hoy',
      yearly: 'Anual',
      indoor: 'Interior',
      sunTimes: 'Horario Solar',
      sunrise: 'Amanecer',
      sunset: 'Atardecer',
    },
    // Charts
    charts: {
      title: 'Datos Historicos',
      subtitle: 'Datos meteorologicos de las ultimas 24 horas',
      temperatureChart: 'Temperatura en el Tiempo',
      humidityChart: 'Humedad en el Tiempo',
      windChart: 'Velocidad del Viento en el Tiempo',
      pressureChart: 'Presion Barometrica en el Tiempo',
      rainChart: 'Lluvia en el Tiempo',
      outdoorTemp: 'Temp. Exterior',
      indoorTemp: 'Temp. Interior',
      outdoorHumidity: 'Humedad Exterior',
      indoorHumidity: 'Humedad Interior',
      windSpeed: 'Velocidad',
      windGust: 'Rafaga',
      pressure: 'Presion',
      rainRate: 'Intensidad',
      loading: 'Cargando datos historicos...',
      error: 'Error al cargar datos historicos',
      noData: 'Sin datos disponibles',
      dateTime: 'Fecha de la recopilación de datos',
    },
    // Footer
    footer: {
      stationInfo: 'Informacion de la Estacion',
      firmware: 'Firmware',
      uptime: 'Tiempo activo',
      battery: 'Bateria',
      signal: 'Senal',
      minutes: 'minutos',
    },
  },
} as const

export type Translations = typeof translations.en
