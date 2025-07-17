import React, { useState } from 'react';

const DeviceConfigModal = ({ device, onClose, onSave }) => {
  const [config, setConfig] = useState(device.config);
  const [startTime, setStartTime] = useState(device.startTime);
  const [endTime, setEndTime] = useState(device.endTime);

  const handleModeChange = (mode) => {
    setConfig(prev => ({ ...prev, selectedMode: mode }));
  };

  const handleRoomToggle = (room) => {
    setConfig(prev => ({
      ...prev,
      selectedRooms: prev.selectedRooms?.includes(room)
        ? prev.selectedRooms.filter(r => r !== room)
        : [...(prev.selectedRooms || []), room]
    }));
  };

  const handleKwhChange = (value) => {
    setConfig(prev => ({ ...prev, kwhDeliverable: parseFloat(value) }));
  };

  const handleSave = () => {
    onSave(device.id, {
      ...config,
      startTime,
      endTime
    });
  };

  const renderModeButtons = () => {
    if (!config.modes) return null;
    
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Modo de funcionamiento</label>
        <div className="flex flex-wrap gap-2">
          {config.modes.map(mode => (
            <button
              key={mode}
              onClick={() => handleModeChange(mode)}
              className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                config.selectedMode === mode
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>
        {config.percentages && (
          <p className="text-xs text-gray-500 mt-1">
            {config.selectedMode}: {config.percentages[config.selectedMode]}
          </p>
        )}
      </div>
    );
  };

  const renderRoomSelection = () => {
    if (!config.rooms) return null;
    
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Habitaciones activas</label>
        <div className="grid grid-cols-2 gap-2">
          {config.rooms.map(room => (
            <button
              key={room}
              onClick={() => handleRoomToggle(room)}
              className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                config.selectedRooms?.includes(room)
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {room.charAt(0).toUpperCase() + room.slice(1)}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderKwhSlider = () => {
    if (typeof config.kwhDeliverable === 'undefined') return null;
    
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          kWh entregables: {config.kwhDeliverable} kWh
        </label>
        <input
          type="range"
          min="0"
          max={config.maxKwh || 10}
          step="0.5"
          value={config.kwhDeliverable}
          onChange={(e) => handleKwhChange(e.target.value)}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0 kWh</span>
          <span>{config.maxKwh || 10} kWh</span>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <span className="text-2xl mr-2">{device.icon}</span>
            Configurar {device.name}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          {/* Horarios */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hora de inicio</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hora de fin</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Modos */}
          {renderModeButtons()}

          {/* Habitaciones */}
          {renderRoomSelection()}

          {/* kWh Slider */}
          {renderKwhSlider()}
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeviceConfigModal;