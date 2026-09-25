import { SoilInfo, LocationInfo, WeatherInfo } from '@/types';

export const demoSoilData: SoilInfo = {
  // Primary nutrients
  nitrogen: 245,
  phosphorus: 18,
  potassium: 165,
  ph: 7.2,
  organicCarbon: 0.62,

  // Secondary & micronutrients
  sulphur: 12.4, // mg/kg (moderate/sufficient: >10)
  zinc: 0.85, // mg/kg (sufficient: >0.6)
  iron: 5.2, // mg/kg (sufficient: >4.5)
  boron: 0.45, // mg/kg (marginal/low: <0.5)
  manganese: 3.8, // mg/kg (sufficient: >2.0)
  copper: 0.42, // mg/kg (sufficient: >0.2)

  // Report metadata & freshness check
  sampleDate: '2024-03-15',
  testDate: '2024-03-20',
  labName: 'District Soil Testing Laboratory, Pune',
  soilHealthCardNumber: 'MH-PUN-2024-8842',
  farmArea: 2.5,
  irrigationType: 'Borewell / Drip',
  rainfallInfo: '650-750 mm annual',
  latitude: 18.5204,
  longitude: 73.8567,

  // Soil Health Card Validity & Prescriptions
  validityPeriod: {
    startDate: '15/09/2024',
    endDate: '14/09/2027',
    isValid: true,
  },
  cropRecommendations: ['Paddy', 'Wheat', 'Maize', 'Soybean', 'Sugarcane', 'Groundnut'],
  fertilizerRecommendations: {
    organicManure: 'FYM / Compost: 5 tonnes/ha',
    biofertilizer: 'Azotobacter + PSB @ 5 kg/ha seed treatment',
    gypsumLime: 'Gypsum: 250 kg/ha',
    zinc: 'Zinc Sulphate: 25 kg/ha',
    boron: 'Borax: 10 kg/ha',
    cropSpecific: [
      { cropName: 'Paddy', npkKgHa: '100-50-50 kg/ha' },
      { cropName: 'Wheat', npkKgHa: '120-60-40 kg/ha' },
      { cropName: 'Maize', npkKgHa: '120-60-40 kg/ha' },
      { cropName: 'Soybean', npkKgHa: '30-60-40 kg/ha' },
      { cropName: 'Sugarcane', npkKgHa: '250-115-115 kg/ha' },
      { cropName: 'Groundnut', npkKgHa: '25-50-75 kg/ha' },
    ],
  },

  source: 'demo',
};

export const demoLocation: LocationInfo = {
  lat: 18.5204,
  lng: 73.8567,
  display: 'Pune, Maharashtra',
  name: 'Pune',
  district: 'Pune',
  state: 'Maharashtra',
  source: 'demo',
};

export const demoWeather: WeatherInfo = {
  temp: 27,
  feelsLike: 29,
  humidity: 72,
  rainProbability: 40,
  windSpeed: 12,
  description: 'Partly cloudy',
  icon: '02d',
  source: 'demo',
  forecast: [
    { day: 'Tomorrow', high: 29, low: 22, rain: 30, icon: '02d', description: 'Partly cloudy' },
    { day: 'Day 3', high: 28, low: 21, rain: 60, icon: '10d', description: 'Light rain' },
    { day: 'Day 4', high: 26, low: 20, rain: 70, icon: '10d', description: 'Moderate rain' },
    { day: 'Day 5', high: 28, low: 21, rain: 20, icon: '01d', description: 'Clear sky' },
  ],
};
