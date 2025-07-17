import React from 'react';

const datos = [
  { 
    titulo: 'Estrategias de ahorro de energía personalizadas', 
    mediaPoblacional: '3.2/5', 
    valorUsuario: 4.1, 
    xp: 25 
  },
  { 
    titulo: 'Alertas de energía en tiempo real', 
    mediaPoblacional: '78%', 
    valorUsuario: 85, 
    xp: 15 
  },
  { 
    titulo: 'Potencia en tiempo real', 
    mediaPoblacional: '2.1 kW', 
    valorUsuario: 1.8, 
    xp: 20 
  },
  { 
    titulo: 'Dispositivo de trabajo', 
    mediaPoblacional: '6.2h/día', 
    valorUsuario: 5.1, 
    xp: 30 
  },
  { 
    titulo: 'Dispositivo en espera', 
    mediaPoblacional: '18h/día', 
    valorUsuario: 15, 
    xp: 25 
  },
  { 
    titulo: 'Informe de Energía IA', 
    mediaPoblacional: '2.8/5', 
    valorUsuario: 4.2, 
    xp: 35 
  },
  { 
    titulo: 'Uso de electricidad', 
    mediaPoblacional: '8.5 kWh/día', 
    valorUsuario: 6.2, 
    xp: 40 
  },
  { 
    titulo: 'Costos', 
    mediaPoblacional: '€45/mes', 
    valorUsuario: 32, 
    xp: 45 
  }
];

function getStatusColor(valor, media) {
  const mediaNum = parseFloat(media.toString().replace(/[^0-9.]/g, ''));
  const valorNum = parseFloat(valor.toString());
  
  if (valorNum > mediaNum) return 'text-green-600 bg-green-50';
  if (valorNum < mediaNum) return 'text-red-600 bg-red-50';
  return 'text-gray-600 bg-gray-50';
}

export default function DatosTab() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Análisis de Datos</h2>
      <div className="space-y-3">
        {datos.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <h3 className="font-medium text-gray-800">{item.titulo}</h3>
              <p className="text-sm text-gray-500">Media poblacional: {item.mediaPoblacional}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                getStatusColor(item.valorUsuario, item.mediaPoblacional)
              }`}>
                {item.valorUsuario}{typeof item.valorUsuario === 'number' && item.valorUsuario < 10 ? (item.titulo.includes('kW') ? ' kW' : item.titulo.includes('€') ? ' €' : '') : ''}
              </div>
              <div className="text-primary font-bold text-sm">
                +{item.xp} XP
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 p-4 bg-primary text-white rounded-lg text-center">
        <button className="font-semibold">Activar ahora</button>
      </div>
    </div>
  );
}