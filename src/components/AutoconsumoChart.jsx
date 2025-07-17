import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { dia: 1, generacion: 550, autoconsumo: 280, consumo: 520, red: 240 },
  { dia: 2, generacion: 650, autoconsumo: 350, consumo: 480, red: 130 },
  { dia: 3, generacion: 620, autoconsumo: 320, consumo: 500, red: 180 },
  { dia: 4, generacion: 900, autoconsumo: 450, consumo: 600, red: 150 },
  { dia: 5, generacion: 980, autoconsumo: 480, consumo: 580, red: 100 },
  { dia: 6, generacion: 850, autoconsumo: 420, consumo: 550, red: 130 },
  { dia: 7, generacion: 950, autoconsumo: 470, consumo: 590, red: 120 },
  { dia: 8, generacion: 920, autoconsumo: 460, consumo: 570, red: 110 },
  { dia: 9, generacion: 820, autoconsumo: 410, consumo: 540, red: 130 },
  { dia: 10, generacion: 580, autoconsumo: 290, consumo: 510, red: 220 },
  { dia: 11, generacion: 520, autoconsumo: 260, consumo: 490, red: 230 },
  { dia: 12, generacion: 580, autoconsumo: 290, consumo: 520, red: 230 }
];

const totales = {
  generacion: 8.96,
  autoconsumo: 2.82,
  consumo: 5.26,
  red: 2.44
};

export default function AutoconsumoChart() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Energía</h2>
      <div className="mb-6">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="dia" />
            <YAxis label={{ value: 'kWh', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Bar dataKey="generacion" fill="#F59E0B" name="Generación" />
            <Bar dataKey="autoconsumo" fill="#FDE047" name="Autoconsumo" />
            <Bar dataKey="consumo" fill="#60A5FA" name="Consumo" />
            <Bar dataKey="red" fill="#6B7280" name="De la red" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-yellow-500 rounded"></div>
          <span className="text-sm">Generación</span>
          <span className="font-bold">{totales.generacion} MWh</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-yellow-300 rounded"></div>
          <span className="text-sm">Autoconsumo</span>
          <span className="font-bold">{totales.autoconsumo} MWh</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-400 rounded"></div>
          <span className="text-sm">Consumo</span>
          <span className="font-bold">{totales.consumo} MWh</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gray-500 rounded"></div>
          <span className="text-sm">De la red</span>
          <span className="font-bold">{totales.red} MWh</span>
        </div>
      </div>
    </div>
  );
}