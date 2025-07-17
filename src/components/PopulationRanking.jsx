// src/components/PopulationRanking.jsx

import { useState, useMemo } from 'react';
import { ChevronsUp, ChevronsDown, Minus, Trophy, Sun, Leaf, Atom } from 'lucide-react';

// --- SUB-COMPONENTES AUXILIARES ---

const RankChangeIndicator = ({ change }) => {
    if (change === 0) return <span className="flex items-center text-slate-400 w-8 justify-end"><Minus size={14} />{change}</span>;
    const isPositive = change > 0;
    const Icon = isPositive ? ChevronsUp : ChevronsDown;
    const color = isPositive ? 'text-green-400' : 'text-red-400';
    return <span className={`flex items-center font-bold ${color} w-8 justify-end`}><Icon size={14} className="mr-0.5" />{isPositive ? `+${change}` : change}</span>;
};

const PodiumCard = ({ title, icon, topThree, dataKey, unit }) => (
    <div className="bg-slate-800/50 p-4 rounded-lg text-center">
        <h3 className="text-xl font-bold mb-4 flex items-center justify-center">{icon}{title}</h3>
        <div className="flex justify-center items-end gap-2">
            {topThree[1] && <div className="w-1/3"><p className="font-bold text-xs truncate">{topThree[1].poblacion}</p><div className="h-20 bg-slate-700 rounded-t-lg flex flex-col justify-center items-center p-1 border-b-4 border-slate-400"><Trophy size={20} className="text-slate-300"/><p className="text-lg font-bold">2º</p><p className="text-xs font-semibold">{topThree[1][dataKey].toLocaleString('es-ES')}{unit}</p></div></div>}
            {topThree[0] && <div className="w-1/3"><p className="font-bold text-xs truncate">{topThree[0].poblacion}</p><div className="h-28 bg-slate-700 rounded-t-lg flex flex-col justify-center items-center p-1 border-b-4 border-yellow-400"><Trophy size={24} className="text-yellow-400"/><p className="text-xl font-bold">1º</p><p className="text-sm font-semibold">{topThree[0][dataKey].toLocaleString('es-ES')}{unit}</p></div></div>}
            {topThree[2] && <div className="w-1/3"><p className="font-bold text-xs truncate">{topThree[2].poblacion}</p><div className="h-16 bg-slate-700 rounded-t-lg flex flex-col justify-center items-center p-1 border-b-4 border-amber-600"><Trophy size={18} className="text-amber-500"/><p className="text-base font-bold">3º</p><p className="text-xs font-semibold">{topThree[2][dataKey].toLocaleString('es-ES')}{unit}</p></div></div>}
        </div>
    </div>
);

