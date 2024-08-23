import axios from 'axios';

const BUNNY_STORAGE_ZONE = process.env.BUNNY_STORAGE_ZONE;
const BUNNY_API_KEY = process.env.BUNNY_API_KEY_READ_ONLY;
const BUNNY_STORAGE_URL = `https://storage.bunnycdn.com/${BUNNY_STORAGE_ZONE}/`;

export async function GET(request) {
    try {
        if (!BUNNY_STORAGE_ZONE || !BUNNY_API_KEY) {
            throw new Error('BUNNY_STORAGE_ZONE or BUNNY_API_KEY is not defined');
        }

        console.log('Fetching video list from:', BUNNY_STORAGE_URL);

        const response = await axios.get(BUNNY_STORAGE_URL, {
            headers: {
                'AccessKey': BUNNY_API_KEY,
            }
        });

        // console.log("BUNNY_STORAGE_URL", BUNNY_STORAGE_URL);
        // console.log("BUNNY_API_KEY", BUNNY_API_KEY);

        // console.log('Response status:', response.status);
        // console.log('Response data:', response.data);

        if (response.status !== 200) {
            throw new Error('Error al obtener la lista de videos');
        }

        // Verificar que la respuesta tenga el formato esperado
        if (!Array.isArray(response.data)) {
            throw new Error('Formato de respuesta inesperado');
        }

        const videoList = response.data.map(file => ({ filename: file.ObjectName }));

        return new Response(JSON.stringify(videoList), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error al obtener la lista de videos:', error.message);
        return new Response(JSON.stringify({ error: 'Error al obtener la lista de videos' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}