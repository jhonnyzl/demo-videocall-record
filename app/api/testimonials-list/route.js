import fs from 'fs';
import path from 'path';

export async function GET(request) {
    const directoryPath = '/tmp'; // Cambia la ruta a /tmp
    let videoList = [];

    try {
        const files = fs.readdirSync(directoryPath);
        videoList = files.map(file => ({ filename: file }));
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Error al leer el directorio de videos' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    return new Response(JSON.stringify(videoList), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
}