// --- COMPONENTE PRINCIPAL ---
export default function PopulationRanking() {
    const initialPopulationData = [
        { poblacion: 'Abanilla', habitantes: 6145, consumoMwh: 7500, consumoKwhHab: 1220, solarMwh: 5800, autoconsumoPct: 77.3, ahorroPct: 49.47, ahorroCo2Tn: 965, viviendasEficientes: 245, cochesElectricos: 35, change: -1 },
        { poblacion: 'Abarán', habitantes: 12964, consumoMwh: 16400, consumoKwhHab: 1265, solarMwh: 4500, autoconsumoPct: 27.4, ahorroPct: 17.54, ahorroCo2Tn: 748, viviendasEficientes: 410, cochesElectricos: 70, change: 2 },
        { poblacion: 'Águilas', habitantes: 36862, consumoMwh: 52300, consumoKwhHab: 1419, solarMwh: 28000, autoconsumoPct: 53.5, ahorroPct: 24.08, ahorroCo2Tn: 3274, viviendasEficientes: 1850, cochesElectricos: 290, change: 0 },
        { poblacion: 'Albudeite', habitantes: 1390, consumoMwh: 1585, consumoKwhHab: 1140, solarMwh: 1800, autoconsumoPct: 113.6, ahorroPct: 62.48, ahorroCo2Tn: 257, viviendasEficientes: 80, cochesElectricos: 10, change: 1 },
        { poblacion: 'Alcantarilla', habitantes: 43048, consumoMwh: 58100, consumoKwhHab: 1350, solarMwh: 12500, autoconsumoPct: 21.5, ahorroPct: 9.68, ahorroCo2Tn: 1462, viviendasEficientes: 1500, cochesElectricos: 350, change: 3 },
        { poblacion: 'Los Alcázares', habitantes: 18598, consumoMwh: 27000, consumoKwhHab: 1452, solarMwh: 10000, autoconsumoPct: 37.0, ahorroPct: 23.68, ahorroCo2Tn: 1662, viviendasEficientes: 1100, cochesElectricos: 180, change: -2 },
        { poblacion: 'Aledo', habitantes: 1144, consumoMwh: 1280, consumoKwhHab: 1119, solarMwh: 1400, autoconsumoPct: 109.4, ahorroPct: 71.94, ahorroCo2Tn: 239, viviendasEficientes: 65, cochesElectricos: 8, change: 0 },
        { poblacion: 'Alguazas', habitantes: 9957, consumoMwh: 12250, consumoKwhHab: 1230, solarMwh: 3100, autoconsumoPct: 25.3, ahorroPct: 11.39, ahorroCo2Tn: 363, viviendasEficientes: 380, cochesElectricos: 65, change: 1 },
        { poblacion: 'Alhama de Murcia', habitantes: 23284, consumoMwh: 30700, consumoKwhHab: 1318, solarMwh: 13000, autoconsumoPct: 42.3, ahorroPct: 27.07, ahorroCo2Tn: 2161, viviendasEficientes: 950, cochesElectricos: 195, change: -1 },
        { poblacion: 'Archena', habitantes: 20110, consumoMwh: 25150, consumoKwhHab: 1251, solarMwh: 6200, autoconsumoPct: 24.7, ahorroPct: 11.12, ahorroCo2Tn: 727, viviendasEficientes: 720, cochesElectricos: 150, change: 0 },
        { poblacion: 'Beniel', habitantes: 11578, consumoMwh: 14500, consumoKwhHab: 1252, solarMwh: 3500, autoconsumoPct: 24.1, ahorroPct: 10.85, ahorroCo2Tn: 409, viviendasEficientes: 400, cochesElectricos: 75, change: 2 },
        { poblacion: 'Blanca', habitantes: 6744, consumoMwh: 8200, consumoKwhHab: 1216, solarMwh: 3100, autoconsumoPct: 37.8, ahorroPct: 24.19, ahorroCo2Tn: 516, viviendasEficientes: 250, cochesElectricos: 40, change: -3 },
        { poblacion: 'Bullas', habitantes: 11641, consumoMwh: 13850, consumoKwhHab: 1190, solarMwh: 6500, autoconsumoPct: 46.9, ahorroPct: 30.02, ahorroCo2Tn: 1081, viviendasEficientes: 450, cochesElectricos: 80, change: 1 },
        { poblacion: 'Calasparra', habitantes: 10177, consumoMwh: 12500, consumoKwhHab: 1228, solarMwh: 8000, autoconsumoPct: 64.0, ahorroPct: 40.96, ahorroCo2Tn: 1331, viviendasEficientes: 400, cochesElectricos: 70, change: 0 },
        { poblacion: 'Campos del Río', habitantes: 2132, consumoMwh: 2450, consumoKwhHab: 1149, solarMwh: 2300, autoconsumoPct: 93.9, ahorroPct: 60.10, ahorroCo2Tn: 383, viviendasEficientes: 110, cochesElectricos: 15, change: 2 },
        { poblacion: 'Caravaca de la Cruz', habitantes: 25956, consumoMwh: 31650, consumoKwhHab: 1219, solarMwh: 16500, autoconsumoPct: 52.1, ahorroPct: 23.45, ahorroCo2Tn: 1929, viviendasEficientes: 1150, cochesElectricos: 210, change: -1 },
        { poblacion: 'Cartagena', habitantes: 218050, consumoMwh: 311800, consumoKwhHab: 1430, solarMwh: 95000, autoconsumoPct: 30.5, ahorroPct: 20.50, ahorroCo2Tn: 16619, viviendasEficientes: 9500, cochesElectricos: 2100, change: 0 },
        { poblacion: 'Cehegín', habitantes: 14503, consumoMwh: 17700, consumoKwhHab: 1220, solarMwh: 9800, autoconsumoPct: 55.4, ahorroPct: 24.93, ahorroCo2Tn: 1147, viviendasEficientes: 600, cochesElectricos: 110, change: 1 },
        { poblacion: 'Ceutí', habitantes: 12686, consumoMwh: 16600, consumoKwhHab: 1309, solarMwh: 4300, autoconsumoPct: 25.9, ahorroPct: 16.58, ahorroCo2Tn: 715, viviendasEficientes: 480, cochesElectricos: 95, change: -2 },
        { poblacion: 'Cieza', habitantes: 35286, consumoMwh: 44100, consumoKwhHab: 1250, solarMwh: 18000, autoconsumoPct: 40.8, ahorroPct: 26.11, ahorroCo2Tn: 2994, viviendasEficientes: 1300, cochesElectricos: 280, change: 3 },
        { poblacion: 'Fortuna', habitantes: 11099, consumoMwh: 14000, consumoKwhHab: 1261, solarMwh: 8100, autoconsumoPct: 57.9, ahorroPct: 37.06, ahorroCo2Tn: 1349, viviendasEficientes: 420, cochesElectricos: 85, change: 0 },
        { poblacion: 'Fuente Álamo', habitantes: 18064, consumoMwh: 24200, consumoKwhHab: 1340, solarMwh: 23000, autoconsumoPct: 95.0, ahorroPct: 86.00, ahorroCo2Tn: 5411, viviendasEficientes: 800, cochesElectricos: 160, change: 1 },
        { poblacion: 'Jumilla', habitantes: 26794, consumoMwh: 33200, consumoKwhHab: 1239, solarMwh: 25000, autoconsumoPct: 75.3, ahorroPct: 33.89, ahorroCo2Tn: 2925, viviendasEficientes: 1200, cochesElectricos: 230, change: -1 },
        { poblacion: 'Librilla', habitantes: 5729, consumoMwh: 7000, consumoKwhHab: 1222, solarMwh: 2200, autoconsumoPct: 31.4, ahorroPct: 25.65, ahorroCo2Tn: 467, viviendasEficientes: 210, cochesElectricos: 30, change: 0 },
        { poblacion: 'Lorca', habitantes: 98447, consumoMwh: 127000, consumoKwhHab: 1290, solarMwh: 65000, autoconsumoPct: 51.2, ahorroPct: 23.04, ahorroCo2Tn: 7608, viviendasEficientes: 4200, cochesElectricos: 950, change: 2 },
        { poblacion: 'Lorquí', habitantes: 7706, consumoMwh: 9900, consumoKwhHab: 1285, solarMwh: 2500, autoconsumoPct: 25.3, ahorroPct: 16.19, ahorroCo2Tn: 417, viviendasEficientes: 280, cochesElectricos: 55, change: -2 },
        { poblacion: 'Mazarrón', habitantes: 34353, consumoMwh: 49500, consumoKwhHab: 1441, solarMwh: 30000, autoconsumoPct: 60.6, ahorroPct: 38.78, ahorroCo2Tn: 4992, viviendasEficientes: 1700, cochesElectricos: 270, change: 1 },
        { poblacion: 'Molina de Segura', habitantes: 76074, consumoMwh: 100400, consumoKwhHab: 1320, solarMwh: 28000, autoconsumoPct: 27.9, ahorroPct: 17.86, ahorroCo2Tn: 4661, viviendasEficientes: 3100, cochesElectricos: 750, change: 0 },
        { poblacion: 'Moratalla', habitantes: 7588, consumoMwh: 8800, consumoKwhHab: 1160, solarMwh: 8500, autoconsumoPct: 96.6, ahorroPct: 61.82, ahorroCo2Tn: 1415, viviendasEficientes: 350, cochesElectricos: 50, change: 3 },
        { poblacion: 'Mula', habitantes: 17382, consumoMwh: 20850, consumoKwhHab: 1200, solarMwh: 11000, autoconsumoPct: 52.8, ahorroPct: 43.25, ahorroCo2Tn: 2345, viviendasEficientes: 700, cochesElectricos: 140, change: -1 },
        { poblacion: 'Murcia', habitantes: 469177, consumoMwh: 656800, consumoKwhHab: 1400, solarMwh: 185000, autoconsumoPct: 28.2, ahorroPct: 12.69, ahorroCo2Tn: 21670, viviendasEficientes: 25000, cochesElectricos: 5100, change: 0 },
        { poblacion: 'Ojós', habitantes: 537, consumoMwh: 590, consumoKwhHab: 1099, solarMwh: 750, autoconsumoPct: 127.1, ahorroPct: 69.45, ahorroCo2Tn: 107, viviendasEficientes: 45, cochesElectricos: 5, change: 2 },
        { poblacion: 'Pliego', habitantes: 3940, consumoMwh: 4650, consumoKwhHab: 1180, solarMwh: 3500, autoconsumoPct: 75.3, ahorroPct: 33.89, ahorroCo2Tn: 410, viviendasEficientes: 180, cochesElectricos: 25, change: -2 },
        { poblacion: 'Puerto Lumbreras', habitantes: 17291, consumoMwh: 22500, consumoKwhHab: 1301, solarMwh: 14000, autoconsumoPct: 62.2, ahorroPct: 42.45, ahorroCo2Tn: 2483, viviendasEficientes: 750, cochesElectricos: 155, change: 1 },
        { poblacion: 'Ricote', habitantes: 1275, consumoMwh: 1430, consumoKwhHab: 1122, solarMwh: 1200, autoconsumoPct: 83.9, ahorroPct: 37.76, ahorroCo2Tn: 140, viviendasEficientes: 60, cochesElectricos: 9, change: 0 },
        { poblacion: 'San Javier', habitantes: 35200, consumoMwh: 50000, consumoKwhHab: 1420, solarMwh: 20000, autoconsumoPct: 40.0, ahorroPct: 25.24, ahorroCo2Tn: 3281, viviendasEficientes: 1900, cochesElectricos: 310, change: -1 },
        { poblacion: 'San Pedro del Pinatar', habitantes: 27691, consumoMwh: 40200, consumoKwhHab: 1452, solarMwh: 16500, autoconsumoPct: 41.0, ahorroPct: 18.45, ahorroCo2Tn: 1928, viviendasEficientes: 1500, cochesElectricos: 250, change: 3 },
        { poblacion: 'Santomera', habitantes: 16294, consumoMwh: 20700, consumoKwhHab: 1270, solarMwh: 6000, autoconsumoPct: 29.0, ahorroPct: 20.21, ahorroCo2Tn: 1088, viviendasEficientes: 650, cochesElectricos: 130, change: 0 },
        { poblacion: 'Torre-Pacheco', habitantes: 39037, consumoMwh: 53500, consumoKwhHab: 1370, solarMwh: 35000, autoconsumoPct: 65.4, ahorroPct: 42.41, ahorroCo2Tn: 5899, viviendasEficientes: 1800, cochesElectricos: 320, change: -2 },
        { poblacion: 'Las Torres de Cotillas', habitantes: 22183, consumoMwh: 28600, consumoKwhHab: 1289, solarMwh: 7500, autoconsumoPct: 26.2, ahorroPct: 16.77, ahorroCo2Tn: 1247, viviendasEficientes: 850, cochesElectricos: 180, change: 1 },
        { poblacion: 'Totana', habitantes: 33111, consumoMwh: 41000, consumoKwhHab: 1238, solarMwh: 19000, autoconsumoPct: 46.3, ahorroPct: 29.63, ahorroCo2Tn: 3159, viviendasEficientes: 1250, cochesElectricos: 260, change: 0 },
        { poblacion: 'Ulea', habitantes: 880, consumoMwh: 980, consumoKwhHab: 1114, solarMwh: 900, autoconsumoPct: 91.8, ahorroPct: 50.49, ahorroCo2Tn: 129, viviendasEficientes: 55, cochesElectricos: 7, change: 2 },
        { poblacion: 'La Unión', habitantes: 20897, consumoMwh: 26300, consumoKwhHab: 1258, solarMwh: 5100, autoconsumoPct: 19.4, ahorroPct: 10.67, ahorroCo2Tn: 730, viviendasEficientes: 780, cochesElectricos: 170, change: -1 },
        { poblacion: 'Villanueva del Segura', habitantes: 3771, consumoMwh: 4150, consumoKwhHab: 1101, solarMwh: 3200, autoconsumoPct: 77.1, ahorroPct: 42.41, ahorroCo2Tn: 458, viviendasEficientes: 160, cochesElectricos: 20, change: 0 },
        { poblacion: 'Yecla', habitantes: 35521, consumoMwh: 44400, consumoKwhHab: 1250, solarMwh: 31000, autoconsumoPct: 69.8, ahorroPct: 38.39, ahorroCo2Tn: 4432, viviendasEficientes: 1600, cochesElectricos: 300, change: -3 },
    ];
    
    // --- CÁLCULO PER CÁPITA ---
    const populationData = useMemo(() => {
        return initialPopulationData.map(p => ({
            ...p,
            ahorroCo2KgHab: p.habitantes > 0 ? Math.round((p.ahorroCo2Tn * 1000) / p.habitantes) : 0,
            solarKwhHab: p.habitantes > 0 ? Math.round((p.solarMwh * 1000) / p.habitantes) : 0,
        }));
    }, []);

    const [sortConfig, setSortConfig] = useState({ key: 'ahorroCo2KgHab', direction: 'descending' });

    const sortedData = useMemo(() => {
        let sortableData = [...populationData];
        if (sortConfig.key) {
            sortableData.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1;
                if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1;
                return 0;
            });
        }
        return sortableData;
    }, [populationData, sortConfig]);

    const requestSort = (key) => {
        let direction = 'descending';
        if (sortConfig.key === key && sortConfig.direction === 'descending') {
            direction = 'ascending';
        }
        setSortConfig({ key, direction });
    };

    const getSortIndicator = (key) => {
        if (sortConfig.key !== key) return null;
        return sortConfig.direction === 'descending' ? ' ▼' : ' ▲';
    };

    // --- PODIOS ACTUALIZADOS ---
    const topAutoconsumo = useMemo(() => [...populationData].sort((a,b) => b.autoconsumoPct - a.autoconsumoPct).slice(0,3), [populationData]);
    const topAhorroCo2 = useMemo(() => [...populationData].sort((a,b) => b.ahorroCo2KgHab - a.ahorroCo2KgHab).slice(0,3), [populationData]);
    const topProduccionSolar = useMemo(() => [...populationData].sort((a,b) => b.solarKwhHab - a.solarKwhHab).slice(0,3), [populationData]);

    // --- CABECERAS DE TABLA ACTUALIZADAS ---
    const tableHeaders = [
        { key: 'poblacion', label: 'Población' },
        { key: 'habitantes', label: 'Habitantes' },
        { key: 'autoconsumoPct', label: 'Autoconsumo', unit: '%' },
        { key: 'solarKwhHab', label: 'Prod. Solar/hab', unit: ' kWh' },
        { key: 'ahorroCo2KgHab', label: 'Ahorro CO₂/hab', unit: ' kg' },
        { key: 'viviendasEficientes', label: 'Viviendas Efic.' },
        { key: 'cochesElectricos', label: 'Coches Eléct.' },
    ];
    
    return (
        <div className="w-full max-w-7xl mx-auto font-sans text-white">
            <h1 className="text-4xl font-bold text-center mb-8">Ranking de Sostenibilidad Municipal</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <PodiumCard title="Top Autoconsumo" icon={<Sun size={24} className="mr-2 text-yellow-400"/>} topThree={topAutoconsumo} dataKey="autoconsumoPct" unit="%"/>
                <PodiumCard title="Top Ahorro CO₂ / Hab." icon={<Leaf size={24} className="mr-2 text-green-400"/>} topThree={topAhorroCo2} dataKey="ahorroCo2KgHab" unit=" kg"/>
                <PodiumCard title="Top Prod. Solar / Hab." icon={<Atom size={24} className="mr-2 text-blue-400"/>} topThree={topProduccionSolar} dataKey="solarKwhHab" unit=" kWh"/>
            </div>
            
            <div className="bg-slate-800/50 p-4 rounded-lg overflow-x-auto">
                <table className="w-full text-left whitespace-nowrap">
                    <thead>
                        <tr className="border-b border-slate-700">
                            <th className="p-3">#</th>
                            {tableHeaders.map(({ key, label }) => (
                                <th key={key} className="p-3 cursor-pointer hover:text-orange-400 transition-colors" onClick={() => requestSort(key)}>
                                    {label}{getSortIndicator(key)}
                                </th>
                            ))}
                            <th className="p-3"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedData.map((item, index) => (
                            <tr key={item.poblacion} className="border-b border-slate-800 hover:bg-slate-700/50">
                                <td className="p-3 font-bold">{index + 1}</td>
                                {tableHeaders.map(({ key, unit = '' }) => (
                                    <td key={key} className="p-3">
                                        {typeof item[key] === 'number' ? item[key].toLocaleString('es-ES') : item[key]}{unit}
                                    </td>
                                ))}
                                <td className="p-3"><RankChangeIndicator change={item.change} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}