import React, { useState } from 'react';
import AutoconsumoChart from './AutoconsumoChart';
import DatosTab from './DatosTab';
import AhorroTab from './AhorroTab';

export default function UsuarioTabs() {
  const [activeTab, setActiveTab] = useState('autoconsumo');

  const tabs = [
    { id: 'autoconsumo', label: 'AUTOCONSUMO' },
    { id: 'datos', label: 'DATOS' },
    { id: 'ahorro', label: 'AHORRO DE ENERGÍA' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      <div className="p-6">
        {activeTab === 'autoconsumo' && <AutoconsumoChart />}
        {activeTab === 'datos' && <DatosTab />}
        {activeTab === 'ahorro' && <AhorroTab />}
      </div>
    </div>
  );
}