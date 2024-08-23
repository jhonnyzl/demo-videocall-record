import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

const BUNNY_STORAGE_ZONE = process.env.BUNNY_STORAGE_ZONE;
const BUNNY_API_KEY = process.env.BUNNY_API_KEY;
const BUNNY_STORAGE_URL = `https://storage.bunnycdn.com/${BUNNY_STORAGE_ZONE}`;

export async function POST(request) {
    try {
        const data = await request.formData();
        const file = data.get("video");

        if (!file) {
            return NextResponse.json({ success: false, error: "No file provided" });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const fileName = file.name;
        const url = `${BUNNY_STORAGE_URL}/${fileName}`;

        const response = await axios.put(url, buffer, {
            headers: {
                'AccessKey': BUNNY_API_KEY,
                'Content-Type': file.type,
            }
        });

        if (response.status === 201) {
            return NextResponse.json({ success: true, message: 'File uploaded successfully', url });
        } else {
            throw new Error('Failed to upload file');
        }
    } catch (error) {
        console.error("Error uploading file:", error);
        return NextResponse.json({ success: false, error: error.message });
    }
}