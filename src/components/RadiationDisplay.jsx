// src/components/RadiationDisplay.jsx
import { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LabelList } from 'recharts';
import { ChevronLeft, ChevronRight, Sunrise, Sunset } from 'lucide-react';

// Componente para renderizar la etiqueta al lado de la barra
const renderCustomizedLabel = (props) => {
  const { x, y, width, height, value } = props;
  const labelText = `${value} w/m²`;
  
  // Posiciona el texto a la derecha de la barra
  return (
    <text x={x + width + 5} y={y + height / 2} fill="#374151" textAnchor="start" dy={4} fontSize={12} fontWeight="bold">
      {labelText}
    </text>
  );
};

export default function RadiationDisplay({ data }) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev < data.length - 1 ? prev + 1 : prev));
  };

  const activeDay = useMemo(() => data[selectedIndex], [data, selectedIndex]);

  if (!data || data.length === 0) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md" role="alert">
        <strong className="font-bold">Error:</strong>
        <span className="block sm:inline"> No se pudieron cargar los datos de radiación solar.</span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto font-sans bg-white p-4 sm:p-6 rounded-xl shadow-lg">
      
      {/* Navegación de Días */}
      <div className="flex items-center mb-4">
        <button onClick={handlePrev} disabled={selectedIndex === 0} className="p-2 rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
          <ChevronLeft size={24} />
        </button>
        <div className="flex-grow overflow-x-auto whitespace-nowrap scrollbar-hide mx-2">
          {data.map((day, index) => (
            <button
              key={day.id}
              onClick={() => setSelectedIndex(index)}
              className={`inline-block px-4 py-2 text-sm font-semibold rounded-full mr-2 transition-all duration-300 ${
                selectedIndex === index
                  ? 'bg-orange-500 text-white shadow'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {day.shortDate}
            </button>
          ))}
        </div>
        <button onClick={handleNext} disabled={selectedIndex === data.length - 1} className="p-2 rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Información Resumida del Día */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 p-4 bg-gray-50 rounded-lg">
        <div>
          <h2 className="text-xl font-bold text-gray-800">{activeDay.fullDate}</h2>
          <div className="flex items-center text-gray-600 mt-2 text-sm">
            <div className="flex items-center mr-4">
              <Sunrise className="w-5 h-5 mr-1 text-yellow-500" />
              <span>{activeDay.sunrise}</span>
            </div>
            <div className="flex items-center">
              <Sunset className="w-5 h-5 mr-1 text-orange-500" />
              <span>{activeDay.sunset}</span>
            </div>
          </div>
        </div>
        <div className="mt-4 sm:mt-0 text-center bg-orange-500 text-white px-6 py-3 rounded-lg shadow-md">
          <span className="text-3xl font-bold">{activeDay.totalRadiation.replace(' wh/m²', '')}</span>
          <span className="block text-sm opacity-90">wh/m²</span>
        </div>
      </div>

      {/* Gráfica de Radiación por Hora */}
      <div className="w-full h-[500px]">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Pronóstico por hora</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={activeDay.hourly}
            layout="vertical"
            margin={{ top: 5, right: 100, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e5e7eb" />
            <XAxis type="number" hide />
            <YAxis 
              dataKey="hour" 
              type="category" 
              axisLine={false} 
              tickLine={false}
              tick={{ fill: '#4b5563', fontSize: 14 }}
              width={50}
            />
            <Tooltip
              cursor={{ fill: 'rgba(249, 115, 22, 0.1)' }}
              contentStyle={{ background: '#fff', border: '1px solid #ddd', borderRadius: '8px' }}
              labelStyle={{ fontWeight: 'bold' }}
              formatter={(value) => [`${value} w/m²`, 'Radiación']}
            />
            <Bar dataKey="value" fill="#f97316" barSize={15} radius={[0, 8, 8, 0]}>
               <LabelList dataKey="value" position="right" content={renderCustomizedLabel} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
       <div className="text-center mt-6 text-sm text-gray-500">
         Radiación solar total: <strong>{activeDay.totalRadiation}</strong>
      </div>
    </div>
  );
}