// src/components/UserProfile.jsx

import { useState, useMemo, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { User, Users, Map, Globe, Calendar, BarChart2, BarChartBig } from 'lucide-react';
import { format, getDaysInMonth, startOfYear } from 'date-fns';
import { es } from 'date-fns/locale';

// --- FUNCIONES DE PARSEO Y CÁLCULO (VIVEN AQUÍ AHORA) ---

function parseConsumptionCoefficients(csvText) {
  if (!csvText) return {};
  const lines = csvText.trim().split('\n').slice(1);
  const coefficients = {};
  lines.forEach(line => {
    const [month, day, hour, coeffStr] = line.trim().split(';');
    if (!month || !day || !coeffStr) return;
    const key = `${parseInt(month, 10)}-${parseInt(day, 10)}`;
    const coefficient = parseFloat(coeffStr.replace(',', '.'));
    if (!coefficients[key]) {
      coefficients[key] = [];
    }
    coefficients[key][parseInt(hour, 10) - 1] = coefficient;
  });
  return coefficients;
}

function calculateConsumptionData(coefficients, annualConsumptionKWh) {
  const data = { hourlyData: {}, dailyTotals: {}, monthlyTotals: [], annualTotal: 0 };
  if (!coefficients || Object.keys(coefficients).length === 0) return data;

  data.annualTotal = annualConsumptionKWh;
  const monthlySums = Array(12).fill(0);
  
  Object.keys(coefficients).forEach(dayKey => {
    const hourlyCoeffs = coefficients[dayKey];
    if (!hourlyCoeffs) return;
    const [month, day] = dayKey.split('-').map(Number);
    const dailyTotalKWh = hourlyCoeffs.reduce((sum, coeff) => sum + (coeff * annualConsumptionKWh), 0);
    
    data.dailyTotals[dayKey] = parseFloat(dailyTotalKWh.toFixed(2));
    monthlySums[month - 1] += dailyTotalKWh;
    data.hourlyData[dayKey] = hourlyCoeffs.map(coeff => parseFloat((coeff * annualConsumptionKWh).toFixed(3)));
  });
  
  data.monthlyTotals = monthlySums.map(t => parseFloat(t.toFixed(2)));
  return data;
}

// --- SUB-COMPONENTES AUXILIARES ---

const ConfigItem = ({ label, name, value, onChange, type, options = [] }) => (
    <div>
        <label className="block text-sm font-medium text-slate-300">{label}</label>
        {type === 'select' ? (
             <select name={name} value={value} onChange={onChange} className="mt-1 w-full bg-slate-700/50 p-2 rounded-md border-2 border-transparent focus:border-orange-500 focus:outline-none">
                 {options.map(opt => <option key={opt} value={opt} className="text-black">{opt}</option>)}
             </select>
        ) : (
            <input type={type} name={name} value={value} onChange={onChange} className="mt-1 w-full bg-slate-700/50 p-2 rounded-md border-2 border-transparent focus:border-orange-500 focus:outline-none" />
        )}
    </div>
);

const RankPreviewCard = ({ title, icon, rank, total }) => (
    <div className="bg-slate-800/50 p-3 rounded-lg text-center">
        <div className="flex items-center justify-center gap-2 text-slate-300">{title}{icon}</div>
        <p className="text-xl font-bold">#{rank}<span className="text-sm font-normal text-slate-400">/{total.toLocaleString('es-ES')}</span></p>
    </div>
);

const ViewButton = ({ icon, label, isActive, onClick }) => (
    <button onClick={onClick} className={`flex items-center gap-2 px-3 py-1 rounded-md text-sm font-semibold transition-colors ${isActive ? 'bg-orange-500 text-white' : 'hover:bg-slate-600'}`}>
        {icon}{label}
    </button>
);


// --- COMPONENTE PRINCIPAL ---
export default function UserProfile({ csvData }) {
  const [config, setConfig] = useState({
      annualConsumption: 6450, // Este es el consumo BASE
      householdMembers: 3,
      energyRating: 'A',
  });
  const [view, setView] = useState('annual');
  const [selectedDate, setSelectedDate] = useState(new Date());

  // --- NUEVA LÓGICA DE CÁLCULO DINÁMICO ---
  const consumptionData = useMemo(() => {
    const coefficients = parseConsumptionCoefficients(csvData);

    let baseConsumption = parseFloat(config.annualConsumption) || 0;
    
    // 1. Ajuste por número de personas
    const members = parseInt(config.householdMembers, 10);
    if (members === 1) {
      baseConsumption *= 0.88; // Reduce un 12%
    } else if (members === 2) {
      baseConsumption *= 0.94; // Reduce un 6%
    } else if (members === 4) {
      baseConsumption *= 1.04; // Aumenta un 4%
    } else if (members > 4) {
      const extraMembers = members - 4;
      baseConsumption *= (1.04 + (extraMembers * 0.02));
    }
    // Para 3 personas, no se hace nada.

    // 2. Ajuste por clasificación energética
    const ratingModifiers = { A: 1.0, B: 1.05, C: 1.10, D: 1.14, E: 1.19, F: 1.26, G: 1.31 };
    const modifier = ratingModifiers[config.energyRating] || 1.0;
    
    const adjustedAnnualConsumption = baseConsumption * modifier;
    
    return calculateConsumptionData(coefficients, adjustedAnnualConsumption);
  }, [csvData, config.annualConsumption, config.householdMembers, config.energyRating]);
  
  useEffect(() => {
    if (consumptionData.dailyTotals) {
        console.log("Guardando datos de CONSUMO en localStorage...");
        const existingCalendarData = JSON.parse(localStorage.getItem('calendarEnergyData')) || {};
        const yearStart = startOfYear(new Date(2025, 0, 1));

        Object.keys(consumptionData.dailyTotals).forEach(dayKey => {
            const [month, day] = dayKey.split('-').map(Number);
            const date = new Date(2025, month - 1, day);
            const dateStorageKey = format(date, 'EEE, d MMM', { locale: es }).replace(/.$/, '');

            existingCalendarData[dateStorageKey] = {
                ...existingCalendarData[dateStorageKey],
                consumptionPredicted: consumptionData.dailyTotals[dayKey],
            };
        });
        localStorage.setItem('calendarEnergyData', JSON.stringify(existingCalendarData));
    }
  }, [consumptionData]);
  
  const handleConfigChange = (e) => {
    const { name, value } = e.target;
    setConfig(prev => ({...prev, [name]: value }));
  };

  const chartData = useMemo(() => {
    if (!consumptionData) return [];
    switch(view) {
        case 'monthly':
            const month = selectedDate.getMonth();
            const daysInMonth = getDaysInMonth(selectedDate);
            return Array.from({ length: daysInMonth }, (_, i) => ({
                name: `${i + 1}`,
                Consumo: consumptionData.dailyTotals[`${month + 1}-${i + 1}`] || 0,
            }));
        case 'daily':
            const dayKey = `${selectedDate.getMonth() + 1}-${selectedDate.getDate()}`;
            return consumptionData.hourlyData[dayKey]?.map((val, i) => ({
                name: `${String(i).padStart(2,'0')}:00`,
                Consumo: val,
            })) || [];
        case 'annual':
        default:
            return consumptionData.monthlyTotals.map((total, index) => ({
                name: format(new Date(2025, index, 1), 'MMM', { locale: es }),
                Consumo: total,
            }));
    }
  }, [view, selectedDate, consumptionData]);

  const currentTotal = useMemo(() => {
    if (!consumptionData.monthlyTotals) return 0;
      switch(view) {
          case 'annual': return consumptionData.annualTotal;
          case 'monthly': return consumptionData.monthlyTotals[selectedDate.getMonth()];
          case 'daily': return consumptionData.dailyTotals[`${selectedDate.getMonth() + 1}-${selectedDate.getDate()}`];
          default: return 0;
      }
  }, [view, selectedDate, consumptionData]);

  if (!consumptionData) {
      return <div className="text-center text-red-400 p-8">Error al procesar los datos de consumo.</div>;
  }

  return (
    <div className="w-full max-w-7xl mx-auto font-sans text-white space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-slate-800/50 p-6 rounded-lg">
                <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center">
                        <User size={40}/>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">Murcia Green</h1>
                        <p className="text-slate-300">¡Bienvenido a tu centro de control energético!</p>
                    </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-700 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <ConfigItem label="Consumo Anual Base (kWh)" name="annualConsumption" value={config.annualConsumption} onChange={handleConfigChange} type="number"/>
                    <ConfigItem label="Personas en Vivienda" name="householdMembers" value={config.householdMembers} onChange={handleConfigChange} type="number"/>
                    <ConfigItem label="Clasif. Energética" name="energyRating" value={config.energyRating} onChange={handleConfigChange} type="select" options={['A', 'B', 'C', 'D', 'E', 'F', 'G']}/>
                </div>
                <p className="text-xs text-slate-400 mt-3">💡 ¡Bienvenido! SUNIA creará un estudio más exacto con tus hábitos. SUNIA ha aplicado tu perfil inicial a un perfil tipo de REE.</p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-lg flex flex-col justify-center">
                <h3 className="text-lg font-bold text-center mb-3">Resumen de Rankings</h3>
                <div className="grid grid-cols-3 gap-2">
                    <RankPreviewCard title="Vecinos" icon={<Users size={16}/>} rank={1} total={56}/>
                    <RankPreviewCard title="Ciudad" icon={<Map size={16}/>} rank={3} total={3264}/>
                    <RankPreviewCard title="País" icon={<Globe size={16}/>} rank={46} total={97568}/>
                </div>
            </div>
        </div>

        <div className="bg-slate-800/50 p-6 rounded-lg">
            <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
                <div>
                    <h2 className="text-2xl font-bold">Predicción de Consumo {view === 'annual' ? 'Anual (Ajustado)' : view === 'monthly' ? 'Mensual (Ajustado)' : 'Diario (Ajustado)'}</h2>
                    <p className="text-slate-300">Total Estimado: <span className="font-bold text-orange-400">{currentTotal?.toLocaleString('es-ES', {maximumFractionDigits: 0})} kWh</span></p>
                </div>
                <div className="flex items-center gap-2 bg-slate-700/50 p-1 rounded-lg">
                    <ViewButton icon={<Calendar size={16}/>} label="Anual" isActive={view === 'annual'} onClick={() => setView('annual')} />
                    <ViewButton icon={<BarChartBig size={16}/>} label="Mensual" isActive={view === 'monthly'} onClick={() => setView('monthly')} />
                    <ViewButton icon={<BarChart2 size={16}/>} label="Diario" isActive={view === 'daily'} onClick={() => setView('daily')} />
                </div>
            </div>

            {(view === 'monthly' || view === 'daily') && (
                <div className="flex items-center gap-4 mb-4">
                    <select value={selectedDate.getMonth()} onChange={e => setSelectedDate(new Date(selectedDate.getFullYear(), parseInt(e.target.value), 1))} className="bg-slate-700 p-2 rounded-md">
                        {Array.from({length: 12}).map((_, i) => <option key={i} value={i} className="text-black">{format(new Date(2025, i), 'MMMM', {locale: es})}</option>)}
                    </select>
                    {view === 'daily' && (
                        <select value={selectedDate.getDate()} onChange={e => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), parseInt(e.target.value)))} className="bg-slate-700 p-2 rounded-md">
                            {Array.from({length: getDaysInMonth(selectedDate)}).map((_, i) => <option key={i+1} value={i+1}>{i+1}</option>)}
                        </select>
                    )}
                </div>
            )}
            
            <div className="w-full h-96">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                        <XAxis dataKey="name" tick={{ fill: '#a0aec0' }} />
                        <YAxis unit=" kWh" tickFormatter={(value) => value ? value.toFixed(1) : '0'} tick={{ fill: '#a0aec0' }} />
                        <Tooltip
                            cursor={{ fill: 'rgba(251, 146, 60, 0.1)' }}
                            contentStyle={{ background: 'rgba(30, 41, 59, 0.8)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '8px' }}
                            labelStyle={{ fontWeight: 'bold' }}
                            formatter={(value) => [`${value ? value.toFixed(2) : '0.00'} kWh`, 'Consumo']}
                        />
                        <Bar dataKey="Consumo" fill="#fb923c" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    </div>
  );
}