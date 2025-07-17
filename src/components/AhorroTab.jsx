import React from 'react';

const tarjetas = [
  {
    titulo: 'Apaga la luz al amanecer',
    descripcion: 'Apaga la luz al amanecer y enciéndela al atardecer. Es adecuado...',
    xp: '5%-10%',
    icono: '💡'
  },
  {
    titulo: 'Cerrar automáticamente luces',
    descripcion: 'Apaga automáticamente la luz al salir de casa y enciéndela al regresar',
    xp: '5%-10%',
    icono: '🏠'
  },
  {
    titulo: 'Cerrar automáticamente el ventilador',
    descripcion: 'El ventilador se apaga automáticamente cuando te vas de...',
    xp: '5%-10%',
    icono: '🌀'
  },
  {
    titulo: 'Cerrar automáticamente la válvula',
    descripcion: 'Al salir de casa, cierra automáticamente la válvula...',
    xp: '6%-10%',
    icono: '🚿'
  },
  {
    titulo: 'Cerrar el termostato',
    descripcion: 'Cuando salgas de casa, el termostato se apagará automáticamente',
    xp: '8%-15%',
    icono: '🌡️'
  }
];

export default function AhorroTab() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Estrategias de Ahorro</h2>
      <div className="space-y-4">
        {tarjetas.map((tarjeta, index) => (
          <div key={index} className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">{tarjeta.titulo}</h3>
                <p className="text-blue-100 text-sm mb-4">{tarjeta.descripcion}</p>
                <div className="flex items-center space-x-2">
                  <span className="text-sm">⚡ Ahorro energético estimado: {tarjeta.xp}</span>
                </div>
              </div>
              <div className="ml-4">
                <button className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="absolute top-4 right-4 text-4xl opacity-20">
              {tarjeta.icono}
            </div>
            <div className="absolute bottom-0 right-0 w-32 h-32 opacity-10">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <path d="M20 50 L50 20 L80 50 L50 80 Z" fill="currentColor" />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}