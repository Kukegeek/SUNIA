// src/lib/solarApi.js

// --- ESTRUCTURA DE DATOS: PROVINCIAS POR COMUNIDAD AUTÓNOMA ---
export const REGIONS = {
  andalucia: { name: 'Andalucía', provinces: { almeria: { name: 'Almería', lat: 36.84, lon: -2.46 }, cadiz: { name: 'Cádiz', lat: 36.53, lon: -6.29 }, cordoba: { name: 'Córdoba', lat: 37.88, lon: -4.78 }, granada: { name: 'Granada', lat: 37.18, lon: -3.60 }, huelva: { name: 'Huelva', lat: 37.26, lon: -6.94 }, jaen: { name: 'Jaén', lat: 37.77, lon: -3.79 }, malaga: { name: 'Málaga', lat: 36.72, lon: -4.42 }, sevilla: { name: 'Sevilla', lat: 37.39, lon: -5.99 } } },
  aragon: { name: 'Aragón', provinces: { huesca: { name: 'Huesca', lat: 42.14, lon: -0.41 }, teruel: { name: 'Teruel', lat: 40.35, lon: -1.11 }, zaragoza: { name: 'Zaragoza', lat: 41.66, lon: -0.88 } } },
  asturias: { name: 'Asturias', provinces: { asturias: { name: 'Oviedo', lat: 43.36, lon: -5.85 } } },
  baleares: { name: 'Islas Baleares', provinces: { baleares: { name: 'Palma', lat: 39.57, lon: 2.65 } } },
  canarias: { name: 'Canarias', provinces: { las_palmas: { name: 'Las Palmas', lat: 28.12, lon: -15.43 }, santa_cruz: { name: 'Santa Cruz de Tenerife', lat: 28.47, lon: -16.25 } } },
  cantabria: { name: 'Cantabria', provinces: { cantabria: { name: 'Santander', lat: 43.46, lon: -3.81 } } },
  castilla_la_mancha: { name: 'Castilla-La Mancha', provinces: { albacete: { name: 'Albacete', lat: 38.99, lon: -1.86 }, ciudad_real: { name: 'Ciudad Real', lat: 38.99, lon: -3.93 }, cuenca: { name: 'Cuenca', lat: 40.07, lon: -2.14 }, guadalajara: { name: 'Guadalajara', lat: 40.63, lon: -3.16 }, toledo: { name: 'Toledo', lat: 39.86, lon: -4.03 } } },
  castilla_y_leon: { name: 'Castilla y León', provinces: { avila: { name: 'Ávila', lat: 40.66, lon: -4.70 }, burgos: { name: 'Burgos', lat: 42.34, lon: -3.70 }, leon: { name: 'León', lat: 42.60, lon: -5.57 }, palencia: { name: 'Palencia', lat: 42.01, lon: -4.53 }, salamanca: { name: 'Salamanca', lat: 40.97, lon: -5.66 }, segovia: { name: 'Segovia', lat: 40.95, lon: -4.12 }, soria: { name: 'Soria', lat: 41.76, lon: -2.47 }, valladolid: { name: 'Valladolid', lat: 41.65, lon: -4.72 }, zamora: { name: 'Zamora', lat: 41.50, lon: -5.75 } } },
  cataluna: { name: 'Cataluña', provinces: { barcelona: { name: 'Barcelona', lat: 41.39, lon: 2.17 }, girona: { name: 'Girona', lat: 41.98, lon: 2.82 }, lleida: { name: 'Lleida', lat: 41.62, lon: 0.62 }, tarragona: { name: 'Tarragona', lat: 41.12, lon: 1.26 } } },
  extremadura: { name: 'Extremadura', provinces: { badajoz: { name: 'Badajoz', lat: 38.88, lon: -6.97 }, caceres: { name: 'Cáceres', lat: 39.48, lon: -6.37 } } },
  galicia: { name: 'Galicia', provinces: { a_coruna: { name: 'A Coruña', lat: 43.37, lon: -8.40 }, lugo: { name: 'Lugo', lat: 43.01, lon: -7.56 }, ourense: { name: 'Ourense', lat: 42.34, lon: -7.86 }, pontevedra: { name: 'Pontevedra', lat: 42.43, lon: -8.64 } } },
  la_rioja: { name: 'La Rioja', provinces: { la_rioja: { name: 'Logroño', lat: 42.47, lon: -2.45 } } },
  madrid_comunidad: { name: 'Comunidad de Madrid', provinces: { madrid: { name: 'Madrid', lat: 40.42, lon: -3.70 } } },
  murcia_region: { name: 'Región de Murcia', provinces: { murcia: { name: 'Murcia', lat: 37.99, lon: -1.13 } } },
  navarra: { name: 'Navarra', provinces: { navarra: { name: 'Pamplona', lat: 42.82, lon: -1.65 } } },
  pais_vasco: { name: 'País Vasco', provinces: { alava: { name: 'Vitoria-Gasteiz', lat: 42.85, lon: -2.67 }, bizkaia: { name: 'Bilbao', lat: 43.26, lon: -2.93 }, gipuzkoa: { name: 'San Sebastián', lat: 43.32, lon: -1.98 } } },
  valenciana_comunidad: { name: 'Comunidad Valenciana', provinces: { alicante: { name: 'Alicante', lat: 38.35, lon: -0.48 }, castellon: { name: 'Castellón', lat: 39.99, lon: -0.04 }, valencia: { name: 'Valencia', lat: 39.47, lon: -0.38 } } },
  ceuta_melilla: { name: 'Ceuta y Melilla', provinces: { ceuta: { name: 'Ceuta', lat: 35.89, lon: -5.32 }, melilla: { name: 'Melilla', lat: 35.29, lon: -2.94 } } },
};

