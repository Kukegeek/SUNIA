import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import esiosApi from '../services/esiosApi.js';

const ProduccionChart = () => {
  const [produccionData, setProduccionData] = useState([]);
  const [preciosData, setPreciosData] = useState(null);
  const [historialData, setHistorialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [isFromCache, setIsFromCache] = useState(false);
  const [activeTab, setActiveTab] = useState('24h');

  // Datos simulados para diferentes tipos de energía
  const generarDatosEnergia = () => {
    const horas = Array.from({ length: 24 }, (_, i) => {
      const hora = String(i).padStart(2, '0') + ':00';
      return {
        hora,
        carbon: Math.random() * 2000 + 1000,
        gas: Math.random() * 3000 + 2000,
        solar: i >= 7 && i <= 19 ? Math.random() * 4000 + 1000 : Math.random() * 200,
        eolica: Math.random() * 2500 + 500,
        hidroelectrica: Math.random() * 1500 + 800,
        nuclear: Math.random() * 1000 + 6000
      };
    });
    return horas;
  };

  const generarDatosMensuales = () => {
    const dias = Array.from({ length: 30 }, (_, i) => {
      const fecha = new Date();
      fecha.setDate(fecha.getDate() - (29 - i));
      return {
        fecha: fecha.toISOString().split('T')[0],
        carbon: Math.random() * 48000 + 24000,
        gas: Math.random() * 72000 + 48000,
        solar: Math.random() * 60000 + 20000,
        eolica: Math.random() * 60000 + 12000,
        hidroelectrica: Math.random() * 36000 + 19200,
        nuclear: Math.random() * 24000 + 144000
      };
    });
    return dias;
  };

  const loadData = async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const [produccion, precios, historial] = await Promise.all([
        esiosApi.getProduccionUltimas24h(forceRefresh),
        esiosApi.getPreciosPVPC24h(forceRefresh),
        esiosApi.getHistorialMes(forceRefresh)
      ]);

      // Combinar datos reales con simulados
      const datosEnergia24h = generarDatosEnergia();
      const datosMensuales = generarDatosMensuales();
      
      setProduccionData(datosEnergia24h);
      setPreciosData(precios);
      setHistorialData({
        ...historial,
        energia: datosMensuales
      });
      
      // Actualizar información de caché - mostrar fecha de obtención de datos de API
      setLastUpdate({
        fecha: produccion.fechaObtencion,
        hora: produccion.horaObtencion
      });
      setIsFromCache(produccion.esCache || false);
      
    } catch (err) {
      console.error('Error cargando datos:', err);
      setError('Error al cargar los datos de producción');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = () => {
    loadData(true); // Forzar actualización
  };

  const [useProxy, setUseProxy] = useState(true);

  const toggleProxy = () => {
    const newUseProxy = !useProxy;
    setUseProxy(newUseProxy);
    esiosApi.setUseProxy(newUseProxy);
    loadData(true); // Recargar datos
  };

  // En el JSX, añadir el botón junto al botón de actualizar:
  <div className="flex gap-2">
    <button
      onClick={handleRefresh}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
    >
      🔄 Actualizar
    </button>
    <button
      onClick={toggleProxy}
      className={`px-4 py-2 rounded-lg transition-colors ${
        useProxy 
          ? 'bg-green-600 hover:bg-green-700 text-white' 
          : 'bg-gray-600 hover:bg-gray-700 text-white'
      }`}
    >
      {useProxy ? '🌐 API Real' : '🎭 Mock'}
    </button>
  </div>

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">{error}</p>
        <button 
          onClick={() => loadData()}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con información de actualización */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Producción Energética Nacional</h2>
          {lastUpdate && (
            <p className="text-sm text-gray-600">
              {isFromCache ? 'Datos en caché' : 'Datos actualizados'} - {lastUpdate.fecha} a las {lastUpdate.hora}
            </p>
          )}
        </div>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          🔄 Actualizar
        </button>
      </div>

      {/* Información sobre los datos */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-800 mb-2">ℹ️ Información sobre los datos</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-blue-800 mb-1">Fuente de datos:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• API ESIOS (Red Eléctrica de España)</li>
              <li>• Actualización automática cada 6 horas</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-blue-800 mb-1">Tecnologías mostradas:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Solo producción solar fotovoltaica</li>
              <li>• Precios en €/MWh (no convertidos a €/kWh)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('24h')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === '24h'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Últimas 24 horas
          </button>
          <button
            onClick={() => setActiveTab('mensual')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'mensual'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Histórico Mensual
          </button>
        </nav>
      </div>

      {/* Contenido de tabs */}
      {activeTab === '24h' && (
        <div className="space-y-6">
          {/* Gráfica de Producción 24h */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Producción por Tipo de Energía (MW)</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={produccionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hora" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="carbon" stroke="#374151" strokeWidth={2} name="Carbón" />
                <Line type="monotone" dataKey="gas" stroke="#3b82f6" strokeWidth={2} name="Gas" />
                <Line type="monotone" dataKey="solar" stroke="#f59e0b" strokeWidth={2} name="Solar" />
                <Line type="monotone" dataKey="eolica" stroke="#10b981" strokeWidth={2} name="Eólica" />
                <Line type="monotone" dataKey="hidroelectrica" stroke="#06b6d4" strokeWidth={2} name="Hidroeléctrica" />
                <Line type="monotone" dataKey="nuclear" stroke="#8b5cf6" strokeWidth={2} name="Nuclear" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfica de Precios 24h */}
          {preciosData && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Precios PVPC (€/MWh)</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Precio Actual</p>
                  <p className="text-2xl font-bold text-blue-600">{preciosData.actual?.toFixed(2)} €/MWh</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Precio Medio</p>
                  <p className="text-2xl font-bold text-green-600">{preciosData.medio?.toFixed(2)} €/MWh</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Precio Mínimo</p>
                  <p className="text-2xl font-bold text-yellow-600">{preciosData.minimo?.toFixed(2)} €/MWh</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Precio Máximo</p>
                  <p className="text-2xl font-bold text-red-600">{preciosData.maximo?.toFixed(2)} €/MWh</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={preciosData.historial?.map((precio, index) => ({
                  hora: `${String(index).padStart(2, '0')}:00`,
                  precio: precio
                })) || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hora" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value.toFixed(2)} €/MWh`, 'Precio']} />
                  <Bar dataKey="precio" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      {activeTab === 'mensual' && historialData && (
        <div className="space-y-6">
          {/* Gráfica de Producción Mensual */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Producción Último Mes por Tipo de Energía (MWh)</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={historialData.energia || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="fecha" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString('es-ES')}
                  formatter={(value, name) => [`${value.toFixed(0)} MWh`, name]}
                />
                <Legend />
                <Line type="monotone" dataKey="carbon" stroke="#374151" strokeWidth={2} name="Carbón" />
                <Line type="monotone" dataKey="gas" stroke="#3b82f6" strokeWidth={2} name="Gas" />
                <Line type="monotone" dataKey="solar" stroke="#f59e0b" strokeWidth={2} name="Solar" />
                <Line type="monotone" dataKey="eolica" stroke="#10b981" strokeWidth={2} name="Eólica" />
                <Line type="monotone" dataKey="hidroelectrica" stroke="#06b6d4" strokeWidth={2} name="Hidroeléctrica" />
                <Line type="monotone" dataKey="nuclear" stroke="#8b5cf6" strokeWidth={2} name="Nuclear" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfica de Precios Mensuales */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Evolución de Precios Último Mes (€/MWh)</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={historialData.precios?.slice(0, 30) || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="fecha" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString('es-ES')}
                  formatter={(value) => [`${value.toFixed(2)} €/MWh`, 'Precio Medio Diario']}
                />
                <Line 
                  type="monotone" 
                  dataKey="valor" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Precio Medio"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProduccionChart;