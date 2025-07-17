// src/components/RadiationDashboard.jsx

import { useState, useMemo, useEffect, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { ChevronLeft, ChevronRight, Sunrise, Sunset, Sun, Wrench, Sigma, Clock, CloudSun, BatteryCharging, ArrowUp, ArrowDown, Minus, Leaf  } from 'lucide-react';
import { REGIONS, getRecommendedTilt, calculateEfficiency } from '../lib/solarApi.js';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

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
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <select value={regionKey} onChange={handleRegionChange} className="bg-slate-700/60 text-white rounded-md p-2 font-semibold border-2 border-transparent focus:border-orange-500 focus:outline-none appearance-none">
                {Object.keys(REGIONS).map(key => <option key={key} value={key} className="text-black">{REGIONS[key].name}</option>)}
            </select>
            <select value={provinceKey} onChange={handleProvinceChange} className="bg-slate-700/60 text-white rounded-md p-2 font-semibold border-2 border-transparent focus:border-orange-500 focus:outline-none appearance-none">
                {Object.keys(availableProvinces).map(key => <option key={key} value={key} className="text-black">{availableProvinces[key].name}</option>)}
            </select>
        </div>
    );
};

const PanelConfigurator = ({ config, setConfig, region, province }) => {
    const provinceData = REGIONS[region]?.provinces[province];
    if (!provinceData) return null;
    const recommendedTilt = getRecommendedTilt(provinceData.lat);
    const efficiency = calculateEfficiency(config.power, config.width, config.height);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setConfig(prev => ({...prev, [name]: value }))
    }

    return (
        <div className="bg-slate-800/50 p-4 rounded-lg mt-4">
            <h3 className="text-lg font-bold text-white mb-3 flex items-center"><Wrench className="mr-2"/>Configuración de Paneles</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 text-white">
                <InputField label="Nº Paneles" name="panelCount" value={config.panelCount} onChange={handleInputChange} />
                <InputField label="Potencia (W)" name="power" value={config.power} onChange={handleInputChange} placeholder="Ej: 450" />
                <InputField label="Ancho (m)" name="width" value={config.width} onChange={handleInputChange} placeholder="Ej: 1.13" />
                <InputField label="Alto (m)" name="height" value={config.height} onChange={handleInputChange} placeholder="Ej: 2.28" />
                <InputField label="Inclinación (°)" name="tilt" value={config.tilt} onChange={handleInputChange} placeholder={`${recommendedTilt}° (rec.)`} />
                <InputField label="Azimut (°)" name="azimuth" value={config.azimuth} onChange={handleInputChange} placeholder="0° (Sur)" />
            </div>
             <p className="text-xs text-slate-400 mt-3">💡 Azimut: 0°=Sur, -90°=Este, 90°=Oeste. Dejar Inclinación en blanco para usar el valor recomendado.</p>
             {efficiency > 0 && <p className="text-sm font-semibold text-white mt-2">Eficiencia calculada: {efficiency}%</p>}
        </div>
    );
}

const InputField = ({ label, name, ...props }) => (
    <div>
        <label className="block text-sm font-medium mb-1 text-slate-300">{label}</label>
        <input type="number" name={name} {...props} className="w-full bg-slate-700/50 p-2 rounded-md border-2 border-transparent focus:border-orange-500 focus:outline-none placeholder:text-slate-500" />
    </div>
);

const InfoCard = ({ icon, title, value, children }) => (
    <div className="bg-slate-800/50 p-4 rounded-lg flex items-center space-x-4">
        {icon}
        <div className="flex-grow">
            <p className="text-sm text-slate-300">{title}</p>
            <div className="flex items-baseline justify-between">
                <p className="text-xl sm:text-2xl font-bold">{value}</p>
                {children}
            </div>
        </div>
    </div>
);

// --- COMPONENTE PRINCIPAL ---
export default function RadiationDashboard({ initialData, initialRegion, initialProvince }) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState({ regionKey: initialRegion, provinceKey: initialProvince });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [panelConfig, setPanelConfig] = useState({ panelCount: 10, power: 450, width: 1.134, height: 2.279, tilt: '', azimuth: 0 });

  const tabsContainerRef = useRef(null);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) { isInitialMount.current = false; return; }
    const fetchData = async () => {
      setLoading(true);
      const provinceData = REGIONS[location.regionKey].provinces[location.provinceKey];
      const recommendedTilt = getRecommendedTilt(provinceData.lat);
      const requestParams = {
        regionKey: location.regionKey, provinceKey: location.provinceKey,
        tilt: panelConfig.tilt !== '' ? panelConfig.tilt : recommendedTilt,
        azimuth: panelConfig.azimuth || 0,
      };
      try {
        const response = await fetch(`/api/solar.json?${new URLSearchParams(requestParams)}`);
        const newData = await response.json();
        setData(newData);
        setSelectedIndex(0);
      } catch (error) { console.error("Error al obtener datos:", error); setData([]); } 
      finally { setLoading(false); }
    };
    fetchData();
  }, [location, panelConfig.tilt, panelConfig.azimuth]);

  const efficiency = useMemo(() => calculateEfficiency(panelConfig.power, panelConfig.width, panelConfig.height) / 100, [panelConfig.power, panelConfig.width, panelConfig.height]);
  const area = useMemo(() => (panelConfig.width || 0) * (panelConfig.height || 0), [panelConfig.width, panelConfig.height]);
  
  useEffect(() => {
    if (data && data.length > 0) {
      const existingCalendarData = JSON.parse(localStorage.getItem('calendarEnergyData')) || {};
      data.forEach(day => {
        const dateKey = day.shortDate;
        const dailyKWh = (day.totalRadiation * panelConfig.panelCount * area * efficiency) / 1000;
        existingCalendarData[dateKey] = { ...existingCalendarData[dateKey], solarPredicted: parseFloat(dailyKWh.toFixed(2)) };
      });
      localStorage.setItem('calendarEnergyData', JSON.stringify(existingCalendarData));
    }
  }, [data, panelConfig, area, efficiency]);

  const activeDay = useMemo(() => data[selectedIndex] || null, [data, selectedIndex]);
  
  // --- CORRECCIÓN: ORDEN DE CÁLCULO ---
  const total16DayProductionKWh = useMemo(() => data.reduce((sum, day) => sum + (day.totalRadiation * panelConfig.panelCount * area * efficiency) / 1000, 0), [data, panelConfig, area, efficiency]);
  const averageDailyProductionKWh = useMemo(() => (data.length > 0 ? total16DayProductionKWh / data.length : 0), [total16DayProductionKWh, data]);
  
  const chartData = useMemo(() => {
    if (!activeDay) return [];
    return activeDay.hourly
      .filter(hour => hour.value > 0)
      .map(hour => ({ ...hour, generated: Math.round(hour.value * panelConfig.panelCount * area * efficiency) }));
  }, [activeDay, panelConfig, area, efficiency]);

  const groupedHourlyData = useMemo(() => {
    if (!activeDay?.hourly) return [];
    const grouped = [];
    let i = 0;
    while (i < activeDay.hourly.length) {
      const currentHour = activeDay.hourly[i];
      if (currentHour.value <= 1) {
        let j = i;
        while (j + 1 < activeDay.hourly.length && activeDay.hourly[j + 1].value <= 1) { j++; }
        grouped.push({ isGroup: true, id: `group-${i}-${j}`, startHour: activeDay.hourly[i].hour, endHour: activeDay.hourly[j].hour });
        i = j + 1;
      } else {
        const chartDataItem = chartData.find(c => c.hour === currentHour.hour);
        if (chartDataItem) { grouped.push({ ...chartDataItem, isGroup: false }); }
        i++;
      }
    }
    return grouped;
  }, [activeDay, chartData]);

  useEffect(() => {
    if (tabsContainerRef.current) {
      const activeTab = tabsContainerRef.current.children[selectedIndex];
      if (activeTab) activeTab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [selectedIndex]);

  if (loading) return <div className="text-center text-white p-8">Cargando...</div>;
  if (!activeDay) return <div className="text-center text-red-400 p-8">No se pudieron cargar los datos.</div>;
  
  const dailyEstimatedProductionKWh = (activeDay.totalRadiation * panelConfig.panelCount * area * efficiency) / 1000;
  const co2SavingsKg = dailyEstimatedProductionKWh * 0.26;
  const productionDiffPercentage = averageDailyProductionKWh > 0 ? ((dailyEstimatedProductionKWh - averageDailyProductionKWh) / averageDailyProductionKWh) * 100 : 0;
  
  const ProductionDiffIndicator = () => {
    const isPositive = productionDiffPercentage >= 0;
    const isNeutral = Math.abs(productionDiffPercentage) < 1;
    const color = isNeutral ? 'text-slate-400' : isPositive ? 'text-green-400' : 'text-red-400';
    const Icon = isNeutral ? Minus : isPositive ? ArrowUp : ArrowDown;
    return <div className={`flex items-center text-xs sm:text-sm font-semibold ${color}`}><Icon size={16} className="mr-1"/><span>{productionDiffPercentage.toFixed(0)}% vs. media</span></div>;
  };

  const provinceData = REGIONS[location.regionKey]?.provinces[location.provinceKey];
  const activeTilt = panelConfig.tilt !== '' ? panelConfig.tilt : provinceData ? getRecommendedTilt(provinceData.lat) : '-';

  return (
    <div className="w-full max-w-7xl mx-auto font-sans bg-slate-900/70 backdrop-blur-xl p-4 sm:p-6 rounded-2xl shadow-2xl text-white">
      <header className="flex flex-col sm:flex-row justify-between items-center text-center sm:text-left mb-6 p-4 sm:p-6 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl shadow-lg">
        <div className="w-full sm:w-auto">
          <h1 className="text-2xl sm:text-3xl font-bold">
            <LocationSelector selections={location} setSelections={setLocation} />
          </h1>
          <p className="opacity-80 mt-2 text-sm sm:text-base">Pronóstico de producción solar para los próximos 16 días</p>
        </div>
        <div className="mt-4 sm:mt-0 text-center sm:text-right w-full sm:w-auto">
          <div className="text-3xl sm:text-5xl font-bold">{total16DayProductionKWh.toLocaleString('es-ES', { maximumFractionDigits: 0 })}</div>
          <p className="opacity-80 text-sm">kWh de producción total (16 días)</p>
          <p className="font-semibold text-white/90 mt-1 text-sm">{averageDailyProductionKWh.toFixed(2)} kWh prom. diario</p>
        </div>
      </header>
      
      <PanelConfigurator config={panelConfig} setConfig={setPanelConfig} region={location.regionKey} province={location.provinceKey} />

      <div className="relative my-6">
        <div className="flex items-center">
            <button onClick={() => setSelectedIndex(p => p > 0 ? p - 1 : 0)} disabled={selectedIndex === 0} className="p-2 rounded-full bg-slate-700/50 hover:bg-slate-600/50 disabled:opacity-50"><ChevronLeft/></button>
            <div ref={tabsContainerRef} className="flex-grow overflow-x-auto whitespace-nowrap scrollbar-hide mx-2">
                {data.map((day, index) => <button key={day.id} onClick={() => setSelectedIndex(index)} className={`inline-block px-3 sm:px-4 py-2 text-sm font-semibold rounded-full mr-2 transition-all duration-300 capitalize ${selectedIndex === index ? 'bg-orange-500 text-white shadow' : 'bg-slate-700/80 hover:bg-slate-600/80'}`}>{day.shortDate}</button>)}
            </div>
            <button onClick={() => setSelectedIndex(p => p < data.length - 1 ? p + 1 : p)} disabled={selectedIndex === data.length - 1} className="p-2 rounded-full bg-slate-700/50 hover:bg-slate-600/50 disabled:opacity-50"><ChevronRight/></button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <InfoCard icon={<Sunrise size={28} className="text-yellow-400"/>} title="Amanecer" value={activeDay.sunrise} />
        <InfoCard icon={<Sunset size={28} className="text-orange-400"/>} title="Atardecer" value={activeDay.sunset} />
        <InfoCard icon={<Clock size={28} className="text-blue-400"/>} title="Duración del Día" value={activeDay.daylightDuration} />
        <InfoCard icon={<CloudSun size={28} className="text-teal-400"/>} title="Horas de Sol" value={activeDay.sunshineDuration} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <InfoCard icon={<Sun size={28} className="text-red-500"/>} title="Radiación Total (GTI)" value={`${activeDay.totalRadiation.toLocaleString('es-ES')} wh/m²`} />
        <div className="bg-slate-800/50 p-4 rounded-lg flex items-center space-x-4">
            <Sigma size={28} className="text-green-400 flex-shrink-0"/>
            <div className="flex-grow">
                <p className="text-sm text-slate-300">Producción Estimada Total Día</p>
                <div className="flex items-baseline justify-between">
                    <p className="text-xl sm:text-2xl font-bold">{dailyEstimatedProductionKWh.toFixed(2)} kWh</p>
                    <ProductionDiffIndicator />
                </div>
                <div className="flex items-center text-xs text-green-300/80 mt-1 pt-1 border-t border-white/10">
                    <Leaf size={14} className="mr-1.5"/>
                    <span>Ahorro de {co2SavingsKg.toFixed(2)} kg de CO₂</span>
                </div>
            </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 p-4 sm:p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-4 flex items-center"><Sun className="text-orange-400 mr-2" size={24}/> Radiación Inclinada {activeTilt}° (GTI)</h3>
          <div className="w-full h-80"><ResponsiveContainer width="100%" height="100%"><BarChart data={chartData}><CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" /><XAxis dataKey="hour" tick={{ fill: '#a0aec0' }} /><YAxis unit=" w/m²" tick={{ fill: '#a0aec0' }} domain={[0, 'dataMax + 100']} /><Tooltip contentStyle={{ background: 'rgba(30, 41, 59, 0.8)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '8px' }}/><Bar dataKey="value" name="Radiación GTI">{chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.value > 700 ? "#f97316" : entry.value > 400 ? "#fb923c" : "#fdba74"} />)}</Bar></BarChart></ResponsiveContainer></div>
        </div>
        <div className="bg-slate-800/50 p-4 sm:p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-4 flex items-center"><BatteryCharging className="text-green-400 mr-2" size={24}/> Producción Estimada</h3>
          <div className="w-full h-80"><ResponsiveContainer width="100%" height="100%"><BarChart data={chartData}><CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" /><XAxis dataKey="hour" tick={{ fill: '#a0aec0' }} /><YAxis unit=" Wh" tick={{ fill: '#a0aec0' }} domain={[0, 'dataMax + 100']}/><Tooltip contentStyle={{ background: 'rgba(30, 41, 59, 0.8)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '8px' }}/><Bar dataKey="generated" name="Producción">{chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.generated > 7000 ? "#15803d" : entry.generated > 4000 ? "#16a34a" : "#4ade80"} />)}</Bar></BarChart></ResponsiveContainer></div>
        </div>
      </div>
      
      <div className="bg-slate-800/50 p-4 sm:p-6 rounded-lg mt-6">
          <h3 className="text-xl font-bold mb-4">Datos por Hora</h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 sm:gap-4">
              {groupedHourlyData.map(item => (
                item.isGroup ? (
                  <div key={item.id} className="bg-slate-700/50 p-3 rounded-md text-center flex flex-col justify-center items-center min-h-[92px]">
                      <div className="text-xs sm:text-sm font-semibold text-slate-400">{item.startHour} - {item.endHour}</div>
                      <div className="font-bold text-slate-500 mt-2 text-xs">0 <span className="opacity-70">Wh</span></div>
                  </div>
                ) : (
                  <div key={item.hour} className="bg-slate-700/50 p-2 sm:p-3 rounded-md text-center">
                      <div className="text-xs sm:text-sm opacity-80">{item.hour}</div>
                      <div className="font-bold text-orange-400 text-sm sm:text-base">{item.value} <span className="text-xs opacity-60">w/m²</span></div>
                      <div className="font-bold text-green-400 text-sm sm:text-base">{item.generated.toLocaleString()} <span className="text-xs opacity-60">Wh</span></div>
                  </div>
                )
              ))}
          </div>
      </div>
    </div>
  );
}
