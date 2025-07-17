class ESIOSCache {
  constructor() {
    this.cache = new Map();
    this.CACHE_DURATION = 6 * 60 * 60 * 1000; // 6 horas en milisegundos
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() - item.timestamp > this.CACHE_DURATION) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  set(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  getCacheInfo(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    return {
      fecha: new Date(item.timestamp).toLocaleDateString('es-ES'),
      hora: new Date(item.timestamp).toLocaleTimeString('es-ES')
    };
  }
}

const cache = new ESIOSCache();

class ESIOSService {
  constructor() {
    this.proxyURL = '/api/esios-proxy';
    this.token = import.meta.env.PUBLIC_ESIOS_API_TOKEN || import.meta.env.ESIOS_API_TOKEN;
    this.useProxy = true; // Flag para activar/desactivar el proxy
  }

  async makeRequest(endpoint, forceRefresh = false) {
    const cacheKey = endpoint;
    
    if (!forceRefresh) {
      const cachedData = cache.get(cacheKey);
      if (cachedData) {
        console.log('Datos obtenidos desde caché:', cacheKey);
        return cachedData;
      }
    }

    try {
      if (this.useProxy) {
        console.log('Usando proxy para obtener datos de ESIOS:', endpoint);
        const response = await fetch(this.proxyURL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            endpoint,
            token: this.token
          })
        });

        if (!response.ok) {
          throw new Error(`Error en proxy: ${response.status}`);
        }

        const result = await response.json();
        
        if (!result.success) {
          throw new Error(result.error || 'Error desconocido en proxy');
        }

        console.log('Datos obtenidos exitosamente de ESIOS vía proxy');
        cache.set(cacheKey, result.data);
        return result.data;
      } else {
        // Fallback a datos mock si el proxy está desactivado
        throw new Error('Proxy desactivado');
      }
    } catch (error) {
      console.error('Error al obtener datos de ESIOS:', error);
      console.log('Usando datos mock como fallback');
      const mockData = this.getMockData(endpoint);
      cache.set(cacheKey, mockData);
      return mockData;
    }
  }

  // Método para alternar entre proxy y mock
  setUseProxy(useProxy) {
    this.useProxy = useProxy;
    console.log(`Proxy ${useProxy ? 'activado' : 'desactivado'}`);
  }

  // Método faltante que causaba el error
  getValueForHour(apiData, hour) {
    if (!apiData?.indicator?.values) {
      return Math.random() * 200 + 50; // Valor mock
    }
    
    const values = apiData.indicator.values;
    if (hour < values.length) {
      return parseFloat(values[hour].value) || 0;
    }
    
    return 0;
  }

  // Datos de producción por tecnología (últimas 24 horas)
  async getProduccionUltimas24h(forceRefresh = false) {
    const now = new Date();
    // Usar fecha de ayer en lugar de mañana
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    const startDate = yesterday.toISOString().split('T')[0];
    const endDate = yesterday.toISOString().split('T')[0];
    
    const endpoints = {
      solar: `/indicators/1665?start_date=${startDate}&end_date=${endDate}`
    };

    const results = {};
    for (const [tech, endpoint] of Object.entries(endpoints)) {
      results[tech] = await this.makeRequest(endpoint, forceRefresh);
    }

    const processedData = this.processProduccionDataSolarOnly(results, startDate);
    
    // Añadir información de caché
    const cacheInfo = cache.getCacheInfo(endpoints.solar);
    if (cacheInfo) {
      processedData.fechaObtencion = cacheInfo.fecha;
      processedData.horaObtencion = cacheInfo.hora;
      processedData.esCache = true;
    } else {
      processedData.fechaObtencion = new Date().toLocaleDateString('es-ES');
      processedData.horaObtencion = new Date().toLocaleTimeString('es-ES');
      processedData.esCache = false;
    }

    return processedData;
  }

  // Precios PVPC (últimas 24 horas)
  async getPreciosPVPC24h(forceRefresh = false) {
    const now = new Date();
    // Usar fecha de ayer
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    const startDate = yesterday.toISOString().split('T')[0];
    const endDate = yesterday.toISOString().split('T')[0];
    
    console.log('Fechas para precios:', { startDate, endDate });
    
    const endpoint = `/indicators/1001?start_date=${startDate}&end_date=${endDate}`;
    const data = await this.makeRequest(endpoint, forceRefresh);
    
    const processedData = this.processPreciosData(data, startDate);
    
    // Añadir información de caché
    const cacheInfo = cache.getCacheInfo(endpoint);
    if (cacheInfo && !forceRefresh) {
      processedData.fechaObtencion = cacheInfo.fecha;
      processedData.horaObtencion = cacheInfo.hora;
      processedData.esCache = true;
    } else {
      processedData.fechaObtencion = new Date().toLocaleDateString('es-ES');
      processedData.horaObtencion = new Date().toLocaleTimeString('es-ES');
      processedData.esCache = false;
    }

    return processedData;
  }

  // Historial del último mes
  async getHistorialMes(forceRefresh = false) {
    const now = new Date();
    // Fecha de fin: ayer
    const endDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    // Fecha de inicio: hace 30 días
    const startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];
    
    const endpoints = {
      solar: `/indicators/1665?start_date=${startDateStr}&end_date=${endDateStr}`,
      precios: `/indicators/1001?start_date=${startDateStr}&end_date=${endDateStr}`
    };

    const results = {};
    for (const [key, endpoint] of Object.entries(endpoints)) {
      results[key] = await this.makeRequest(endpoint, forceRefresh);
    }

    return this.processHistorialData(results, startDateStr, endDateStr);
  }

  // Procesar solo datos solares
  processProduccionDataSolarOnly(rawData, dataDate) {
    const hours = Array.from({length: 24}, (_, i) => {
      const hour = String(i).padStart(2, '0');
      return {
        hora: `${hour}:00`,
        solar: this.getValueForHour(rawData.solar, i) || 0
      };
    });

    return {
      data: hours,
      fechaObtencion: dataDate,
      horaObtencion: new Date().toLocaleTimeString('es-ES')
    };
  }

  processPreciosData(rawData, dataDate) {
    if (!rawData?.indicator?.values) {
      return this.getMockPreciosData();
    }

    const values = rawData.indicator.values.map(v => parseFloat(v.value));
    
    return {
      actual: values[values.length - 1] || 150,
      medio: values.reduce((a, b) => a + b, 0) / values.length || 180,
      minimo: Math.min(...values) || 120,
      maximo: Math.max(...values) || 250,
      historial: values,
      fechaObtencion: dataDate,
      horaObtencion: new Date().toLocaleTimeString('es-ES')
    };
  }

  processHistorialData(rawData, startDate, endDate) {
    const solarData = rawData.solar?.indicator?.values || [];
    const preciosData = rawData.precios?.indicator?.values || [];
  
    // Generar fechas correctas para el último mes
    const generateMonthlyData = (data, type) => {
      if (data.length === 0) {
        // Generar datos mock con fechas correctas
        return Array.from({ length: 30 }, (_, i) => {
          const fecha = new Date();
          fecha.setDate(fecha.getDate() - (29 - i));
          return {
            fecha: fecha.toISOString().split('T')[0],
            valor: type === 'precios' ? Math.random() * 100 + 120 : Math.random() * 200 + 50
          };
        });
      }
      return data.map(v => ({
        fecha: v.datetime,
        valor: parseFloat(v.value)
      }));
    };
  
    return {
      solar: generateMonthlyData(solarData, 'solar'),
      precios: generateMonthlyData(preciosData, 'precios'),
      fechaObtencion: `${startDate} al ${endDate}`,
      horaObtencion: new Date().toLocaleTimeString('es-ES')
    };
  }

  getMockPreciosData() {
    return {
      actual: 150,
      medio: 180,
      minimo: 120,
      maximo: 250,
      historial: Array.from({length: 24}, () => Math.random() * 150 + 100),
      fechaObtencion: new Date().toLocaleDateString('es-ES'),
      horaObtencion: new Date().toLocaleTimeString('es-ES')
    };
  }

  // Datos mock para fallback
  getMockData(endpoint) {
    if (endpoint.includes('1665')) { // Solar
      return {
        indicator: {
          values: Array.from({length: 24}, (_, i) => ({
            datetime: new Date(Date.now() - (23-i) * 60 * 60 * 1000).toISOString(),
            value: i >= 6 && i <= 18 ? Math.random() * 200 + 50 : 0
          }))
        }
      };
    }
    
    if (endpoint.includes('1001')) { // Precios
      return {
        indicator: {
          values: Array.from({length: 24}, (_, i) => ({
            datetime: new Date(Date.now() - (23-i) * 60 * 60 * 1000).toISOString(),
            value: Math.random() * 100 + 120
          }))
        }
      };
    }

    return { indicator: { values: [] } };
  }

  // Calcular XP basado en producción solar
  calcularXPSolar(produccionSolar) {
    const promedioNacional = 150;
    let xp = 0;
    
    if (produccionSolar > promedioNacional * 1.2) {
      xp = 50;
    } else if (produccionSolar > promedioNacional) {
      xp = 30;
    } else if (produccionSolar > promedioNacional * 0.8) {
      xp = 15;
    } else {
      xp = 5;
    }
    
    return {
      xp,
      mensaje: this.getMensajeXP(xp),
      produccion: produccionSolar,
      promedio: promedioNacional
    };
  }

  getMensajeXP(xp) {
    if (xp >= 50) return '¡Excelente! Producción solar excepcional';
    if (xp >= 30) return '¡Bien! Buena producción solar';
    if (xp >= 15) return 'Producción solar normal';
    return 'Producción solar baja';
  }
}

export default new ESIOSService();