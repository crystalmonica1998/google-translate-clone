import { NextRequest, NextResponse } from "next/server";
import { AzureKeyCredential, OpenAIClient } from "@azure/openai";

export async function POST(request: NextRequest) {
    const formData = await request.formData();
    const file = formData.get('audio') as File;

    if(process.env.AZURE_API_KEY === undefined ||
        process.env.AZURE_ENDPOINT === undefined ||
        process.env.AZURE_DEPLOYMENT_NAME === undefined
    ) {
        console.log('Azure credentials not set');

        return NextResponse.json({ error: 'Azure credentials not set' });
    }

    if(file.size === 0) {
        return NextResponse.json({ error: 'No audio file provided' });
    }

    const arrayBuffer = await file.arrayBuffer();
    const audio = new Uint8Array(arrayBuffer);

    const client = new OpenAIClient(
        process.env.AZURE_ENDPOINT,
        new AzureKeyCredential(process.env.AZURE_API_KEY)
    );

    const result = await client.getAudioTranscription(
        process.env.AZURE_DEPLOYMENT_NAME,
        audio
    );

    return NextResponse.json({ text: result.text });
}