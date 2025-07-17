import { getWindData } from '../../lib/windApi.js';

export async function GET({ request }) {
  const url = new URL(request.url);
  const params = url.searchParams;
  const options = {
    regionKey: params.get('regionKey') || 'navarra',
    provinceKey: params.get('provinceKey') || 'navarra',
  };
  try {
    const data = await getWindData(options);
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}