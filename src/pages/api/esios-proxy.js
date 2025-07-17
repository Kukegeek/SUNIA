export async function POST({ request }) {
  try {
    const { endpoint, token } = await request.json();
    
    if (!endpoint) {
      return new Response(JSON.stringify({ error: 'Endpoint requerido' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const esiosUrl = `https://api.esios.ree.es${endpoint}`;
    const apiToken = token || import.meta.env.ESIOS_API_TOKEN;
    
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Host': 'api.esios.ree.es',
      'User-Agent': 'AutoconsumoDashboard/1.0'
    };

    if (apiToken) {
      headers['Authorization'] = `Token token="${apiToken}"`;
    }

    console.log('🔗 Petición ESIOS:', {
      url: esiosUrl,
      hasToken: !!apiToken,
      tokenLength: apiToken?.length
    });
    
    const response = await fetch(esiosUrl, {
      method: 'GET',
      headers
    });

    console.log('📡 Respuesta ESIOS:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error detallado:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      
      return new Response(JSON.stringify({
        success: false,
        error: `API Error ${response.status}: ${response.statusText}`,
        details: errorText,
        endpoint: endpoint
      }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const data = await response.json();
    console.log('✅ Datos obtenidos exitosamente');
    
    return new Response(JSON.stringify({
      success: true,
      data,
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600'
      }
    });

  } catch (error) {
    console.error('💥 Error en proxy ESIOS:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Manejar también GET para endpoints simples
export async function GET({ url }) {
  const endpoint = url.searchParams.get('endpoint');
  const token = url.searchParams.get('token');
  
  if (!endpoint) {
    return new Response(JSON.stringify({ error: 'Endpoint requerido' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Reutilizar la lógica del POST
  const request = {
    json: () => Promise.resolve({ endpoint, token })
  };
  
  return POST({ request });
}