export function getRecommendedTilt(lat) { return Math.round(lat * 0.9); }
export function calculateEfficiency(power, width, height) { if (!power || !width || !height) return 0; const area = width * height; if (area === 0) return 0; const efficiency = (power / area / 1000) * 100; return parseFloat(efficiency.toFixed(2)); }

function formatSecondsToHMS(seconds) {
    if (isNaN(seconds)) return '--h --m';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h}h ${m}m`;
}
function formatFullDate(dateStr) { const date = new Date(dateStr + 'T00:00:00'); const options = { weekday: 'short', day: 'numeric', month: 'short' }; let formatted = new Intl.DateTimeFormat('es-ES', options).format(date); return formatted.replace(/.$/, ''); }
function formatTime(dateTimeStr) { if (!dateTimeStr) return '--:--'; return dateTimeStr.split('T')[1]; }

export async function getSolarData({ regionKey = 'murcia_region', provinceKey = 'murcia', tilt, azimuth = 0 }) {
  const province = REGIONS[regionKey]?.provinces[provinceKey];
  if (!province) throw new Error('Provincia no válida');
  
  const finalTilt = tilt !== null && tilt !== '' ? tilt : getRecommendedTilt(province.lat);

  const params = new URLSearchParams({
    latitude: province.lat,
    longitude: province.lon,
    hourly: 'global_tilted_irradiance',
    daily: 'sunrise,sunset,daylight_duration,sunshine_duration',
    forecast_days: 16,
    timezone: 'Europe/Madrid',
    tilt: finalTilt,
    azimuth: azimuth,
  });
  
  const API_URL = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;

  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`La API respondió con error ${response.status}: ${errorData.reason}`);
    }
    const data = await response.json();

    const allDaysData = data.daily.time.map((dateStr, index) => {
      let dailyRadiationSum = 0;
      const hourlyData = [];
      const startIndex = index * 24;
      const endIndex = startIndex + 24;
      
      for (let i = startIndex; i < endIndex && i < data.hourly.time.length; i++) {
        const value = data.hourly.global_tilted_irradiance[i];
        if (value !== null) {
            const roundedValue = Math.round(value);
            hourlyData.push({ hour: formatTime(data.hourly.time[i]), value: roundedValue });
            dailyRadiationSum += roundedValue;
        }
      }
      
      return {
        id: index,
        fullDate: formatFullDate(dateStr),
        shortDate: formatFullDate(dateStr),
        sunrise: formatTime(data.daily.sunrise[index]),
        sunset: formatTime(data.daily.sunset[index]),
        daylightDuration: formatSecondsToHMS(data.daily.daylight_duration[index]),
        sunshineDuration: formatSecondsToHMS(data.daily.sunshine_duration[index]),
        totalRadiation: Math.round(dailyRadiationSum),
        hourly: hourlyData,
      };
    });

    return allDaysData;
  } catch (error) {
    console.error("Error al obtener datos:", error);
    return [];
  }
}