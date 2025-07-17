import React, { useState, useEffect } from 'react';
import aemetApi from '../services/aemetApi.js';

const ClimaWidget = () => {
  const [climaData, setClimaData] = useState(null);
  const [prediccionData, setPrediccionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('actual');

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        const [observacion, prediccion] = await Promise.all([
          aemetApi.obtenerObservacionActual(),
          aemetApi.obtenerPrediccion()
        ]);
        
        setClimaData(observacion);
        setPrediccionData(prediccion);
      } catch (err) {
        console.error('Error cargando datos del clima:', err);
        setError('Error al cargar datos meteorológicos');
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

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
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Clima - Murcia</h1>
        <p className="text-gray-600">Condiciones meteorológicas y pronóstico</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('actual')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'actual'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Condiciones Actuales
          </button>
          <button
            onClick={() => setActiveTab('prediccion')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'prediccion'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Predicción
          </button>
        </nav>
      </div>

      {/* Condiciones Actuales */}
      {activeTab === 'actual' && climaData && (
        <div className="space-y-6">
          {/* Condiciones principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="text-4xl mb-2">{climaData.icono}</div>
              <h3 className="text-lg font-semibold text-gray-900">{climaData.descripcion}</h3>
              <p className="text-3xl font-bold text-blue-600">{climaData.temperatura}°C</p>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Humedad</h3>
              <p className="text-2xl font-bold text-green-600">{climaData.humedad}%</p>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Presión</h3>
              <p className="text-2xl font-bold text-purple-600">{climaData.presion} hPa</p>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Viento</h3>
              <p className="text-2xl font-bold text-orange-600">{climaData.viento.velocidad} km/h</p>
              <p className="text-sm text-gray-600">{climaData.viento.direccion}</p>
            </div>
          </div>

          {/* Nuevas tarjetas de condiciones */}
          {prediccionData && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tarjeta de condiciones excelentes */}
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg shadow p-6 text-white">
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-3">☀️</span>
                  <div>
                    <h3 className="text-xl font-bold">Condiciones Excelentes</h3>
                    <p className="text-yellow-100">Próximos {prediccionData.condicionesExcelentes.diasSoleados} días soleados</p>
                  </div>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-4">
                  <p className="text-lg font-semibold mb-2">Aumento estimado de generación solar:</p>
                  <div className="flex justify-between">
                    <span className="text-2xl font-bold">+{prediccionData.condicionesExcelentes.aumentoGeneracion.porcentaje}%</span>
                    <span className="text-2xl font-bold">+{prediccionData.condicionesExcelentes.aumentoGeneracion.mwh} MWh</span>
                  </div>
                </div>
              </div>

              {/* Tarjeta de viento */}
              <div className="bg-gradient-to-r from-blue-400 to-cyan-500 rounded-lg shadow p-6 text-white">
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-3">💨</span>
                  <div>
                    <h3 className="text-xl font-bold">Condiciones de Viento</h3>
                    <p className="text-blue-100">Media: {prediccionData.viento.velocidadMedia} km/h</p>
                  </div>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-4">
                  <p className="text-sm mb-2">Horas de viento favorable: {prediccionData.viento.horasViento}h</p>
                  <p className="text-lg font-semibold mb-2">Aumento estimado de generación eólica:</p>
                  <div className="flex justify-between">
                    <span className="text-2xl font-bold">+{prediccionData.viento.aumentoGeneracion.porcentaje}%</span>
                    <span className="text-2xl font-bold">+{prediccionData.viento.aumentoGeneracion.mwh} MWh</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Predicción */}
      {activeTab === 'prediccion' && prediccionData && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Predicción 5 días</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {prediccionData.proximosDias.map((dia, index) => (
              <div key={index} className="text-center p-4 border rounded-lg">
                <p className="font-semibold text-gray-900">{dia.dia}</p>
                <div className="text-3xl my-2">{dia.icono}</div>
                <p className="text-sm text-gray-600">{dia.estado}</p>
                <div className="mt-2">
                  <p className="text-lg font-bold text-red-500">{dia.temp.max}°</p>
                  <p className="text-sm text-blue-500">{dia.temp.min}°</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClimaWidget;