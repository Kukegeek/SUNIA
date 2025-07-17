// src/components/WindDashboard.jsx

import { useState, useMemo, useEffect, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { ChevronLeft, ChevronRight, Wind, Wrench, Sigma, ArrowUp, ArrowDown, Minus, Leaf } from 'lucide-react';
import { REGIONS, calculateWindPower } from '../lib/windApi.js';

// --- SUB-COMPONENTES AUXILIARES ---

const LocationSelector = ({ selections, setSelections }) => {
    const { regionKey, provinceKey } = selections;
    const availableProvinces = REGIONS[regionKey]?.provinces || {};
    const handleRegionChange = (e) => {
        const newRegionKey = e.target.value;
        const firstProvinceKey = Object.keys(REGIONS[newRegionKey].provinces)[0];
        setSelections({ regionKey: newRegionKey, provinceKey: firstProvinceKey });
    };
    const handleProvinceChange = (e) => {
        setSelections(prev => ({ ...prev, provinceKey: e.target.value }));
    };
    return (
        // <-- RESPONSIVE: 'flex-col' en móvil, 'flex-row' en PC -->
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <select value={regionKey} onChange={handleRegionChange} className="bg-slate-700/60 text-white rounded-md p-2 font-semibold border-2 border-transparent focus:border-blue-500 focus:outline-none appearance-none">
                {Object.keys(REGIONS).map(key => <option key={key} value={key} className="text-black">{REGIONS[key].name}</option>)}
            </select>
            <select value={provinceKey} onChange={handleProvinceChange} className="bg-slate-700/60 text-white rounded-md p-2 font-semibold border-2 border-transparent focus:border-blue-500 focus:outline-none appearance-none">
                {Object.keys(availableProvinces).map(key => <option key={key} value={key} className="text-black">{availableProvinces[key].name}</option>)}
            </select>
        </div>
    );
};

const InputField = ({ label, name, ...props }) => (
    <div>
        <label className="block text-sm font-medium mb-1 text-slate-300">{label}</label>
        <input type="number" name={name} {...props} className="w-full bg-slate-700/50 p-2 rounded-md border-2 border-transparent focus:border-blue-500 focus:outline-none placeholder:text-slate-500" />
    </div>
);

const TurbineConfigurator = ({ config, setConfig }) => {
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setConfig(prev => ({...prev, [name]: value }))
    }
    return (
        <div className="bg-slate-800/50 p-4 rounded-lg mt-4">
            <h3 className="text-lg font-bold text-white mb-3 flex items-center"><Wrench className="mr-2"/>Parque Eólico</h3>
            {/* <-- RESPONSIVE: 2 columnas en móvil, 4 en PC --> */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-white">
                <InputField label="Nº Aerogeneradores" name="turbineCount" value={config.turbineCount} onChange={handleInputChange} />
                <InputField label="Área Rotor (m²)" name="rotorArea" value={config.rotorArea} onChange={handleInputChange} placeholder="Ej: 7850" />
                <InputField label="Coef. Potencia (Cp)" name="powerCoefficient" value={config.powerCoefficient} onChange={handleInputChange} step="0.01" placeholder="0.25-0.45" />
                <InputField label="Potencia Pico (kW)" name="peakPower" value={config.peakPower} onChange={handleInputChange} placeholder="Ej: 2000" />
            </div>
             <p className="text-xs text-slate-400 mt-3">💡 El Coeficiente de Potencia (Cp) suele estar entre 0.25 y 0.45. La Potencia Pico limita la producción máxima por turbina.</p>
        </div>
    );
};

// --- COMPONENTE PRINCIPAL ---
export default function WindDashboard({ initialData, initialRegion, initialProvince }) {
  const [rawData, setRawData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState({ regionKey: initialRegion, provinceKey: initialProvince });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [turbineConfig, setTurbineConfig] = useState({ turbineCount: 1, rotorArea: 15.9, powerCoefficient: 0.38, peakPower: 5.2 });

  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) { isInitialMount.current = false; return; }
    const fetchData = async () => {
      setLoading(true);
      const requestParams = { regionKey: location.regionKey, provinceKey: location.provinceKey };
      try {
        const response = await fetch(`/api/wind.json?${new URLSearchParams(requestParams)}`);
        const newData = await response.json();
        setRawData(newData);
        setSelectedIndex(0);
      } catch (error) { console.error("Error al obtener datos:", error); setRawData(null); } 
      finally { setLoading(false); }
    };
    fetchData();
  }, [location]);

  const processedData = useMemo(() => {
    if (!rawData || !rawData.hourly) return [];
    const allDays = [];
    const daysCount = rawData.hourly.time.length / 24;
    
    for (let d = 0; d < daysCount; d++) {
        const startIndex = d * 24;
        const hourly = [];
        let totalProductionWh = 0;

        for (let i = startIndex; i < startIndex + 24; i++) {
            const windSpeed_kmh = rawData.hourly.windspeed_100m[i];
            const windSpeed_ms = windSpeed_kmh !== null ? windSpeed_kmh / 3.6 : 0;
            
            let generatedWh = calculateWindPower(windSpeed_ms, turbineConfig.rotorArea, turbineConfig.powerCoefficient);
            if (turbineConfig.peakPower) {
                generatedWh = Math.min(generatedWh, turbineConfig.peakPower * 1000);
            }
            
            hourly.push({
                hour: rawData.hourly.time[i].split('T')[1],
                windSpeed: windSpeed_kmh !== null ? windSpeed_kmh.toFixed(1) : '0.0',
                generated: Math.round(generatedWh * turbineConfig.turbineCount)
            });
            totalProductionWh += generatedWh * turbineConfig.turbineCount;
        }

        allDays.push({
            id: d,
            fullDate: new Date(rawData.hourly.time[startIndex].split('T')[0] + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' }).replace(/.$/, ''),
            shortDate: new Date(rawData.hourly.time[startIndex].split('T')[0] + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' }).replace(/.$/, ''),
            totalProductionKWh: totalProductionWh / 1000,
            hourly
        });
    }
    return allDays;
  }, [rawData, turbineConfig]);

  useEffect(() => {
    if (processedData && processedData.length > 0) {
      console.log("Guardando datos de producción EÓLICA en localStorage...");
      const existingCalendarData = JSON.parse(localStorage.getItem('calendarEnergyData')) || {};
      processedData.forEach(day => {
        const dateKey = day.shortDate;
        existingCalendarData[dateKey] = {
          ...existingCalendarData[dateKey],
          windPredicted: parseFloat(day.totalProductionKWh.toFixed(2)),
        };
      });
      localStorage.setItem('calendarEnergyData', JSON.stringify(existingCalendarData));
    }
  }, [processedData]);
  
  const activeDay = useMemo(() => processedData[selectedIndex] || null, [processedData, selectedIndex]);
  const total16DayProductionKWh = useMemo(() => processedData.reduce((sum, day) => sum + day.totalProductionKWh, 0), [processedData]);
  const averageDailyProductionKWh = useMemo(() => (processedData.length > 0 ? total16DayProductionKWh / processedData.length : 0), [total16DayProductionKWh]);

  const productionDiffPercentage = averageDailyProductionKWh > 0 ? ((activeDay?.totalProductionKWh - averageDailyProductionKWh) / averageDailyProductionKWh) * 100 : 0;
  const co2SavingsKg = (activeDay?.totalProductionKWh || 0) * 0.26;
  
  const tabsContainerRef = useRef(null);
  useEffect(() => {
    if (tabsContainerRef.current) {
      const activeTab = tabsContainerRef.current.children[selectedIndex];
      if (activeTab) activeTab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [selectedIndex]);
  
  const ProductionDiffIndicator = () => {
    const isPositive = productionDiffPercentage >= 0;
    const isNeutral = Math.abs(productionDiffPercentage) < 1;
    const color = isNeutral ? 'text-slate-400' : isPositive ? 'text-green-400' : 'text-red-400';
    const Icon = isNeutral ? Minus : isPositive ? ArrowUp : ArrowDown;
    return <div className={`flex items-center text-sm font-semibold ${color}`}><Icon size={16} className="mr-1"/><span>{productionDiffPercentage.toFixed(0)}% vs. media</span></div>;
  };
  
  if (loading) return <div className="text-center text-white p-8">Cargando datos eólicos...</div>;
  if (!activeDay) return <div className="text-center text-red-400 p-8">No se pudieron cargar los datos eólicos.</div>;

  return (
    <div className="w-full max-w-7xl mx-auto font-sans bg-slate-900/70 backdrop-blur-xl p-4 sm:p-6 rounded-2xl shadow-2xl text-white">
      {/* <-- RESPONSIVE: 'text-center' en móvil, 'text-left' en PC --> */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-center sm:text-left mb-6 p-4 sm:p-6 bg-gradient-to-r from-blue-500 to-teal-500 rounded-xl shadow-lg">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">
            <LocationSelector selections={location} setSelections={setLocation} />
          </h1>
          <p className="opacity-80 mt-1 text-sm sm:text-base">Pronóstico de producción eólica para los próximos 16 días</p>
        </div>
        <div className="mt-4 sm:mt-0 text-center sm:text-right w-full sm:w-auto">
          <div className="text-3xl sm:text-5xl font-bold">{total16DayProductionKWh.toLocaleString('es-ES', { maximumFractionDigits: 0 })}</div>
          <p className="opacity-80 text-sm">kWh de producción total (16 días)</p>
          <p className="font-semibold text-white/90 mt-1 text-sm">{averageDailyProductionKWh.toFixed(2)} kWh prom. diario</p>
        </div>
      </header>

      <TurbineConfigurator config={turbineConfig} setConfig={setTurbineConfig} />
      
      <div className="relative my-6">
        <div className="flex items-center">
            <button onClick={() => setSelectedIndex(p => p > 0 ? p - 1 : 0)} disabled={selectedIndex === 0} className="p-2 rounded-full bg-slate-700/50 hover:bg-slate-600/50 disabled:opacity-50"><ChevronLeft/></button>
            <div ref={tabsContainerRef} className="flex-grow overflow-x-auto whitespace-nowrap scrollbar-hide mx-2">
                {processedData.map((day, index) => <button key={day.id} onClick={() => setSelectedIndex(index)} className={`inline-block px-3 sm:px-4 py-2 text-sm font-semibold rounded-full mr-2 transition-all duration-300 capitalize ${selectedIndex === index ? 'bg-blue-500 text-white shadow' : 'bg-slate-700/80 hover:bg-slate-600/80'}`}>{day.shortDate}</button>)}
            </div>
            <button onClick={() => setSelectedIndex(p => p < processedData.length - 1 ? p + 1 : p)} disabled={selectedIndex === processedData.length - 1} className="p-2 rounded-full bg-slate-700/50 hover:bg-slate-600/50 disabled:opacity-50"><ChevronRight/></button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 mb-8">
         <div className="bg-slate-800/50 p-4 rounded-lg flex items-center space-x-4">
            <Sigma size={28} className="text-blue-400 flex-shrink-0"/>
            <div className="flex-grow">
                <p className="text-sm text-slate-300">Producción Estimada Total Día</p>
                <div className="flex items-baseline justify-between">
                    <p className="text-xl sm:text-2xl font-bold">{activeDay.totalProductionKWh.toFixed(2)} kWh</p>
                    <ProductionDiffIndicator />
                </div>
                <div className="flex items-center text-xs text-green-300/80 mt-1 pt-1 border-t border-white/10">
                    <Leaf size={14} className="mr-1.5"/>
                    <span>Ahorro de {co2SavingsKg.toFixed(2)} kg de CO₂</span>
                </div>
            </div>
        </div>
      </div>
      
      <div className="bg-slate-800/50 p-4 sm:p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-4 flex items-center"><Wind className="text-blue-400 mr-2" size={24}/> Producción Eólica Estimada por Hora</h3>
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activeDay.hourly}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                <XAxis dataKey="hour" tick={{ fill: '#a0aec0' }} />
                <YAxis unit=" kWh" tickFormatter={(value) => (value / 1000).toFixed(1)} domain={[0, 'dataMax + 500']} tick={{ fill: '#a0aec0' }} />
                <Tooltip 
                    formatter={(value, name, props) => [`${(value / 1000).toFixed(2)} kWh`, `Viento: ${props.payload.windSpeed} km/h`]}
                    contentStyle={{ background: 'rgba(30, 41, 59, 0.8)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '8px' }}
                />
                <Bar dataKey="generated" name="Producción">
                   {activeDay.hourly.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.generated > 2000000 ? "#2563eb" : entry.generated > 1000000 ? "#3b82f6" : "#60a5fa"} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
      </div>
      
      <div className="bg-slate-800/50 p-4 sm:p-6 rounded-lg mt-6">
          <h3 className="text-xl font-bold mb-4">Datos Detallados por Hora</h3>
          {/* <-- RESPONSIVE: 2 cols en móvil, 3 en sm, 4 en md, 6 en lg --> */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-4">
              {activeDay.hourly.map(hour => (
                  <div key={hour.hour} className="bg-slate-700/50 p-2 sm:p-3 rounded-md text-center">
                      <div className="text-xs sm:text-sm opacity-80">{hour.hour}</div>
                      <div className="font-bold text-sky-400 text-sm sm:text-base">{hour.windSpeed} <span className="text-xs opacity-60">km/h</span></div>
                      <div className="font-bold text-green-400 text-sm sm:text-base">{(hour.generated/1000).toFixed(1)} <span className="text-xs opacity-60">kWh</span></div>
                  </div>
              ))}
          </div>
      </div>
    </div>
  );
}
