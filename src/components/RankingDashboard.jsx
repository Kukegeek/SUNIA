// src/components/RankingDashboard.jsx

import { useState } from 'react';
import { Sun, Zap, TrendingUp, Users, Map, Globe, ChevronsUp, ChevronsDown, Minus, Trophy, Star, Award, Ticket, Building, Wind, TreeDeciduous, Medal } from 'lucide-react';

// --- ICONOS PERSONALIZADOS ---
const SalarisIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <circle cx="12" cy="12" r="10" />
        <g transform="translate(12, 12) scale(0.8)">
            <circle r="3.5" fill="none" stroke="black" strokeWidth="1.5" />
            <path d="M12 2v2m0 14v2m-7.07-7.07-1.41-1.41M19.07 4.93l-1.41 1.41m0 12.73 1.41 1.41M4.93 19.07l1.41-1.41M2 12h2m16 0h-2" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
        </g>
    </svg>
);

const UserAvatar = ({ className }) => (
    <div className={`relative rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 p-1 ${className}`}>
        <div className="bg-slate-800 rounded-full p-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <path d="M4 22h16" /> <path d="M6 18v-7" /> <path d="M18 18v-7" /> <path d="M14 18v-4" /> <path d="M10 18v-4" /> <path d="M12 4v7" /> <path d="M10 4h4" />
            </svg>
        </div>
    </div>
);


// --- DATOS SIMULADOS ---
const userData = {
    name: "Green Murcia",
    salaris: 8250,
    levelName: "Mister Electrón",
    levelMaxSalaris: 10000,
    nextLevelReward: "Plantación de un árbol",
    medals: [
        { name: "Cero Emisiones", desc: "Balance neto positivo" },
        { name: "Cazador de Electrones", desc: "Reducción consumo fantasma" },
        { name: "Doctor Solar", desc: "Mantenimiento impecable" }
    ],
    solarProduction: 1274,
    gridExport: 498,
    gridImport: 404,
    rankings: {
        vecinos: { rank: 1, total: 56, change: 3 },
        ciudad: { rank: 3, total: 3264, change: 156 },
        pais: { rank: 46, total: 97568, change: 2847 },
    }
};

const xpRates = { solar: 5, gridExport: 20, gridImport: -20 };

const vecinosRanking = [
    { rank: 1, name: "Green Murcia", salaris: 8250, change: 1 },
    { rank: 2, name: "Ana García", salaris: 7890, change: -1 },
    { rank: 3, name: "Rosa María", salaris: 7470, change: 1 },
    { rank: 4, name: "Luis Rodríguez", salaris: 7420, change: 0 },
    { rank: 5, name: "María López", salaris: 7200, change: 2 },
    { rank: 6, name: "Pedro Sánchez", salaris: 6980, change: -1 },
    { rank: 7, name: "Laura Fernández", salaris: 6750, change: 3 },
    { rank: 8, name: "Casa Verde", salaris: 6500, change: 0 },
    { rank: 9, name: "Carmen Ruiz", salaris: 6250, change: -2 },
    { rank: 10, name: "David Moreno", salaris: 6000, change: 1 },
   
];

const ciudadRanking = [
    { rank: 1, name: "AeroPOWER", salaris: 15420, change: 1 },
    { rank: 2, name: "Casa Verde", salaris: 12890, change: -1 },
    { rank: 3, name: "Green Murcia", salaris: 8250, change: 0 },
    { rank: 4, name: "EcoHome", salaris: 8190, change: 2 },
    { rank: 5, name: "GreenPower", salaris: 8120, change: -1 },
    { rank: 6, name: "SunHouse", salaris: 7950, change: 3 },
    { rank: 7, name: "CleanEnergy", salaris: 7920, change: 0 },
    { rank: 8, name: "Ana García", salaris: 7890, change: -2 },
    { rank: 9, name: "SolarMax", salaris: 7750, change: 1 },
    { rank: 10, name: "GreenLife", salaris: 7690, change: 0 },
];

