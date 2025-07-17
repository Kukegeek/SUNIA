import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const RadiacionSolar = () => {
  const [selectedDay, setSelectedDay] = useState(0);
  const [solarData, setSolarData] = useState([]);

  const radiacionData = [
    {
      fecha: '11 de Julio',
      amanecer: '6:50',
      anochecer: '21:29',
      totalRadiacion: 7285,
      datos: [
        { hora: '08:00', radiacion: 86 },
        { hora: '09:00', radiacion: 252 },
        { hora: '10:00', radiacion: 425 },
        { hora: '11:00', radiacion: 625 },
        { hora: '12:00', radiacion: 778 },
        { hora: '13:00', radiacion: 883 },
        { hora: '14:00', radiacion: 927 },
        { hora: '15:00', radiacion: 904 },
        { hora: '16:00', radiacion: 834 },
        { hora: '17:00', radiacion: 706 },
        { hora: '18:00', radiacion: 430 },
        { hora: '19:00', radiacion: 246 },
        { hora: '20:00', radiacion: 172 },
        { hora: '21:00', radiacion: 17 }
      ]
    },
    {
      fecha: '12 de Julio',
      amanecer: '6:50',
      anochecer: '21:29',
      totalRadiacion: 7715,
      datos: [
        { hora: '08:00', radiacion: 112 },
        { hora: '09:00', radiacion: 306 },
        { hora: '10:00', radiacion: 424 },
        { hora: '11:00', radiacion: 564 },
        { hora: '12:00', radiacion: 798 },
        { hora: '13:00', radiacion: 905 },
        { hora: '14:00', radiacion: 950 },
        { hora: '15:00', radiacion: 930 },
        { hora: '16:00', radiacion: 855 },
        { hora: '17:00', radiacion: 732 },
        { hora: '18:00', radiacion: 569 },
        { hora: '19:00', radiacion: 377 },
        { hora: '20:00', radiacion: 177 },
        { hora: '21:00', radiacion: 16 }
      ]
    },
    {
      fecha: '13 de Julio',
      amanecer: '6:51',
      anochecer: '21:29',
      totalRadiacion: 7940,
      datos: [
        { hora: '08:00', radiacion: 112 },
        { hora: '09:00', radiacion: 308 },
        { hora: '10:00', radiacion: 506 },
        { hora: '11:00', radiacion: 681 },
        { hora: '12:00', radiacion: 820 },
        { hora: '13:00', radiacion: 912 },
        { hora: '14:00', radiacion: 949 },
        { hora: '15:00', radiacion: 930 },
        { hora: '16:00', radiacion: 851 },
        { hora: '17:00', radiacion: 733 },
        { hora: '18:00', radiacion: 569 },
        { hora: '19:00', radiacion: 377 },
        { hora: '20:00', radiacion: 176 },
        { hora: '21:00', radiacion: 16 }
      ]
    }
  ];

  useEffect(() => {
    setSolarData(radiacionData);
  }, []);

  const currentDayData = solarData[selectedDay] || {};

  const nextDay = () => {
    setSelectedDay(prev => (prev + 1) % solarData.length);
  };

  const prevDay = () => {
    setSelectedDay(prev => (prev - 1 + solarData.length) % solarData.length);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center flex items-center justify-center">
        <span className="mr-3">☀️</span>
        Radiacion Solar - Region de Murcia
      </h1>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={prevDay}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            Anterior
          </button>
          
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800">{currentDayData.fecha}</h2>
            <div className="flex justify-center space-x-6 mt-2 text-sm text-gray-600">
              <div className="flex items-center">
                <span className="mr-1">🌅</span>
                <span>Amanecer: {currentDayData.amanecer}</span>
              </div>
              <div className="flex items-center">
                <span className="mr-1">🌇</span>
                <span>Anochecer: {currentDayData.anochecer}</span>
              </div>
            </div>
            <div className="mt-2">
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                Total: {currentDayData.totalRadiacion} Wh/m²
              </span>
            </div>
          </div>
          
          <button
            onClick={nextDay}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center"
          >
            Siguiente
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Radiacion Solar por Horas - {currentDayData.fecha}
        </h3>
        
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={currentDayData.datos || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="hora" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                label={{ value: 'W/m²', angle: -90, position: 'insideLeft' }}
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                formatter={(value) => [`${value} W/m²`, 'Radiacion']}
                labelFormatter={(label) => `Hora: ${label}`}
                contentStyle={{
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #dee2e6',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="radiacion" 
                stroke="#f59e0b" 
                strokeWidth={3}
                dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#f59e0b', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-yellow-50 p-4 rounded-lg text-center">
            <h4 className="text-sm font-medium text-gray-600">Pico Maximo</h4>
            <p className="text-2xl font-bold text-yellow-600">
              {Math.max(...(currentDayData.datos || []).map(d => d.radiacion))} W/m²
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <h4 className="text-sm font-medium text-gray-600">Promedio Diario</h4>
            <p className="text-2xl font-bold text-blue-600">
              {Math.round((currentDayData.datos || []).reduce((acc, d) => acc + d.radiacion, 0) / (currentDayData.datos || []).length)} W/m²
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <h4 className="text-sm font-medium text-gray-600">Horas de Sol</h4>
            <p className="text-2xl font-bold text-green-600">
              {(currentDayData.datos || []).filter(d => d.radiacion > 50).length}h
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <h4 className="text-sm font-medium text-gray-600">Eficiencia</h4>
            <p className="text-2xl font-bold text-purple-600">
              {Math.round((currentDayData.totalRadiacion || 0) / 100)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RadiacionSolar;