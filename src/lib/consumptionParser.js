// src/lib/consumptionParser.js

export function parseConsumptionCoefficients(csvText) {
  const lines = csvText.trim().split('\n').slice(1); // Omitir la primera línea de encabezado
  const coefficients = {}; // Objeto para acceder rápido: { "mes-dia": [...] }

  lines.forEach(line => {
    const [month, day, hour, coeffStr] = line.trim().split(';');
    if (!month || !day || !coeffStr) return;

    const key = `${parseInt(month, 10)}-${parseInt(day, 10)}`;
    const coefficient = parseFloat(coeffStr.replace(',', '.'));

    if (!coefficients[key]) {
      coefficients[key] = [];
    }
    // La hora 24 la ajustamos al índice 23
    coefficients[key][parseInt(hour, 10) - 1] = coefficient;
  });

  return coefficients;
}

export function calculateConsumptionData(coefficients, annualConsumptionKWh) {
  const consumptionData = {};
  const monthlyTotals = Array(12).fill(0);
  const dailyTotals = {};

  Object.keys(coefficients).forEach(dayKey => {
    const hourlyCoeffs = coefficients[dayKey];
    const dailyConsumptionKWh = hourlyCoeffs.reduce((sum, coeff) => sum + (coeff * annualConsumptionKWh), 0);
    const [month] = dayKey.split('-').map(Number);
    
    dailyTotals[dayKey] = parseFloat(dailyConsumptionKWh.toFixed(2));
    monthlyTotals[month - 1] += dailyConsumptionKWh;

    consumptionData[dayKey] = hourlyCoeffs.map(coeff => parseFloat((coeff * annualConsumptionKWh).toFixed(3)));
  });

  return {
    annualTotal: annualConsumptionKWh,
    monthlyTotals: monthlyTotals.map(t => parseFloat(t.toFixed(2))),
    dailyTotals,
    hourlyData: consumptionData,
  };
}