const paisRanking = [
    { rank: 1, name: "Alejandro Jiménez", salaris: 45890, change: 0 },
    { rank: 2, name: "Isabel Herrera", salaris: 42350, change: 1 },
    { rank: 3, name: "Roberto Castillo", salaris: 38920, change: -1 },
    { rank: 4, name: "Elena Vargas", salaris: 35680, change: 2 },
    { rank: 5, name: "Francisco Ramos", salaris: 32450, change: -1 },
    { rank: 6, name: "Cristina Mendoza", salaris: 29870, change: 3 },
    { rank: 7, name: "Antonio Guerrero", salaris: 27140, change: 0 },
    { rank: 8, name: "Beatriz Romero", salaris: 24890, change: -2 },
    { rank: 9, name: "Javier Delgado", salaris: 22450, change: 1 },
    { rank: 46, name: "Green Murcia", salaris: 8250, change: 2 },
];


// --- SUB-COMPONENTES ---

const RankChangeIndicator = ({ change }) => {
    if (change === 0) return <span className="flex items-center text-slate-400 w-8 justify-end"><Minus size={14} />{change}</span>;
    const isPositive = change > 0;
    const Icon = isPositive ? ChevronsUp : ChevronsDown;
    const color = isPositive ? 'text-green-400' : 'text-red-400';
    return <span className={`flex items-center font-bold ${color} w-8 justify-end`}><Icon size={14} className="mr-0.5" />{isPositive ? `+${change}` : change}</span>;
};

const PodiumPrize = ({ rank, category }) => {
    const prizes = {
        vecinos: { 1: <><Ticket size={14} className="mr-1"/> 250€ Cultura</>, 2: <><Ticket size={14} className="mr-1"/> 125€ Cultura</>, 3: <><Ticket size={14} className="mr-1"/> 50€ Cultura</>, },
        ciudad: { 1: <><Building size={14} className="mr-1"/> -100% IBI</>, 2: <><Building size={14} className="mr-1"/> -50% IBI</>, 3: <><Building size={14} className="mr-1"/> -25% IBI</>, },
        pais: { 1: <><Wind size={14} className="mr-1"/> Aerogenerador 50kWh</>, 2: <><Wind size={14} className="mr-1"/> Aerogenerador 25kWh</>, 3: <><Wind size={14} className="mr-1"/> Aerogenerador 10kWh</>, }
    };
    return <p className="text-xs font-semibold flex items-center justify-center text-slate-300 mt-1 px-1">{prizes[category][rank]}</p>;
};

