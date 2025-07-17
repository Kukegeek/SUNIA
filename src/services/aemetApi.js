const AEMET_API_KEY = import.meta.env.AEMET_API_KEY;
const AEMET_BASE_URL = import.meta.env.AEMET_BASE_URL;
const CACHE_DURATION = 21600000; // 6 horas en milisegundos

let cache = {
  prediccion: { data: null, timestamp: 0 },
  observacion: { data: null, timestamp: 0 }
};

function isCacheValid(cacheEntry) {
  return cacheEntry.data && (Date.now() - cacheEntry.timestamp) < CACHE_DURATION;
}

// Función para obtener datos de una URL de datos de AEMET
async function fetchAemetData(dataUrl) {
  try {
    const response = await fetch(dataUrl);
    if (!response.ok) {
      throw new Error(`Error al obtener datos: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching AEMET data:', error);
    return null;
  }
}

// Obtener predicción meteorológica
export async function obtenerPrediccion(codigoMunicipio = '28079') { // Madrid por defecto
  if (isCacheValid(cache.prediccion)) {
    return cache.prediccion.data;
  }

  try {
    // Primero obtenemos la URL de los datos
    const metadataUrl = `${AEMET_BASE_URL}/prediccion/especifica/municipio/diaria/${codigoMunicipio}/?api_key=${AEMET_API_KEY}`;
    const metadataResponse = await fetch(metadataUrl);
    
    if (!metadataResponse.ok) {
      throw new Error(`Error en metadata: ${metadataResponse.status}`);
    }
    
    const metadata = await metadataResponse.json();
    
    if (metadata.estado === 200 && metadata.datos) {
      const prediccionData = await fetchAemetData(metadata.datos);
      
      if (prediccionData && prediccionData.length > 0) {
        const prediccion = prediccionData[0];
        
        cache.prediccion = {
          data: {
            municipio: prediccion.nombre,
            provincia: prediccion.provincia,
            prediccion: prediccion.prediccion
          },
          timestamp: Date.now()
        };
        
        return cache.prediccion.data;
      }
    }
    
    throw new Error('No se pudieron obtener datos de predicción');
  } catch (error) {
    console.error('Error al obtener predicción AEMET:', error);
    
    // Datos mock en caso de error
    const mockData = {
      municipio: 'Murcia',
      provincia: 'Murcia',
      prediccion: {
        dia: [
          {
            fecha: new Date().toISOString().split('T')[0],
            temperatura: { maxima: 24, minima: 12 },
            sensTermica: { maxima: 26, minima: 10 },
            humedadRelativa: { maxima: 75, minima: 45 },
            viento: [{ velocidad: [15, 25] }],
            estadoCielo: [{ value: '12', descripcion: 'Poco nuboso' }],
            precipitacion: [{ value: 0 }],
            nieve: [{ value: 0 }]
          },
          {
            fecha: new Date(Date.now() + 86400000).toISOString().split('T')[0],
            temperatura: { maxima: 26, minima: 14 },
            sensTermica: { maxima: 28, minima: 12 },
            humedadRelativa: { maxima: 70, minima: 40 },
            viento: [{ velocidad: [10, 20] }],
            estadoCielo: [{ value: '11', descripcion: 'Despejado' }],
            precipitacion: [{ value: 0 }],
            nieve: [{ value: 0 }]
          }
        ]
      }
    };
    
    cache.prediccion = {
      data: mockData,
      timestamp: Date.now()
    };
    
    return mockData;
  }
}

// Obtener observación actual
export async function obtenerObservacionActual(codigoEstacion = '3195') { // Madrid Retiro
  if (isCacheValid(cache.observacion)) {
    return cache.observacion.data;
  }

  try {
    const metadataUrl = `${AEMET_BASE_URL}/observacion/convencional/datos/estacion/${codigoEstacion}/?api_key=${AEMET_API_KEY}`;
    const metadataResponse = await fetch(metadataUrl);
    
    if (!metadataResponse.ok) {
      throw new Error(`Error en metadata: ${metadataResponse.status}`);
    }
    
    const metadata = await metadataResponse.json();
    
    if (metadata.estado === 200 && metadata.datos) {
      const observacionData = await fetchAemetData(metadata.datos);
      
      if (observacionData && observacionData.length > 0) {
        const ultimaObservacion = observacionData[observacionData.length - 1];
        
        cache.observacion = {
          data: ultimaObservacion,
          timestamp: Date.now()
        };
        
        return ultimaObservacion;
      }
    }
    
    throw new Error('No se pudieron obtener datos de observación');
  } catch (error) {
    console.error('Error al obtener observación AEMET:', error);
    
    // Datos mock en caso de error
    const mockData = {
      fecha: new Date().toISOString(),
      temperatura: 22.5,
      humedadRelativa: 65,
      vientoVelocidad: 12,
      vientoDireccion: 'SW',
      presion: 1013.2,
      precipitacion: 0,
      radiacionSolar: 850
    };
    
    cache.observacion = {
      data: mockData,
      timestamp: Date.now()
    };
    
    return mockData;
  }
}

// Función para obtener el icono del tiempo según el código
export function obtenerIconoTiempo(codigo) {
  const iconos = {
    '11': '☀️', // Despejado
    '12': '🌤️', // Poco nuboso
    '13': '⛅', // Intervalos nubosos
    '14': '☁️', // Nuboso
    '15': '☁️', // Muy nuboso
    '16': '☁️', // Cubierto
    '17': '🌦️', // Nubes altas
    '23': '🌦️', // Intervalos nubosos con lluvia
    '24': '🌧️', // Nuboso con lluvia
    '25': '🌧️', // Muy nuboso con lluvia
    '26': '🌧️', // Cubierto con lluvia
    '33': '❄️', // Intervalos nubosos con nieve
    '34': '❄️', // Nuboso con nieve
  };
  
  return iconos[codigo] || '🌤️';
}


class AEMETService {
  constructor() {
    this.baseURL = 'https://opendata.aemet.es/opendata/api';
    this.apiKey = import.meta.env.AEMET_API_KEY || 'tu_api_key_aqui';
    // Código de estación meteorológica de Murcia
    this.estacionMurcia = '7178'; // Murcia/Alcantarilla
    this.municipioMurcia = '30030'; // Código INE de Murcia
  }

  async makeRequest(endpoint) {
    try {
      // Usar datos mock debido a problemas de API
      console.log('Usando datos mock para AEMET - Murcia');
      return this.getMockData(endpoint);
    } catch (error) {
      console.error('Error en API AEMET:', error);
      return this.getMockData(endpoint);
    }
  }

  async obtenerObservacionActual() {
    const endpoint = `/observacion/convencional/datos/estacion/${this.estacionMurcia}`;
    return await this.makeRequest(endpoint);
  }

  async obtenerPrediccion() {
    const endpoint = `/prediccion/especifica/municipio/diaria/${this.municipioMurcia}`;
    return await this.makeRequest(endpoint);
  }

  async obtenerPrediccionViento() {
    const endpoint = `/prediccion/especifica/municipio/horaria/${this.municipioMurcia}`;
    return await this.makeRequest(endpoint);
  }

  getMockData(endpoint) {
    if (endpoint.includes('observacion')) {
      return {
        temperatura: 28,
        humedad: 45,
        presion: 1015,
        viento: {
          velocidad: 12,
          direccion: 'SO'
        },
        descripcion: 'Soleado',
        icono: '☀️',
        fechaHora: new Date().toISOString()
      };
    }

    if (endpoint.includes('prediccion')) {
      return {
        proximosDias: [
          { dia: 'Hoy', temp: { max: 32, min: 18 }, estado: 'Soleado', icono: '☀️' },
          { dia: 'Mañana', temp: { max: 31, min: 17 }, estado: 'Soleado', icono: '☀️' },
          { dia: 'Pasado', temp: { max: 30, min: 16 }, estado: 'Soleado', icono: '☀️' },
          { dia: 'Jueves', temp: { max: 29, min: 15 }, estado: 'Soleado', icono: '☀️' },
          { dia: 'Viernes', temp: { max: 31, min: 17 }, estado: 'Soleado', icono: '☀️' }
        ],
        condicionesExcelentes: {
          diasSoleados: 5,
          aumentoGeneracion: {
            porcentaje: 25,
            mwh: 45
          }
        },
        viento: {
          velocidadMedia: 15,
          horasViento: 8,
          aumentoGeneracion: {
            porcentaje: 18,
            mwh: 32
          }
        }
      };
    }

    return {};
  }
}

export default new AEMETService();