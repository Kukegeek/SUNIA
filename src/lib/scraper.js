// src/lib/scraper.js

// --- FUNCIONES AUXILIARES PARA FORMATEAR LOS DATOS DE LA API ---

// Formatea la fecha '2023-07-20' al formato 'Jueves 20 de Julio'
function formatFullDate(dateStr) {
    const date = new Date(dateStr + 'T00:00:00'); // Añadimos tiempo para evitar problemas de zona horaria
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    let formatted = new Intl.DateTimeFormat('es-ES', options).format(date);
    // Poner la primera letra en mayúscula
    formatted = formatted.charAt(0).toUpperCase() + formatted.slice(1);
    return formatted;
}

// Formatea la hora '2023-07-20T05:51' a '05:51'
function formatTime(dateTimeStr) {
    return dateTimeStr.split('T')[1];
}

// --- FUNCIÓN PRINCIPAL PARA OBTENER LOS DATOS ---

export async function getRadiationData() {
    console.log("--- OBTENIENDO DATOS DESDE LA API PÚBLICA DE OPEN-METEO ---");

    const LATITUDE = 37.99; // Coordenadas para Murcia, España
    const LONGITUDE = -1.13;
    const API_URL = `https://api.open-meteo.com/v1/forecast?latitude=${LATITUDE}&longitude=${LONGITUDE}&hourly=shortwave_radiation&daily=sunrise,sunset,shortwave_radiation_sum&forecast_days=16&timezone=Europe%2FMadrid`;

    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`La API de Open-Meteo respondió con un error: ${response.status}`);
        }
        const data = await response.json();

        // --- TRANSFORMACIÓN DE DATOS ---
        // La API devuelve los datos en arrays paralelos, los unimos en la estructura que nuestro componente espera.
        const allDaysData = data.daily.time.map((dateStr, index) => {
            const dayData = {
                id: index,
                fullDate: formatFullDate(dateStr),
                shortDate: `${formatFullDate(dateStr).substring(0, 3)} ${dateStr.split('-')[2]}`, // "Jue 20"
                sunrise: formatTime(data.daily.sunrise[index]),
                sunset: formatTime(data.daily.sunset[index]),
                // La API da la suma en Wh/m². La dividimos por 1 para asegurar que es un número y la redondeamos.
                totalRadiation: `${Math.round(data.daily.shortwave_radiation_sum[index])} wh/m²`,
                hourly: []
            };

            // Recorremos todas las horas y asignamos las que pertenecen a este día
            for (let i = 0; i < data.hourly.time.length; i++) {
                if (data.hourly.time[i].startsWith(dateStr)) {
                    const value = data.hourly.shortwave_radiation[i];
                    if (value !== null && value > 0) { // Solo añadir horas con radiación
                         dayData.hourly.push({
                            hour: formatTime(data.hourly.time[i]),
                            value: Math.round(value)
                        });
                    }
                }
            }
            return dayData;
        });

        console.log(`¡ÉXITO! Datos obtenidos y procesados para ${allDaysData.length} días.`);
        return allDaysData;

    } catch (error) {
        console.error("ERROR AL OBTENER DATOS DE OPEN-METEO:", error);
        return []; // Devolver array vacío en caso de error
    }
}