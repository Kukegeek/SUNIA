// src/components/EnergyCalendar.jsx

import { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, PlusCircle, Battery, Users, Heart, Zap, ToggleLeft, ToggleRight, Sun, Wind, X } from 'lucide-react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, addMonths, subMonths, isSameMonth, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';

// --- SUB-COMPONENTES AUXILIARES ---

const MonthNavigator = ({ currentDate, setCurrentDate }) => (
    <div className="flex items-center justify-center mb-6 text-white">
        <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="p-2 rounded-full hover:bg-slate-700 transition-colors"><ChevronLeft/></button>
        <h2 className="text-2xl font-bold w-48 text-center capitalize">{format(currentDate, 'MMMM yyyy', { locale: es })}</h2>
        <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="p-2 rounded-full hover:bg-slate-700 transition-colors"><ChevronRight/></button>
    </div>
);

const BatteryModule = ({ title, icon, isActive, onToggle, children }) => (
    <div className={`bg-slate-800/50 p-4 rounded-lg flex flex-col transition-opacity duration-300 ${!isActive ? 'opacity-40' : 'opacity-100'}`}>
        <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-bold text-white flex items-center">{icon}{title}</h3>
            <button onClick={onToggle}>
                {isActive ? <ToggleRight size={32} className="text-green-400"/> : <ToggleLeft size={32} className="text-slate-500"/>}
            </button>
        </div>
        <div className="flex-grow text-sm text-slate-300">
            {children}
        </div>
    </div>
);