const RankingCard = ({ title, icon, userRanking, rankingData, userName, category }) => {
    const topPlayer = rankingData.find(p => p.rank === 1) || { salaris: 0 };
    const userPlayer = rankingData.find(p => p.name === userName);
    const distanceToFirst = userPlayer ? topPlayer.salaris - userPlayer.salaris : 0;
    const progressToFirst = userPlayer && topPlayer.salaris > 0 ? (userPlayer.salaris / topPlayer.salaris) * 100 : 0;
    const podium = rankingData.slice(0, 3);
    const list = rankingData.slice(3);

    return (
        <div className="bg-slate-800/50 p-4 rounded-lg flex flex-col">
            <h3 className="text-xl font-bold mb-4 flex items-center justify-center">{icon}{title}</h3>
            <div className="bg-slate-900/50 p-3 rounded-md mb-4">
                <div className="flex justify-between items-center text-sm">
                    <span>Tu posición: <span className="font-bold text-lg">#{userRanking.rank}</span> de {userRanking.total.toLocaleString('es-ES')}</span>
                    <span className="text-slate-400">(+{userRanking.change.toLocaleString('es-ES')} participantes)</span>
                </div>
                <div className="mt-2 text-xs text-slate-400">
                    <div className="flex justify-between items-center mb-1"><span>Progreso hacia el 1º</span><span>Distancia al 1º: {distanceToFirst.toLocaleString('es-ES')} <SalarisIcon className="inline-block w-3 h-3 text-yellow-400"/></span></div>
                    <div className="w-full bg-slate-700 rounded-full h-2.5"><div className="bg-blue-500 h-2.5 rounded-full" style={{width: `${progressToFirst}%`}}></div></div>
                </div>
            </div>
            
            <div className="flex justify-center items-end gap-2 mb-4">
                {podium[1] && <div className="text-center"><p className={`font-bold text-xs truncate w-24 ${podium[1].name === userName ? 'text-yellow-400' : ''}`}>{podium[1].name}</p><div className={`h-24 w-24 bg-slate-700 rounded-t-lg flex flex-col justify-end items-center p-1 border-b-4 border-slate-400 ${podium[1].name === userName ? 'ring-2 ring-yellow-400' : ''}`}><Trophy size={20} className="text-slate-300"/><p className="text-lg font-bold">2º</p><PodiumPrize rank={2} category={category} /></div></div>}
                {podium[0] && <div className="text-center"><p className={`font-bold text-xs truncate w-24 ${podium[0].name === userName ? 'text-yellow-400' : ''}`}>{podium[0].name}</p><div className={`h-32 w-24 bg-slate-700 rounded-t-lg flex flex-col justify-end items-center p-1 border-b-4 border-yellow-400 ${podium[0].name === userName ? 'ring-2 ring-yellow-400' : ''}`}><Trophy size={24} className="text-yellow-400"/><p className="text-xl font-bold">1º</p><PodiumPrize rank={1} category={category} /></div></div>}
                {podium[2] && <div className="text-center"><p className={`font-bold text-xs truncate w-24 ${podium[2].name === userName ? 'text-yellow-400' : ''}`}>{podium[2].name}</p><div className={`h-20 w-24 bg-slate-700 rounded-t-lg flex flex-col justify-end items-center p-1 border-b-4 border-amber-600 ${podium[2].name === userName ? 'ring-2 ring-yellow-400' : ''}`}><Trophy size={18} className="text-amber-500"/><p className="text-base font-bold">3º</p><PodiumPrize rank={3} category={category} /></div></div>}
            </div>

            <ul className="space-y-2 flex-grow">
                {list.slice(0, 7).map(item => <li key={item.rank} className={`flex justify-between items-center p-2 rounded-md text-sm ${item.name === userName ? 'bg-yellow-500/20 border border-yellow-500/50' : 'bg-slate-900/50'}`}><div className="flex items-center"><span className="font-bold w-8">#{item.rank}</span><span>{item.name}</span></div><div className="flex items-center gap-x-4"><span className="font-bold flex items-center gap-1">{item.salaris.toLocaleString('es-ES')} <SalarisIcon className="w-4 h-4 text-yellow-400"/></span><RankChangeIndicator change={item.change} /></div></li>)}
            </ul>
        </div>
    );
};


// --- COMPONENTE PRINCIPAL ---
export default function RankingDashboard() {
  const solarSalaris = userData.solarProduction * xpRates.solar;
  const exportSalaris = userData.gridExport * xpRates.gridExport;
  const importSalaris = userData.gridImport * xpRates.gridImport;
  const totalSalaris = solarSalaris + exportSalaris + importSalaris;
  const progressToNextLevel = (userData.salaris / userData.levelMaxSalaris) * 100;

  return (
    <div className="w-full max-w-7xl mx-auto font-sans text-white">
        <div className="flex flex-wrap justify-between items-start mb-8 gap-6">
            <div className="text-center flex-grow">
                <h1 className="text-4xl font-bold flex items-center justify-center gap-3"><Trophy/>Logros y Rankings</h1>
                <p className="text-slate-300 mt-1">Competencia de autoconsumo energético - 2025</p>
            </div>
            
            <div className="bg-slate-800/50 p-4 rounded-lg w-full max-w-md mx-auto sm:mx-0 sm:flex-shrink-0">
                <div className="flex items-center gap-4">
                    <UserAvatar className="w-16 h-16"/>
                    <div>
                        <h2 className="text-xl font-bold">{userData.name}</h2>
                        <p className="text-sm text-yellow-400 font-semibold">{userData.levelName}</p>
                        <p className="font-bold flex items-center gap-1">{userData.salaris.toLocaleString('es-ES')} <SalarisIcon className="w-4 h-4 text-yellow-400"/></p>
                    </div>
                </div>
                <div className="mt-3 text-xs">
                    <div className="flex justify-between items-center mb-1 text-slate-300">
                        <span>Progreso de Nivel</span>
                        <span className="flex items-center gap-1"><TreeDeciduous size={14}/> {userData.nextLevelReward}</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2.5">
                        <div className="bg-yellow-500 h-2.5 rounded-full" style={{width: `${progressToNextLevel}%`}}></div>
                    </div>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-700 flex justify-between items-start">
                    <h4 className="font-bold text-sm mt-1">Medallas</h4>
                    <div className="flex items-start gap-2 text-center">
                        {userData.medals.map(medal => (
                             <div key={medal.name} className="flex flex-col items-center">
                                <div className="flex items-center justify-center w-10 h-10 bg-slate-700/50 rounded-full mb-1">
                                    <Medal size={20} className="text-amber-400"/>
                                </div>
                                <p className="text-xs font-semibold leading-tight">{medal.name}</p>
                                <p className="text-[10px] text-slate-400 leading-tight">{medal.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-500/30 to-teal-500/30 p-6 rounded-2xl shadow-lg backdrop-blur-sm mb-8">
            <h2 className="text-2xl font-bold flex items-center gap-2 mb-4"><Star/>Sistema de Puntos <span className="flex items-center gap-1">SOLARIS <SalarisIcon className="w-5 h-5 text-yellow-400"/></span></h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                 <div className="bg-slate-800/50 p-4 rounded-lg text-center"><p className="text-sm font-semibold flex items-center justify-center gap-1"><Sun size={16} className="text-yellow-400"/>Producción Solar</p><p className="text-xs text-slate-400">+{xpRates.solar} <SalarisIcon className="inline-block w-3 h-3"/> por kWh</p><p className="text-2xl font-bold mt-1">{userData.solarProduction.toLocaleString('es-ES')} kWh</p><p className="font-semibold text-green-400 flex items-center justify-center gap-1">+{solarSalaris.toLocaleString('es-ES')} <SalarisIcon className="w-4 h-4"/></p></div>
                <div className="bg-slate-800/50 p-4 rounded-lg text-center"><p className="text-sm font-semibold flex items-center justify-center gap-1"><TrendingUp size={16} className="text-green-400"/>Vertido a Red</p><p className="text-xs text-slate-400">+{xpRates.gridExport} <SalarisIcon className="inline-block w-3 h-3"/> por kWh</p><p className="text-2xl font-bold mt-1">{userData.gridExport.toLocaleString('es-ES')} kWh</p><p className="font-semibold text-green-400 flex items-center justify-center gap-1">+{exportSalaris.toLocaleString('es-ES')} <SalarisIcon className="w-4 h-4"/></p></div>
                <div className="bg-slate-800/50 p-4 rounded-lg text-center"><p className="text-sm font-semibold flex items-center justify-center gap-1"><Zap size={16} className="text-red-400"/>Consumo de Red</p><p className="text-xs text-slate-400">{xpRates.gridImport} <SalarisIcon className="inline-block w-3 h-3"/> por kWh</p><p className="text-2xl font-bold mt-1">{userData.gridImport.toLocaleString('es-ES')} kWh</p><p className="font-semibold text-red-400 flex items-center justify-center gap-1">{importSalaris.toLocaleString('es-ES')} <SalarisIcon className="w-4 h-4"/></p></div>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-lg text-center">
                <h3 className="text-lg font-bold">Balance Neto Energético</h3>
                <p className="text-slate-300">Vertido: {userData.gridExport} kWh - Consumo: {userData.gridImport} kWh = <span className="font-bold text-white">+{userData.gridExport - userData.gridImport} kWh</span></p>
                <p className="text-green-300 mt-1">¡Enhorabuena! Tienes un balance energético positivo.</p>
                <hr className="border-slate-700 my-3"/>
                <p className="text-xl font-bold">Total: <span className="text-2xl flex items-center justify-center gap-1">{totalSalaris.toLocaleString('es-ES')} <SalarisIcon className="w-6 h-6 text-yellow-400"/></span></p>
            </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <RankingCard title="Vecinos" icon={<Users size={20} className="mr-2"/>} userRanking={userData.rankings.vecinos} rankingData={vecinosRanking} userName={userData.name} category="vecinos" />
            <RankingCard title="Ciudad" icon={<Map size={20} className="mr-2"/>} userRanking={userData.rankings.ciudad} rankingData={ciudadRanking} userName={userData.name} category="ciudad" />
            <RankingCard title="País" icon={<Globe size={20} className="mr-2"/>} userRanking={userData.rankings.pais} rankingData={paisRanking} userName={userData.name} category="pais" />
        </div>
    </div>
  );
}
