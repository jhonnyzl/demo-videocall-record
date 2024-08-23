import { writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

export async function POST(request) {
    try {
        const data = await request.formData();
        const file = data.get("video"); // Asegúrate de que el nombre coincide con el del frontend

        if (!file) {
            return NextResponse.json({ success: false, error: "No file provided" });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Guardar el archivo en el sistema de archivos
        const filePath = path.join(process.cwd(), "public", "testimonials", file.name);
        await writeFile(filePath, buffer);
        console.log(`open ${filePath} to see the uploaded file`);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error uploading file:", error);
        return NextResponse.json({ success: false, error: error.message });
    }
}