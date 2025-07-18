// src/components/HomeDashboard.jsx

import { useState } from 'react';
import { Sun, Wind, Calendar, Users, Trophy, User, Lightbulb, ArrowRight } from 'lucide-react';

// --- SUB-COMPONENTE AUXILIAR PARA LOS WIDGETS ---
const WidgetCard = ({ href, icon, title, description, children }) => (
    <a href={href} className="widget-card group bg-slate-800/50 p-6 rounded-lg flex flex-col justify-between transition-all duration-300 hover:bg-slate-800 hover:shadow-2xl hover:-translate-y-1">
        <div>
            <div className="flex items-center gap-3 mb-3">
                <div className="bg-slate-700/50 p-2 rounded-md">
                    {icon}
                </div>
                <h3 className="text-xl font-bold text-white">{title}</h3>
            </div>
            <p className="text-sm text-slate-300 mb-4">{description}</p>
        </div>
        <div className="flex-grow flex flex-col justify-center">
            {children}
        </div>
        <div className="mt-4 text-right text-sm font-semibold text-orange-400 flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Ver más <ArrowRight size={16} />
        </div>
    </a>
);

// --- COMPONENTE PRINCIPAL ---
export default function HomeDashboard() {
  return (
    <div className="w-full max-w-7xl mx-auto font-sans text-white">
        {/* --- SECCIÓN DE BIENVENIDA --- */}
        <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-2">Bienvenido a tu Ecosistema Energético</h1>
            <p className="text-lg text-slate-300">Monitoriza, gestiona y compite. Todo tu autoconsumo en un solo lugar.</p>
        </div>

        {/* --- REJILLA DE WIDGETS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Widget: Producción Solar */}
            <WidgetCard 
                href="/radiacion" 
                icon={<Sun size={24} className="text-yellow-400"/>} 
                title="Producción Solar" 
                description="Pronóstico de la energía que generarán tus paneles."
            >
                <div className="text-center">
                    <p className="text-5xl font-bold text-yellow-400">32.9<span className="text-3xl"> kWh</span></p>
                    <p className="text-slate-400">Estimación para hoy</p>
                </div>
            </WidgetCard>

            {/* Widget: Producción Eólica */}
            <WidgetCard 
                href="/prediccion-eolica" 
                icon={<Wind size={24} className="text-blue-400"/>} 
                title="Producción Eólica"
                description="Predicción de la energía generada por tus aerogeneradores."
            >
                <div className="text-center">
                    <p className="text-5xl font-bold text-blue-400">15.7<span className="text-3xl"> kWh</span></p>
                    <p className="text-slate-400">Estimación para hoy</p>
                </div>
            </WidgetCard>

            {/* Widget: Calendario Energético */}
            <WidgetCard 
                href="/calendario-energia" 
                icon={<Calendar size={24} className="text-green-400"/>} 
                title="Calendario Energético"
                description="Planifica tu consumo y gestiona tus baterías y eventos."
            >
                <div className="text-sm space-y-2">
                    <p className="bg-slate-700/50 p-2 rounded-md">⚡ Evento: Cena con amigos (20:00)</p>
                    <p className="bg-slate-700/50 p-2 rounded-md">🔋 Batería Física Vecinal (BFV): 85%</p>
                </div>
            </WidgetCard>
            
            {/* Widget: Perfil de Usuario */}
            <WidgetCard 
                href="/perfil" 
                icon={<User size={24} className="text-orange-400"/>} 
                title="Mi Perfil y Consumo"
                description="Ajusta tu consumo anual y consulta tus predicciones."
            >
                <div className="text-center">
                    <p className="text-slate-400">Consumo anual estimado</p>
                    <p className="text-4xl font-bold">6450<span className="text-2xl"> kWh</span></p>
                </div>
            </WidgetCard>

            {/* Widget: Rankings */}
            <WidgetCard 
                href="/rankings" 
                icon={<Trophy size={24} className="text-amber-400"/>} 
                title="Logros y Rankings"
                description="Compite con otros y consigue medallas por tus logros."
            >
                <div className="text-sm space-y-2 text-center">
                    <p>Posición Vecinos: <span className="font-bold text-lg">#1</span></p>
                    <p>Posición Ciudad: <span className="font-bold text-lg">#3</span></p>
                    <p>Total Salaris: <span className="font-bold text-lg text-yellow-400">8,250</span></p>
                </div>
            </WidgetCard>

            {/* Widget: SUNIA */}
            <WidgetCard 
                href="/sunia" 
                icon={<Lightbulb size={24} className="text-teal-400"/>} 
                title="Panel de SUNIA"
                description=""Controla tus dispositivos y consulta las acciones de SunIA.""
            >
                 <div className="text-sm space-y-2">
                    <p className="bg-yellow-500/10 text-yellow-300 p-2 rounded-md font-semibold">Alerta: Tormenta de arena</p>
                    <p className="bg-slate-700/50 p-2 rounded-md">Acción: Programada cierre persianas y Carga vehículo</p>
                  </div>
            </WidgetCard>

        </div>
    </div>
  );
}
