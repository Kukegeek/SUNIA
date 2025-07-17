// src/pages/api/solar.json.js
import { getSolarData } from '../../lib/solarApi.js';

export async function GET({ request }) {
  const url = new URL(request.url);
  const params = url.searchParams;

  const options = {
    regionKey: params.get('regionKey') || 'murcia_region',
    provinceKey: params.get('provinceKey') || 'murcia',
    tilt: params.get('tilt') ? parseInt(params.get('tilt'), 10) : null,
    azimuth: params.get('azimuth') ? parseInt(params.get('azimuth'), 10) : 0,
  };

  try {
    const data = await getSolarData(options);
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}