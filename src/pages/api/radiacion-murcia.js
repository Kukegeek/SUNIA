export async function GET() {
  try {
    // Datos de ejemplo para 15 días
    const radiacionData = [];
    
    for (let i = 0; i < 15; i++) {
      const fecha = new Date();
      fecha.setDate(fecha.getDate() + i);
      
      const datosHorarios = [];
      for (let hora = 6; hora <= 20; hora++) {
        datosHorarios.push({
          hora: hora,
          radiacion: Math.floor(Math.random() * 800) + 200 // Valores entre 200-1000 w/m²
        });
      }
      
      radiacionData.push({
        fecha: fecha.toISOString().split('T')[0],
        amanecer: '07:30',
        atardecer: '19:45',
        totalRadiacion: datosHorarios.reduce((sum, item) => sum + item.radiacion, 0),
        datosHorarios: datosHorarios
      });
    }
    
    return new Response(JSON.stringify(radiacionData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error al obtener datos de radiación' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}

function parseRadiacionData(html) {
  const radiacionData = [];
  
  try {
    // Expresiones regulares para extraer datos
    const dayRegex = /(\w+)\s+(\d+)\s+de\s+(\w+)(\d{1,2}:\d{2})(\d{1,2}:\d{2})(\d+)\s+wh\/m2/g;
    const hourRegex = /(\d{2}):(\d{2})(\d+)\s+w\/m2/g;
    
    let dayMatch;
    let dayIndex = 0;
    
    // Datos basados en el contenido web proporcionado
    const daysData = [
      {
        fecha: '2024-07-13',
        amanecer: '6:51',
        atardecer: '21:29',
        totalRadiacion: 7876,
        datosHorarios: [
          { hora: 8, radiacion: 112 },
          { hora: 9, radiacion: 308 },
          { hora: 10, radiacion: 506 },
          { hora: 11, radiacion: 681 },
          { hora: 12, radiacion: 820 },
          { hora: 13, radiacion: 912 },
          { hora: 14, radiacion: 949 },
          { hora: 15, radiacion: 905 },
          { hora: 16, radiacion: 826 },
          { hora: 17, radiacion: 722 },
          { hora: 18, radiacion: 566 },
          { hora: 19, radiacion: 377 },
          { hora: 20, radiacion: 176 },
          { hora: 21, radiacion: 16 }
        ]
      },
      {
        fecha: '2024-07-14',
        amanecer: '6:52',
        atardecer: '21:28',
        totalRadiacion: 2515,
        datosHorarios: [
          { hora: 8, radiacion: 28 },
          { hora: 9, radiacion: 84 },
          { hora: 10, radiacion: 126 },
          { hora: 11, radiacion: 170 },
          { hora: 12, radiacion: 205 },
          { hora: 13, radiacion: 228 },
          { hora: 14, radiacion: 237 },
          { hora: 15, radiacion: 279 },
          { hora: 16, radiacion: 277 },
          { hora: 17, radiacion: 202 },
          { hora: 18, radiacion: 142 },
          { hora: 19, radiacion: 347 },
          { hora: 20, radiacion: 175 },
          { hora: 21, radiacion: 15 }
        ]
      }
    ];
    
    // Generar datos para 15 días
    for (let i = 0; i < 15; i++) {
      if (i < daysData.length) {
        radiacionData.push(daysData[i]);
      } else {
        // Generar datos simulados para días adicionales
        const baseDate = new Date('2024-07-13');
        baseDate.setDate(baseDate.getDate() + i);
        
        radiacionData.push({
          fecha: baseDate.toISOString().split('T')[0],
          amanecer: '6:51',
          atardecer: '21:29',
          totalRadiacion: Math.floor(Math.random() * 3000) + 5000,
          datosHorarios: generateHourlyData()
        });
      }
    }
    
  } catch (error) {
    console.error('Error parseando datos:', error);
  }
  
  return radiacionData;
}

function generateHourlyData() {
  const hours = [];
  for (let hour = 8; hour <= 21; hour++) {
    let radiacion;
    if (hour <= 10) {
      radiacion = Math.floor(Math.random() * 400) + 100;
    } else if (hour <= 14) {
      radiacion = Math.floor(Math.random() * 400) + 600;
    } else if (hour <= 18) {
      radiacion = Math.floor(Math.random() * 300) + 400;
    } else {
      radiacion = Math.floor(Math.random() * 200) + 50;
    }
    
    hours.push({ hora: hour, radiacion });
  }
  return hours;
}

function generateFallbackData() {
  const fallbackData = [];
  
  for (let i = 0; i < 15; i++) {
    const baseDate = new Date();
    baseDate.setDate(baseDate.getDate() + i);
    
    fallbackData.push({
      fecha: baseDate.toISOString().split('T')[0],
      amanecer: '6:51',
      atardecer: '21:29',
      totalRadiacion: Math.floor(Math.random() * 3000) + 5000,
      datosHorarios: generateHourlyData()
    });
  }
  
  return fallbackData;
}