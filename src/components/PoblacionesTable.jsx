import React, { useState, useMemo } from 'react';

const PoblacionesTable = () => {
  const [activeRanking, setActiveRanking] = useState('autoconsumo');
  const [sortColumn, setSortColumn] = useState('autoconsumo');
  const [sortDirection, setSortDirection] = useState('desc');

  const poblacionesData = [
    { poblacion: 'Abanilla', habitantes: 6145, mwhAno: 7500, kwhAnoHab: 1220, solarMwh: 5800, autoconsumo: 77.30, ahorro: 1.80, diferencia: 120, viviendas: 245, coches: 35, posicionAnterior: 2, cambio: 1 },
    { poblacion: 'Abarán', habitantes: 12964, mwhAno: 16400, kwhAnoHab: 1265, solarMwh: 4500, autoconsumo: 27.40, ahorro: 1.50, diferencia: 165, viviendas: 410, coches: 70, posicionAnterior: 25, cambio: -2 },
    { poblacion: 'Águilas', habitantes: 36862, mwhAno: 52300, kwhAnoHab: 1419, solarMwh: 28000, autoconsumo: 53.50, ahorro: 2.10, diferencia: 319, viviendas: 1850, coches: 290, posicionAnterior: 8, cambio: 3 },
    { poblacion: 'Albudeite', habitantes: 1390, mwhAno: 1585, kwhAnoHab: 1140, solarMwh: 1800, autoconsumo: 113.60, ahorro: 2.80, diferencia: 40, viviendas: 80, coches: 10, posicionAnterior: 1, cambio: 0 },
    { poblacion: 'Alcantarilla', habitantes: 43048, mwhAno: 58100, kwhAnoHab: 1350, solarMwh: 12500, autoconsumo: 21.50, ahorro: 2.00, diferencia: 250, viviendas: 1500, coches: 350, posicionAnterior: 30, cambio: -5 },
    { poblacion: 'Los Alcázares', habitantes: 18598, mwhAno: 27000, kwhAnoHab: 1452, solarMwh: 10000, autoconsumo: 37.00, ahorro: 2.50, diferencia: 352, viviendas: 1100, coches: 180, posicionAnterior: 15, cambio: 2 },
    { poblacion: 'Aledo', habitantes: 1144, mwhAno: 1280, kwhAnoHab: 1119, solarMwh: 1400, autoconsumo: 109.40, ahorro: 2.90, diferencia: 19, viviendas: 65, coches: 8, posicionAnterior: 2, cambio: 1 },
    { poblacion: 'Algorfa', habitantes: 9957, mwhAno: 12250, kwhAnoHab: 1230, solarMwh: 3100, autoconsumo: 25.30, ahorro: 1.60, diferencia: 130, viviendas: 380, coches: 65, posicionAnterior: 28, cambio: -3 },
    { poblacion: 'Alhama de Murcia', habitantes: 23284, mwhAno: 30700, kwhAnoHab: 1318, solarMwh: 13000, autoconsumo: 42.30, ahorro: 1.90, diferencia: 218, viviendas: 950, coches: 195, posicionAnterior: 12, cambio: 1 },
    { poblacion: 'Archena', habitantes: 20110, mwhAno: 25150, kwhAnoHab: 1251, solarMwh: 6200, autoconsumo: 24.70, ahorro: 1.70, diferencia: 151, viviendas: 720, coches: 150, posicionAnterior: 29, cambio: -4 },
    { poblacion: 'Beniel', habitantes: 11578, mwhAno: 14500, kwhAnoHab: 1252, solarMwh: 3500, autoconsumo: 24.10, ahorro: 1.40, diferencia: 152, viviendas: 400, coches: 75, posicionAnterior: 31, cambio: -6 },
    { poblacion: 'Blanca', habitantes: 6744, mwhAno: 8200, kwhAnoHab: 1216, solarMwh: 3100, autoconsumo: 37.80, ahorro: 2.00, diferencia: 116, viviendas: 250, coches: 40, posicionAnterior: 14, cambio: 3 },
    { poblacion: 'Bullas', habitantes: 11641, mwhAno: 13850, kwhAnoHab: 1190, solarMwh: 6500, autoconsumo: 46.90, ahorro: 2.20, diferencia: 90, viviendas: 450, coches: 80, posicionAnterior: 10, cambio: 2 },
    { poblacion: 'Calasparra', habitantes: 10177, mwhAno: 12500, kwhAnoHab: 1228, solarMwh: 8000, autoconsumo: 64.00, ahorro: 2.40, diferencia: 128, viviendas: 400, coches: 70, posicionAnterior: 6, cambio: 1 },
    { poblacion: 'Campos del Río', habitantes: 2132, mwhAno: 2450, kwhAnoHab: 1149, solarMwh: 2300, autoconsumo: 93.90, ahorro: 2.50, diferencia: 49, viviendas: 110, coches: 15, posicionAnterior: 3, cambio: 0 },
    { poblacion: 'Caravaca de la Cruz', habitantes: 25956, mwhAno: 31650, kwhAnoHab: 1219, solarMwh: 16500, autoconsumo: 52.10, ahorro: 2.10, diferencia: 119, viviendas: 1150, coches: 210, posicionAnterior: 9, cambio: 2 },
    { poblacion: 'Cartagena', habitantes: 218050, mwhAno: 311800, kwhAnoHab: 1430, solarMwh: 95000, autoconsumo: 30.50, ahorro: 2.10, diferencia: 330, viviendas: 9500, coches: 2100, posicionAnterior: 20, cambio: -2 },
    { poblacion: 'Cehegín', habitantes: 14503, mwhAno: 17700, kwhAnoHab: 1220, solarMwh: 9800, autoconsumo: 55.40, ahorro: 2.00, diferencia: 120, viviendas: 600, coches: 110, posicionAnterior: 7, cambio: 1 },
    { poblacion: 'Ceutí', habitantes: 12686, mwhAno: 16600, kwhAnoHab: 1309, solarMwh: 4300, autoconsumo: 25.90, ahorro: 1.30, diferencia: 209, viviendas: 480, coches: 95, posicionAnterior: 27, cambio: -2 },
    { poblacion: 'Cieza', habitantes: 35286, mwhAno: 44100, kwhAnoHab: 1250, solarMwh: 18000, autoconsumo: 40.80, ahorro: 1.80, diferencia: 150, viviendas: 1300, coches: 280, posicionAnterior: 13, cambio: 0 },
    { poblacion: 'Fortuna', habitantes: 11099, mwhAno: 14000, kwhAnoHab: 1261, solarMwh: 8100, autoconsumo: 57.90, ahorro: 1.90, diferencia: 161, viviendas: 420, coches: 85, posicionAnterior: 5, cambio: 2 },
    { poblacion: 'Fuente Álamo', habitantes: 18064, mwhAno: 24200, kwhAnoHab: 1340, solarMwh: 23000, autoconsumo: 95.00, ahorro: 2.60, diferencia: 240, viviendas: 800, coches: 160, posicionAnterior: 4, cambio: 1 },
    { poblacion: 'Jumilla', habitantes: 26794, mwhAno: 33200, kwhAnoHab: 1239, solarMwh: 25000, autoconsumo: 75.30, ahorro: 2.30, diferencia: 139, viviendas: 1200, coches: 230, posicionAnterior: 3, cambio: 2 },
    { poblacion: 'Librilla', habitantes: 5729, mwhAno: 7000, kwhAnoHab: 1222, solarMwh: 2200, autoconsumo: 31.40, ahorro: 1.50, diferencia: 122, viviendas: 210, coches: 30, posicionAnterior: 19, cambio: -1 },
    { poblacion: 'Lorca', habitantes: 98447, mwhAno: 127000, kwhAnoHab: 1290, solarMwh: 65000, autoconsumo: 51.20, ahorro: 1.70, diferencia: 190, viviendas: 4200, coches: 950, posicionAnterior: 11, cambio: 1 },
    { poblacion: 'Lorquí', habitantes: 7706, mwhAno: 9900, kwhAnoHab: 1285, solarMwh: 2500, autoconsumo: 25.30, ahorro: 1.20, diferencia: 185, viviendas: 280, coches: 55, posicionAnterior: 26, cambio: -1 },
    { poblacion: 'Mazarrón', habitantes: 34353, mwhAno: 49500, kwhAnoHab: 1441, solarMwh: 30000, autoconsumo: 60.60, ahorro: 2.40, diferencia: 341, viviendas: 1700, coches: 270, posicionAnterior: 4, cambio: 3 },
    { poblacion: 'Molina de Segura', habitantes: 76074, mwhAno: 100400, kwhAnoHab: 1320, solarMwh: 28000, autoconsumo: 27.90, ahorro: 1.30, diferencia: 220, viviendas: 3100, coches: 750, posicionAnterior: 24, cambio: -3 },
    { poblacion: 'Moratalla', habitantes: 7588, mwhAno: 8800, kwhAnoHab: 1160, solarMwh: 8500, autoconsumo: 96.60, ahorro: 2.70, diferencia: 60, viviendas: 350, coches: 50, posicionAnterior: 2, cambio: 2 },
    { poblacion: 'Mula', habitantes: 17382, mwhAno: 20850, kwhAnoHab: 1200, solarMwh: 11000, autoconsumo: 52.80, ahorro: 2.10, diferencia: 100, viviendas: 700, coches: 140, posicionAnterior: 8, cambio: 0 },
    { poblacion: 'Murcia', habitantes: 469177, mwhAno: 656800, kwhAnoHab: 1400, solarMwh: 185000, autoconsumo: 28.20, ahorro: 1.00, diferencia: 300, viviendas: 25000, coches: 5100, posicionAnterior: 23, cambio: -5 },
    { poblacion: 'Ojós', habitantes: 537, mwhAno: 590, kwhAnoHab: 1099, solarMwh: 750, autoconsumo: 127.10, ahorro: 3.20, diferencia: 0, viviendas: 45, coches: 5, posicionAnterior: 1, cambio: 0 },
    { poblacion: 'Pliego', habitantes: 3940, mwhAno: 4650, kwhAnoHab: 1180, solarMwh: 3500, autoconsumo: 75.30, ahorro: 2.60, diferencia: 80, viviendas: 180, coches: 25, posicionAnterior: 5, cambio: 0 },
    { poblacion: 'Puerto Lumbreras', habitantes: 17291, mwhAno: 22500, kwhAnoHab: 1301, solarMwh: 14000, autoconsumo: 62.20, ahorro: 2.00, diferencia: 201, viviendas: 750, coches: 155, posicionAnterior: 6, cambio: 1 },
    { poblacion: 'Ricote', habitantes: 1275, mwhAno: 1430, kwhAnoHab: 1122, solarMwh: 1200, autoconsumo: 83.90, ahorro: 2.70, diferencia: 22, viviendas: 60, coches: 9, posicionAnterior: 4, cambio: 1 },
    { poblacion: 'San Javier', habitantes: 35200, mwhAno: 50000, kwhAnoHab: 1420, solarMwh: 20000, autoconsumo: 40.00, ahorro: 2.30, diferencia: 320, viviendas: 1900, coches: 310, posicionAnterior: 16, cambio: -2 },
    { poblacion: 'San Pedro del Pinatar', habitantes: 27691, mwhAno: 40200, kwhAnoHab: 1452, solarMwh: 16500, autoconsumo: 41.00, ahorro: 2.20, diferencia: 352, viviendas: 1500, coches: 250, posicionAnterior: 15, cambio: -1 },
    { poblacion: 'Santomera', habitantes: 16294, mwhAno: 20700, kwhAnoHab: 1270, solarMwh: 6000, autoconsumo: 29.00, ahorro: 1.40, diferencia: 170, viviendas: 650, coches: 130, posicionAnterior: 22, cambio: -3 },
    { poblacion: 'Torre-Pacheco', habitantes: 39037, mwhAno: 53500, kwhAnoHab: 1370, solarMwh: 35000, autoconsumo: 65.40, ahorro: 2.50, diferencia: 270, viviendas: 1800, coches: 320, posicionAnterior: 5, cambio: 2 },
    { poblacion: 'Las Torres de Cotillas', habitantes: 22183, mwhAno: 28600, kwhAnoHab: 1289, solarMwh: 7500, autoconsumo: 26.20, ahorro: 1.30, diferencia: 189, viviendas: 850, coches: 180, posicionAnterior: 25, cambio: -1 },
    { poblacion: 'Totana', habitantes: 33111, mwhAno: 41000, kwhAnoHab: 1238, solarMwh: 19000, autoconsumo: 46.30, ahorro: 1.90, diferencia: 138, viviendas: 1250, coches: 260, posicionAnterior: 11, cambio: 0 },
    { poblacion: 'Ulea', habitantes: 880, mwhAno: 980, kwhAnoHab: 1114, solarMwh: 900, autoconsumo: 91.80, ahorro: 3.00, diferencia: 14, viviendas: 55, coches: 7, posicionAnterior: 3, cambio: 1 },
    { poblacion: 'La Unión', habitantes: 20897, mwhAno: 26300, kwhAnoHab: 1258, solarMwh: 5100, autoconsumo: 19.40, ahorro: 1.60, diferencia: 158, viviendas: 780, coches: 170, posicionAnterior: 32, cambio: -7 },
    { poblacion: 'Villanueva del Segura', habitantes: 3771, mwhAno: 4150, kwhAnoHab: 1101, solarMwh: 3200, autoconsumo: 77.10, ahorro: 2.40, diferencia: 1, viviendas: 160, coches: 20, posicionAnterior: 4, cambio: 2 },
    { poblacion: 'Yecla', habitantes: 35521, mwhAno: 44400, kwhAnoHab: 1250, solarMwh: 31000, autoconsumo: 69.80, ahorro: 2.20, diferencia: 150, viviendas: 1600, coches: 300, posicionAnterior: 6, cambio: 1 }
  ];

  // Generar datos de posición anterior simulados
  const dataWithPositions = useMemo(() => {
    const sorted = [...poblacionesData].sort((a, b) => b.autoconsumo - a.autoconsumo);
    return sorted.map((item, index) => ({
      ...item,
      posicion: index + 1,
      cambioTendencia: item.cambio > 0 ? 'up' : item.cambio < 0 ? 'down' : 'same'
    }));
  }, []);

  const sortedData = useMemo(() => {
    const sorted = [...dataWithPositions].sort((a, b) => {
      let aValue = a[sortColumn];
      let bValue = b[sortColumn];
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    return sorted;
  }, [dataWithPositions, sortColumn, sortDirection]);

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  const getSortIcon = (column) => {
    if (sortColumn !== column) {
      return (
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path>
        </svg>
      );
    }
    
    return sortDirection === 'asc' ? (
      <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
      </svg>
    ) : (
      <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
      </svg>
    );
  };

  const getChangeIcon = (tendencia, cambio) => {
    if (tendencia === 'up') {
      return (
        <div className="flex items-center text-green-600">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
          </svg>
          <span className="text-xs">+{cambio}</span>
        </div>
      );
    } else if (tendencia === 'down') {
      return (
        <div className="flex items-center text-red-600">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
          <span className="text-xs">{cambio}</span>
        </div>
      );
    }
    return (
      <div className="flex items-center text-gray-500">
        <span className="text-xs">-</span>
      </div>
    );
  };

  const rankings = {
    ahorro: {
      title: '💰 "Los Ahorradores" - Ranking de Ahorro Energético',
      sortKey: 'ahorro',
      unit: '€/MWh'
    },
    autoconsumo: {
      title: '☀️ "Los Solaris" - Ranking de Autoconsumo Solar',
      sortKey: 'autoconsumo',
      unit: '%'
    },
    produccion: {
      title: '⚡ "Los Generadores" - Ranking de Producción Solar',
      sortKey: 'solarMwh',
      unit: 'MWh/año'
    }
  };

  const getDataForRanking = (rankingType) => {
    const sortKey = rankings[rankingType].sortKey;
    return [...poblacionesData]
      .sort((a, b) => b[sortKey] - a[sortKey])
      .map((item, index) => ({
        ...item,
        posicion: index + 1,
        cambioTendencia: item.cambio > 0 ? 'up' : item.cambio < 0 ? 'down' : 'same'
      }));
  };

  const currentData = getDataForRanking(activeRanking);
  const topThree = currentData.slice(0, 3);

  return (
    <div>
      {/* Selector de Rankings */}
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(rankings).map(([key, ranking]) => (
            <button
              key={key}
              onClick={() => {
                setActiveRanking(key);
                setSortColumn(ranking.sortKey);
                setSortDirection('desc');
              }}
              className={`p-4 rounded-lg border-2 transition-all ${
                activeRanking === key
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
            >
              <h3 className="font-semibold text-sm">{ranking.title}</h3>
            </button>
          ))}
        </div>
      </div>

      {/* Podium */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          🏆 {rankings[activeRanking].title}
        </h2>
        <div className="flex justify-center items-end space-x-4">
          {/* Segundo lugar */}
          <div className="text-center">
            <div className="bg-gray-300 rounded-lg p-4 h-24 flex items-center justify-center mb-2">
              <span className="text-2xl font-bold text-gray-700">2º</span>
            </div>
            <h3 className="font-semibold text-gray-800">{topThree[1]?.poblacion}</h3>
            <p className="text-sm text-gray-600">
              {topThree[1]?.[rankings[activeRanking].sortKey]?.toFixed(1)} {rankings[activeRanking].unit}
            </p>
          </div>
          
          {/* Primer lugar */}
          <div className="text-center">
            <div className="bg-yellow-400 rounded-lg p-4 h-32 flex items-center justify-center mb-2">
              <span className="text-3xl font-bold text-yellow-800">1º</span>
            </div>
            <h3 className="font-semibold text-gray-800">{topThree[0]?.poblacion}</h3>
            <p className="text-sm text-gray-600">
              {topThree[0]?.[rankings[activeRanking].sortKey]?.toFixed(1)} {rankings[activeRanking].unit}
            </p>
          </div>
          
          {/* Tercer lugar */}
          <div className="text-center">
            <div className="bg-orange-400 rounded-lg p-4 h-20 flex items-center justify-center mb-2">
              <span className="text-xl font-bold text-orange-800">3º</span>
            </div>
            <h3 className="font-semibold text-gray-800">{topThree[2]?.poblacion}</h3>
            <p className="text-sm text-gray-600">
              {topThree[2]?.[rankings[activeRanking].sortKey]?.toFixed(1)} {rankings[activeRanking].unit}
            </p>
          </div>
        </div>
      </div>

      {/* Tabla con datos ordenados según el ranking activo */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pos.
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('poblacion')}
                >
                  <div className="flex items-center">
                    Población
                    {getSortIcon('poblacion')}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('habitantes')}
                >
                  <div className="flex items-center">
                    Habitantes
                    {getSortIcon('habitantes')}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('autoconsumo')}
                >
                  <div className="flex items-center">
                    Autoconsumo Solar
                    {getSortIcon('autoconsumo')}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('ahorro')}
                >
                  <div className="flex items-center">
                    Ahorro
                    {getSortIcon('ahorro')}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('solarMwh')}
                >
                  <div className="flex items-center">
                    Solar MWh/año
                    {getSortIcon('solarMwh')}
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cambio
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedData.map((item, index) => (
                <tr key={item.poblacion} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {sortColumn === 'autoconsumo' && sortDirection === 'desc' ? index + 1 : item.posicion}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.poblacion}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.habitantes.toLocaleString()}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <div className="flex-1">
                        <div className="text-sm font-medium">{item.autoconsumo.toFixed(1)}%</div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${Math.min(item.autoconsumo, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.ahorro.toFixed(1)}%
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.solarMwh.toLocaleString()}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getChangeIcon(item.cambioTendencia, item.cambio)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PoblacionesTable;