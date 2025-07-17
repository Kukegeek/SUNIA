import React from 'react';

export default function LogrosWidget() {
  // Datos simulados coherentes
  const datosUsuario = {
    nombre: 'Tu Usuario',
    produccionSolar: 1274, // kWh
    vertidoRed: 498, // kWh
    consumoRed: 404, // kWh
    xpTotal: 8250,
    posiciones: {
      vecinos: { actual: 1, anterior: 2, total: 56, incremento: 3 },
      ciudad: { actual: 3, anterior: 4, total: 3264, incremento: 156 },
      pais: { actual: 46, anterior: 48, total: 97568, incremento: 2847 }
    }
  };

  // Cálculo de puntos XP
  const xpProduccion = datosUsuario.produccionSolar * 5;
  const xpVertido = datosUsuario.vertidoRed * 20;
  const xpConsumo = datosUsuario.consumoRed * -20;
  const balanceNeto = datosUsuario.vertidoRed - datosUsuario.consumoRed;
  const xpTotal = xpProduccion + xpVertido + xpConsumo;

  // Rankings simulados con cambios de posición
  const rankings = {
    vecinos: {
      titulo: 'Vecinos',
      participantes: 56,
      incremento: 3,
      primero: { nombre: 'Green Murcia', xp: 8250 },
      lista: [
        { pos: 1, nombre: 'Green Murcia', xp: 8250, esUsuario: true, cambio: 'subio', posiciones: 1 },
        { pos: 2, nombre: 'Casa Verde', xp: 7890, cambio: 'bajo', posiciones: 1 },
        { pos: 3, nombre: 'Solar Family', xp: 7650, cambio: 'igual', posiciones: 0 },
        { pos: 4, nombre: 'EcoHome', xp: 7420, cambio: 'subio', posiciones: 2 },
        { pos: 5, nombre: 'GreenPower', xp: 7200, cambio: 'bajo', posiciones: 1 },
        { pos: 6, nombre: 'SunHouse', xp: 6980, cambio: 'subio', posiciones: 3 },
        { pos: 7, nombre: 'CleanEnergy', xp: 6750, cambio: 'igual', posiciones: 0 },
        { pos: 8, nombre: 'EcoVecino', xp: 6500, cambio: 'bajo', posiciones: 2 },
        { pos: 9, nombre: 'SolarMax', xp: 6250, cambio: 'subio', posiciones: 1 },
        { pos: 10, nombre: 'GreenLife', xp: 6000, cambio: 'igual', posiciones: 0 }
      ]
    },
    ciudad: {
      titulo: 'Ciudad',
      participantes: 3264,
      incremento: 156,
      primero: { nombre: 'Carlos Martínez', xp: 15420 },
      lista: [
        { pos: 1, nombre: 'Carlos Martínez', xp: 15420, cambio: 'subio', posiciones: 1 },
        { pos: 2, nombre: 'Ana García', xp: 12890, cambio: 'bajo', posiciones: 1 },
        { pos: 3, nombre: 'Green Murcia', xp: 8250, esUsuario: true, cambio: 'subio', posiciones: 1 },
        { pos: 4, nombre: 'Luis Rodríguez', xp: 8190, cambio: 'igual', posiciones: 0 },
        { pos: 5, nombre: 'María López', xp: 8120, cambio: 'subio', posiciones: 2 },
        { pos: 6, nombre: 'Pedro Sánchez', xp: 7950, cambio: 'bajo', posiciones: 1 },
        { pos: 7, nombre: 'Laura Fernández', xp: 7920, cambio: 'subio', posiciones: 3 },
        { pos: 8, nombre: 'Casa verde', xp: 7890, cambio: 'igual', posiciones: 0 },
        { pos: 9, nombre: 'Carmen Ruiz', xp: 7750, cambio: 'bajo', posiciones: 2 },
        { pos: 10, nombre: 'David Moreno', xp: 7690, cambio: 'subio', posiciones: 1 }
      ]
    },
    pais: {
      titulo: 'País',
      participantes: 97568,
      incremento: 2847,
      primero: { nombre: 'Alejandro Jiménez', xp: 45890 },
      lista: [
        { pos: 1, nombre: 'Alejandro Jiménez', xp: 45890, cambio: 'igual', posiciones: 0 },
        { pos: 2, nombre: 'Isabel Herrera', xp: 42350, cambio: 'subio', posiciones: 1 },
        { pos: 3, nombre: 'Roberto Castillo', xp: 38920, cambio: 'bajo', posiciones: 1 },
        { pos: 4, nombre: 'Elena Vargas', xp: 35680, cambio: 'subio', posiciones: 2 },
        { pos: 5, nombre: 'Francisco Ramos', xp: 32450, cambio: 'bajo', posiciones: 1 },
        { pos: 6, nombre: 'Cristina Mendoza', xp: 29870, cambio: 'subio', posiciones: 3 },
        { pos: 7, nombre: 'Antonio Guerrero', xp: 27340, cambio: 'igual', posiciones: 0 },
        { pos: 8, nombre: 'Beatriz Romero', xp: 24890, cambio: 'bajo', posiciones: 2 },
        { pos: 9, nombre: 'Javier Delgado', xp: 22450, cambio: 'subio', posiciones: 1 },
        { pos: 46, nombre: 'Green Murcia', xp: 8250, esUsuario: true, cambio: 'subio', posiciones: 2 }
      ]
    }
  };

  const renderFlecha = (cambio, posiciones) => {
    if (cambio === 'subio') {
      return (
        <span className="flex items-center text-green-600 text-sm font-semibold">
          ↗️ +{posiciones}
        </span>
      );
    } else if (cambio === 'bajo') {
      return (
        <span className="flex items-center text-red-600 text-sm font-semibold">
          ↘️ -{posiciones}
        </span>
      );
    }
    return <span className="text-gray-500 text-sm font-semibold">= 0</span>;
  };

  const renderBarraProgreso = (xpUsuario, xpPrimero) => {
    const porcentaje = Math.min((xpUsuario / xpPrimero) * 100, 100);
    return (
      <div className="mt-3">
        <div className="flex justify-between text-xs text-gray-600 mb-1">
          <span>Progreso hacia el 1º</span>
          <span>{porcentaje.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${porcentaje}%` }}
          ></div>
        </div>
      </div>
    );
  };

  const renderRanking = (categoria, datos) => {
    const posicionUsuario = datosUsuario.posiciones[categoria];
    const distanciaPrimero = datos.primero.xp - datosUsuario.xpTotal;
    
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-center mb-4 text-gray-800">
          🏆 {datos.titulo}
        </h3>
        
        {/* Posición del usuario */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-bold text-lg">Tu posición: #{posicionUsuario.actual}</p>
              <p className="text-sm text-gray-600">
                de {posicionUsuario.total.toLocaleString()} participantes (+{posicionUsuario.incremento})
              </p>
            </div>
            <div className="text-right">
              {renderFlecha('subio', posicionUsuario.anterior - posicionUsuario.actual)}
              <p className="text-sm text-gray-600">{datosUsuario.xpTotal.toLocaleString()} XP</p>
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            Distancia al 1º: {distanciaPrimero.toLocaleString()} XP
          </div>
          {renderBarraProgreso(datosUsuario.xpTotal, datos.primero.xp)}
        </div>

        {/* Lista del ranking */}
        <div className="space-y-2">
          {datos.lista.map((item, index) => (
            <div
              key={item.pos}
              className={`flex justify-between items-center p-3 rounded-lg ${
                item.esUsuario
                  ? 'bg-yellow-100 border-2 border-yellow-300'
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className={`font-bold ${
                  item.pos === 1 ? 'text-yellow-600' :
                  item.pos === 2 ? 'text-gray-500' :
                  item.pos === 3 ? 'text-orange-600' :
                  'text-gray-700'
                }`}>
                  #{item.pos}
                </span>
                <span className={`${
                  item.esUsuario ? 'font-bold text-blue-700' : 'text-gray-800'
                }`}>
                  {item.nombre}
                </span>
                {item.pos <= 3 && (
                  <span className="text-lg">
                    {item.pos === 1 ? '🥇' : item.pos === 2 ? '🥈' : '🥉'}
                  </span>
                )}
                {renderFlecha(item.cambio, item.posiciones)}
              </div>
              <span className="font-semibold text-gray-700">
                {item.xp.toLocaleString()} XP
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Título principal */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">🏆 Ranking</h1>
        <p className="text-gray-600">Competencia de autoconsumo energético</p>
      </div>

      {/* Tarjeta de puntos XP */}
      <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-lg shadow-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-6 text-center">💰 Sistema de Puntos XP</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
            <div className="text-3xl mb-2">☀️</div>
            <h3 className="font-semibold mb-2">Producción Solar</h3>
            <p className="text-sm mb-1">+5 XP por kWh</p>
            <p className="text-lg font-bold">{datosUsuario.produccionSolar} kWh</p>
            <p className="text-green-200">+{xpProduccion} XP</p>
          </div>
          
          <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
            <div className="text-3xl mb-2">⚡</div>
            <h3 className="font-semibold mb-2">Vertido a Red</h3>
            <p className="text-sm mb-1">+20 XP por kWh</p>
            <p className="text-lg font-bold">{datosUsuario.vertidoRed} kWh</p>
            <p className="text-green-200">+{xpVertido} XP</p>
          </div>
          
          <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
            <div className="text-3xl mb-2">🔌</div>
            <h3 className="font-semibold mb-2">Consumo de Red</h3>
            <p className="text-sm mb-1">-20 XP por kWh</p>
            <p className="text-lg font-bold">{datosUsuario.consumoRed} kWh</p>
            <p className="text-red-200">{xpConsumo} XP</p>
          </div>
        </div>

        {/* Balance neto */}
        <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
          <h3 className="text-xl font-bold mb-2">⚖️ Balance Neto Energético</h3>
          <p className="text-lg mb-2">
            Vertido: {datosUsuario.vertidoRed} kWh - Consumo: {datosUsuario.consumoRed} kWh = 
            <span className={`font-bold ml-2 ${
              balanceNeto > 0 ? 'text-green-200' : 'text-red-200'
            }`}>
              {balanceNeto > 0 ? '+' : ''}{balanceNeto} kWh
            </span>
          </p>
          
          {balanceNeto > 0 ? (
            <div className="bg-green-500 bg-opacity-30 rounded-lg p-3">
              <p className="font-bold text-green-100">🎉 ¡Enhorabuena!</p>
              <p className="text-sm">Tienes un balance energético positivo. ¡Estás contribuyendo a la red eléctrica!</p>
            </div>
          ) : (
            <div className="bg-orange-500 bg-opacity-30 rounded-lg p-3">
              <p className="font-bold text-orange-100">💪 ¡Sigue así!</p>
              <p className="text-sm">Intenta conseguir un balance positivo el próximo mes. ¡Tú puedes!</p>
            </div>
          )}
          
          <div className="mt-4 text-center">
            <p className="text-2xl font-bold">Total: {xpTotal.toLocaleString()} XP</p>
          </div>
        </div>
      </div>

      {/* Rankings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {renderRanking('vecinos', rankings.vecinos)}
        {renderRanking('ciudad', rankings.ciudad)}
        {renderRanking('pais', rankings.pais)}
      </div>
    </div>
  );
}