import React, { useState, useEffect } from 'react';
import DeviceConfigModal from './DeviceConfigModal.jsx';

const SuniaDeviceCards = () => {
  const [devices, setDevices] = useState([
    {
      id: 1,
      name: 'Climatización Vivienda',
      icon: '❄️',
      status: 'Preenfriando',
      consumption: '2.3 kWh',
      startTime: '15:30',
      endTime: '21:00',
      progress: 45,
      description: 'Aire acondicionado encendido para preenfriar la vivienda',
      config: {
        modes: ['eco', 'ventilacion'],
        selectedMode: 'eco',
        rooms: ['salon', 'cocina', 'dormitorio1', 'dormitorio2'],
        selectedRooms: ['salon', 'dormitorio1']
      }
    },
    {
      id: 2,
      name: 'Lavadora',
      icon: '👕',
      status: 'En funcionamiento',
      consumption: '1.8 kWh',
      startTime: '16:00',
      endTime: '20:05',
      progress: 30,
      description: 'Programa eco de 2 horas, finalizará cuando llegues a casa',
      config: {
        modes: ['eco', 'prendas delicadas', 'modo muy sucio'],
        selectedMode: 'eco'
      }
    },
    {
      id: 3,
      name: 'Lavavajillas',
      icon: '🍽️',
      status: 'En funcionamiento',
      consumption: '1.5 kWh',
      startTime: '17:30',
      endTime: '20:15',
      progress: 60,
      description: 'Programa eco en curso',
      config: {
        modes: ['eco', 'muy sucio', 'aclarado brillante', 'seco'],
        selectedMode: 'eco'
      }
    },
    {
      id: 4,
      name: 'Iluminación Exterior',
      icon: '💡',
      status: 'Programada',
      consumption: '0.2 kWh',
      startTime: '21:10',
      endTime: '07:00',
      progress: 0,
      description: 'Se encenderá al 10%, aumentando 5% cada 10min hasta 35%. 60% con presencia',
      config: {
        modes: ['eco', 'normal', 'luminoso'],
        selectedMode: 'eco',
        percentages: { eco: '10-35%', normal: '20-50%', luminoso: '30-80%' }
      }
    },
    {
      id: 5,
      name: 'Vehículo Eléctrico',
      icon: '🚗',
      status: 'Suministrando energía',
      consumption: '6.0 kWh disponibles',
      startTime: '20:00',
      endTime: '07:00',
      progress: 25,
      description: 'Suministrando energía a la vivienda durante la noche',
      config: {
        kwhDeliverable: 6.0,
        maxKwh: 10.0
      }
    },
    {
      id: 6,
      name: 'Carga Vehículo Eléctrico',
      icon: '🔋',
      status: 'Programada',
      consumption: '0 kWh de 37 kWh',
      startTime: '07:00',
      endTime: '15:00',
      progress: 0,
      description: 'Carga programada con energía solar desde las 7:00 AM',
      config: {
        modes: ['eco', 'rapida', 'inteligente'],
        selectedMode: 'inteligente',
        maxKwh: 37,
        currentKwh: 0
      }
    }
  ]);

  const [selectedDevice, setSelectedDevice] = useState(null);
  const [showConfigModal, setShowConfigModal] = useState(false);

  // Simular actualización de progreso
  useEffect(() => {
    const interval = setInterval(() => {
      setDevices(prevDevices => 
        prevDevices.map(device => {
          if (device.status === 'En funcionamiento' || device.status === 'Preenfriando' || device.status === 'Suministrando energía') {
            const increment = Math.random() * 3;
            return {
              ...device,
              progress: Math.min(device.progress + increment, 100)
            };
          }
          return device;
        })
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'En funcionamiento':
      case 'Preenfriando':
      case 'Suministrando energía':
        return 'text-green-600 bg-green-100';
      case 'Programada':
        return 'text-blue-600 bg-blue-100';
      case 'Apagada':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getProgressColor = (progress) => {
    if (progress < 30) return 'bg-red-500';
    if (progress < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const handleConfigClick = (device) => {
    setSelectedDevice(device);
    setShowConfigModal(true);
  };

  const handleConfigSave = (deviceId, newConfig) => {
    setDevices(prevDevices => 
      prevDevices.map(device => 
        device.id === deviceId 
          ? { ...device, config: { ...device.config, ...newConfig } }
          : device
      )
    );
    setShowConfigModal(false);
  };

  // Efecto para resetear barras a las 8:00 AM
  useEffect(() => {
    const checkTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      
      if (hours === 8 && minutes === 0) {
        setDevices(prevDevices => 
          prevDevices.map(device => ({
            ...device,
            progress: 0,
            status: 'Programada'
          }))
        );
      }
    };

    const interval = setInterval(checkTime, 60000); // Verificar cada minuto
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <span className="mr-3">🏠</span>
        Dispositivos IoT del Hogar
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {devices.map((device) => (
          <div key={device.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <span className="text-3xl mr-3">{device.icon}</span>
                <h3 className="text-lg font-semibold text-gray-800">{device.name}</h3>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(device.status)}`}>
                {device.status}
              </span>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">{device.description}</p>
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>Consumo: {device.consumption}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500 mb-3">
                <span>Inicio: {device.startTime}</span>
                <span>Fin: {device.endTime}</span>
              </div>
            </div>
            
            {/* Opciones de configuración encima de la barra de progreso */}
            {device.config && device.config.modes && (
              <div className="mb-3">
                <div className="flex flex-wrap gap-2 mb-2">
                  {device.config.modes.map((mode) => (
                    <button
                      key={mode}
                      className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                        device.config.selectedMode === mode
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                      }`}
                      onClick={() => {
                        setDevices(prevDevices => 
                          prevDevices.map(d => 
                            d.id === device.id 
                              ? { ...d, config: { ...d.config, selectedMode: mode } }
                              : d
                          )
                        );
                      }}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mb-2">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Progreso</span>
                <span>{Math.round(device.progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(device.progress)}`}
                  style={{ width: `${device.progress}%` }}
                ></div>
              </div>
            </div>
            
            <div className="flex justify-between mt-4">
              <button 
                onClick={() => handleConfigClick(device)}
                className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
              >
                Configurar
              </button>
              <button className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600 transition-colors">
                Detener
              </button>
            </div>
          </div>
        ))}
      </div>

      {showConfigModal && selectedDevice && (
        <DeviceConfigModal
          device={selectedDevice}
          onClose={() => setShowConfigModal(false)}
          onSave={handleConfigSave}
        />
      )}
    </div>
  );
};

export default SuniaDeviceCards;