const EventModal = ({ day, onClose, onAddEvent }) => {
    const [name, setName] = useState('');
    const [hours, setHours] = useState(1);
    const [extraKWh, setExtraKWh] = useState(5);

    const handleSubmit = (e) => {
        e.preventDefault();
        onAddEvent({
            name: name || "Evento sin nombre",
            hours: parseFloat(hours),
            extraKWh: parseFloat(extraKWh)
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-slate-800 p-6 rounded-lg w-full max-w-md relative shadow-2xl">
                <button onClick={onClose} className="absolute top-3 right-3 text-slate-400 hover:text-white transition-colors"><X/></button>
                <h3 className="text-xl font-bold mb-4">Añadir Evento para el {format(day, 'd MMMM', { locale: es })}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-sm font-medium">Nombre del Evento</label>
                        <input type="text" placeholder="Ej: Cena con amigos" value={name} onChange={e => setName(e.target.value)} required className="w-full mt-1 bg-slate-700 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"/>
                    </div>
                    <div>
                        <label className="text-sm font-medium">Duración (horas)</label>
                        <input type="number" value={hours} onChange={e => setHours(e.target.value)} min="0.5" step="0.5" className="w-full mt-1 bg-slate-700 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"/>
                    </div>
                     <div>
                        <label className="text-sm font-medium">Gasto Extra Estimado (kWh)</label>
                        <input type="number" value={extraKWh} onChange={e => setExtraKWh(e.target.value)} min="0.1" step="0.1" className="w-full mt-1 bg-slate-700 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"/>
                    </div>
                    <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 p-2 rounded-md font-bold transition-colors">Añadir Evento</button>
                </form>
            </div>
        </div>
    );
};

// --- COMPONENTE PRINCIPAL DEL CALENDARIO ---
export default function EnergyCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState({});
  const [monthlyData, setMonthlyData] = useState({});
  const [batteryStates, setBatteryStates] = useState({ bfv: true, bvv: true, bvf: true, bvc: true });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('calendarEnergyData')) || {};
    setMonthlyData(storedData);
    const storedEvents = JSON.parse(localStorage.getItem('calendarEvents')) || {};
    setEvents(storedEvents);
  }, [currentDate]);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  
  // --- CAMBIO AQUÍ: Nombres de días largos y cortos para responsive ---
  const weekdays = {
    long: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
    short: ['L', 'M', 'X', 'J', 'V', 'S', 'D']
  };

  const handleToggle = (batteryKey) => {
      setBatteryStates(prev => ({ ...prev, [batteryKey]: !prev[batteryKey] }));
  };
  
  const handleDayClick = (day) => {
    setSelectedDay(day);
    setIsModalOpen(true);
  };
  
  const handleAddEvent = (eventData) => {
    const dateKey = format(selectedDay, 'yyyy-MM-dd');
    const newEvents = { ...events, [dateKey]: [...(events[dateKey] || []), eventData] };
    setEvents(newEvents);
    localStorage.setItem('calendarEvents', JSON.stringify(newEvents));
  };
  
  const familySharing = { 'José': 95.8, 'Diego': 85.5, 'María': 60.2 };
  const sortedFamily = Object.entries(familySharing);
  
  // --- CAMBIO AQUÍ: Lógica de balance de red con valores fijos ---
  const gridBalance = {
      poured: 101,
      consumed: 34,
      netMonth: 67,
      netAnnual: 784,
  };

  const bfvBlocks = [
    { name: 'Bloque 1', charge: 85, voltage: 53.297 },
    { name: 'Bloque 2', charge: 85, voltage: 53.296 },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto font-sans bg-slate-900/70 backdrop-blur-xl p-4 sm:p-6 rounded-2xl shadow-2xl text-white">
        {isModalOpen && <EventModal day={selectedDay} onClose={() => setIsModalOpen(false)} onAddEvent={handleAddEvent} />}
        <MonthNavigator currentDate={currentDate} setCurrentDate={setCurrentDate} />

        <div className="grid grid-cols-7 gap-1 text-center">
            {weekdays.long.map((day, index) => (
                <div key={day} className="font-bold text-slate-400 pb-2 text-xs sm:text-base">
                    <span className="hidden sm:inline">{day}</span>
                    <span className="sm:hidden">{weekdays.short[index]}</span>
                </div>
            ))}
            {days.map(day => {
                const dateKeyForData = format(day, 'EEE, d MMM', { locale: es }).replace(/.$/, '');
                const dateKeyForEvents = format(day, 'yyyy-MM-dd');
                const dayData = monthlyData[dateKeyForData];
                const dayEvents = events[dateKeyForEvents] || [];
                
                return (
                    <div key={day.toString()} className={`h-36 sm:h-40 p-1 sm:p-2 border rounded-md flex flex-col transition-colors ${!isSameMonth(day, monthStart) ? 'bg-slate-900/50 text-slate-600 border-slate-800' : 'bg-slate-800/50 border-slate-700'} ${isSameDay(day, new Date()) ? '!border-orange-500' : ''}`}>
                        <div className="flex justify-between items-center">
                            <span className="font-bold text-sm sm:text-base">{format(day, 'd')}</span>
                            {isSameMonth(day, monthStart) && <button onClick={() => handleDayClick(day)} className="text-slate-500 hover:text-orange-400"><PlusCircle size={16}/></button>}
                        </div>
                        {isSameMonth(day, monthStart) && (
                            <div className="mt-1 text-[10px] sm:text-xs text-left space-y-1 flex-grow overflow-hidden">
                                {dayData?.solarPredicted > 0 && <p className="flex items-center"><Sun size={12} className="mr-1 text-yellow-400"/> {dayData.solarPredicted.toFixed(0)}<span className="hidden sm:inline"> kWh</span></p>}
                                {dayData?.windPredicted > 0 && <p className="flex items-center"><Wind size={12} className="mr-1 text-blue-400"/> {dayData.windPredicted.toFixed(0)}<span className="hidden sm:inline"> kWh</span></p>}
                                {dayData?.consumptionPredicted > 0 && <p className="flex items-center text-red-400"><Zap size={12} className="mr-1"/> {dayData.consumptionPredicted.toFixed(0)}<span className="hidden sm:inline"> kWh</span></p>}
                                
                                <div className="text-[9px] sm:text-[10px] space-y-0.5 overflow-y-auto max-h-16">
                                  {dayEvents.map((evt, i) => <p key={i} className="truncate" title={`${evt.name} (${evt.hours}h, ${evt.extraKWh}kWh)`}>⚡ {evt.name}</p>)}
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            <BatteryModule title="Batería Física Vecinal" icon={<Battery size={20} className="mr-2 text-green-400"/>} isActive={batteryStates.bfv} onToggle={() => handleToggle('bfv')}>
              <div className="flex justify-between items-baseline mb-1">
                <p>Capacidad Total: <span className="font-bold">240 kWh</span></p>
                <p className="text-lg font-bold">85%</p>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2.5">
                  <div className="bg-green-500 h-2.5 rounded-full" style={{width: '85%'}}></div>
              </div>
              <p className="text-xs text-slate-400 mt-3 mb-2">Módulos: 2 bloques de 4 baterías (48V, 30kWh)</p>
              <div className="grid grid-cols-2 gap-x-4">
                  {bfvBlocks.map((block, index) => (
                      <div key={index}>
                          <div className="flex justify-between items-center text-xs text-slate-300">
                              <span>{block.name}</span>
                              <span className="font-semibold">{block.charge}%</span>
                          </div>
                          <div className="w-full bg-slate-700 rounded-full h-1.5 mt-0.5">
                              <div className="bg-green-400 h-1.5 rounded-full" style={{width: `${block.charge}%`}}></div>
                          </div>
                          <p className="text-xs text-right font-mono text-slate-400">{block.voltage.toFixed(3)}V</p>
                      </div>
                  ))}
              </div>
            </BatteryModule>

            <BatteryModule title="Batería Virtual Vecinal" icon={<Users size={20} className="mr-2 text-teal-400"/>} isActive={batteryStates.bvv} onToggle={() => handleToggle('bvv')}>
                <p>Balance con vecinos:</p>
                <p className="text-2xl font-bold text-teal-400">+12.5 kWh</p>
                <p className="text-xs">Energía compartida hoy.</p>
            </BatteryModule>

            <BatteryModule title="Batería Virtual Familia" icon={<Heart size={20} className="mr-2 text-pink-400"/>} isActive={batteryStates.bvf} onToggle={() => handleToggle('bvf')}>
                <p>Compartido (límite 100 kWh):</p>
                <div className="space-y-2 mt-1">
                    {sortedFamily.map(([name, kwh]) => (
                        <div key={name}><span className="font-semibold">{name}</span> ({kwh.toFixed(1)} kWh)<div className="w-full bg-slate-700 rounded-full h-1.5"><div className="bg-pink-500 h-1.5 rounded-full" style={{width: `${(kwh/100)*100}%`}}></div></div></div>
                    ))}
                </div>
            </BatteryModule>

            <BatteryModule title="Batería Virtual Comercializadora" icon={<Zap size={20} className="mr-2 text-yellow-400"/>} isActive={batteryStates.bvc} onToggle={() => handleToggle('bvc')}>
              <p>Vertido a red (mes): <span className="font-bold text-green-400">{gridBalance.poured.toFixed(1)} kWh</span></p>
              <p>Consumido de red (mes): <span className="font-bold text-red-400">{gridBalance.consumed.toFixed(1)} kWh</span></p>
              <div className="mt-2 pt-2 border-t border-slate-700 space-y-1">
                  <div className="flex justify-between items-baseline">
                      <p className="text-sm">Balance Neto Mensual:</p>
                      <p className={`font-bold ${gridBalance.netMonth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {gridBalance.netMonth >= 0 ? '+' : ''}{gridBalance.netMonth.toFixed(1)} kWh
                      </p>
                  </div>
                  <div className="flex justify-between items-baseline">
                      <p className="text-sm">Balance Neto Anual (Est.):</p>
                      <p className={`font-bold ${gridBalance.netAnnual >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {gridBalance.netAnnual >= 0 ? '+' : ''}{gridBalance.netAnnual.toFixed(0)} kWh
                      </p>
                  </div>
              </div>
            </BatteryModule>
        </div>
    </div>
  );
}
