
import { NextRequest, NextResponse } from 'next/server';

// SlipOK API Endpoint
const SLIPOK_URL = 'https://api.slipok.com/api/line/apikey/58927';

export async function POST(req: NextRequest) {
    try {
        const { slipImage, userId, amount } = await req.json();

        // Hardcoded SlipOK Key for Testing
        const SLIPOK_API_KEY = 'SLIPOKE2TSLQJ';

        // 1. Prepare Base64
        const base64Data = slipImage.includes(',') ? slipImage.split(',').pop() : slipImage;

        console.log("🚀 Sending to SlipOK...");

        // 2. Call SlipOK API
        const response = await fetch(SLIPOK_URL, {
            method: 'POST',
            headers: {
                'x-authorization': SLIPOK_API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                files: base64Data,
                log: true,
                amount: amount || 0
            })
        });

        const rawText = await response.text();
        console.log("Raw Response:", rawText);

        try {
            const result = JSON.parse(rawText);
            return NextResponse.json(result);
        } catch (e) {
            return NextResponse.json({ error: "API returned non-JSON", details: rawText }, { status: 500 });
        }

    } catch (error: any) {
        console.error("Critical API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
