import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const RadiacionMurcia = () => {
  const [selectedDay, setSelectedDay] = useState(0);
  const [radiacionData, setRadiacionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para hacer web scraping
  const fetchRadiacionData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/radiacion-murcia');
      if (!response.ok) {
        throw new Error('Error al obtener datos de radiación');
      }
      const data = await response.json();
      setRadiacionData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRadiacionData();
  }, []);

  const handlePreviousDay = () => {
    setSelectedDay(prev => prev > 0 ? prev - 1 : 14);
  };

  const handleNextDay = () => {
    setSelectedDay(prev => prev < 14 ? prev + 1 : 0);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short' 
    });
  };

  const formatHour = (hour) => {
    return hour.toString().padStart(2, '0') + ':00';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">Error: {error}</p>
        <button 
          onClick={fetchRadiacionData}
          className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Reintentar
        </button>
      </div>
    );
  }

  const currentDayData = radiacionData[selectedDay] || {};
  const { fecha, amanecer, atardecer, totalRadiacion, datosHorarios = [] } = currentDayData;

  // Preparar datos para el gráfico
  const chartData = datosHorarios.map(item => ({
    hora: formatHour(item.hora),
    radiacion: item.radiacion,
    radiacionKw: (item.radiacion / 1000).toFixed(1)
  }));

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-400 to-red-500 rounded-lg p-6 mb-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Radiación Solar - Murcia</h1>
            <p className="text-orange-100">Pronóstico de radiación solar para los próximos 15 días</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold">{totalRadiacion || '0'}</div>
            <div className="text-orange-100">wh/m²</div>
          </div>
        </div>
      </div>

      {/* Navegación de días */}
      <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={handlePreviousDay}
            className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            Anterior
          </button>
          
          <h2 className="text-xl font-semibold text-gray-800">
            {fecha ? formatDate(fecha) : 'Cargando...'}
          </h2>
          
          <button 
            onClick={handleNextDay}
            className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Siguiente
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>

        {/* Pestañas de días */}
        <div className="flex overflow-x-auto space-x-2 pb-2">
          {radiacionData.map((day, index) => (
            <button
              key={index}
              onClick={() => setSelectedDay(index)}
              className={`flex-shrink-0 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedDay === index
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {day.fecha ? formatDate(day.fecha) : `Día ${index + 1}`}
            </button>
          ))}
        </div>
      </div>

      {/* Información del día */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="text-2xl mr-3">🌅</div>
            <div>
              <p className="text-sm text-gray-600">Amanecer</p>
              <p className="text-lg font-semibold">{amanecer || '--:--'}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="text-2xl mr-3">🌇</div>
            <div>
              <p className="text-sm text-gray-600">Atardecer</p>
              <p className="text-lg font-semibold">{atardecer || '--:--'}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="text-2xl mr-3">☀️</div>
            <div>
              <p className="text-sm text-gray-600">Radiación Total</p>
              <p className="text-lg font-semibold">{totalRadiacion || '0'} wh/m²</p>
            </div>
          </div>
        </div>
      </div>

      {/* Gráfico de radiación por horas */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Pronóstico por hora</h3>
        
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="hora" 
                tick={{ fontSize: 12 }}
                stroke="#666"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                stroke="#666"
                label={{ value: 'w/m²', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                formatter={(value) => [`${value} w/m²`, 'Radiación']}
                labelFormatter={(label) => `Hora: ${label}`}
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #ccc',
                  borderRadius: '8px'
                }}
              />
              <Bar 
                dataKey="radiacion" 
                fill="#f97316"
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex justify-center items-center h-64 text-gray-500">
            No hay datos disponibles para este día
          </div>
        )}
        
        {/* Lista de valores por hora */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {datosHorarios.map((item, index) => (
            <div key={index} className="bg-gray-50 rounded p-2 text-center">
              <div className="text-sm font-medium text-gray-600">
                {formatHour(item.hora)}
              </div>
              <div className="text-lg font-bold text-orange-600">
                {item.radiacion}
              </div>
              <div className="text-xs text-gray-500">w/m²</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RadiacionMurcia;