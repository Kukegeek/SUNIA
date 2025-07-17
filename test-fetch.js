// test-fetch.js
async function testApiConnection() {
    const API_URL = 'https://www.tutiempo.net/p/get/v3/forecast_radiation?lang=es&id=391';
    console.log('--- INICIANDO PRUEBA DE CONEXIÓN DIRECTA ---');
    console.log(`Intentando conectar con la API: ${API_URL}`);

    try {
        const response = await fetch(API_URL, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Referer': 'https://www.tutiempo.net/radiacion-solar/murcia.html'
            }
        });

        console.log(`Respuesta del servidor recibida. Estado: ${response.status}`);

        if (!response.ok) {
            console.error('La respuesta de la API no fue exitosa. Código de estado:', response.status);
            const errorBody = await response.text();
            console.error('Cuerpo de la respuesta de error:', errorBody);
            return;
        }

        const data = await response.json();
        console.log('¡CONEXIÓN EXITOSA! Se recibieron los datos correctamente.');
        console.log('Datos de muestra:', JSON.stringify(data.day_forecast[0], null, 2));

    } catch (error) {
        console.error('----------------------------------------------------');
        console.error('>>> ERROR CRÍTICO DURANTE LA CONEXIÓN <<<');
        console.error('Este es el error real que necesitamos para resolver el problema:');
        console.error(error);
        console.error('----------------------------------------------------');
        console.log('Si ves este mensaje, significa que Node.js no puede conectarse a la URL.');
        console.log('Posibles causas: Firewall, Antivirus, Proxy o un problema de red.');
    } finally {
        console.log('--- PRUEBA FINALIZADA ---');
    }
}

testApiConnection();