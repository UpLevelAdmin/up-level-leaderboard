
const fs = require('fs');
const https = require('https');

// 1. CONFIG
const SLIPOK_API_KEY = 'SLIPOKE2TSLQJ'; // Your Hardcoded Key
const BRANCH_ID = '58927';
const IMAGE_PATH = '/Users/chawanutcharoenthammachoke/.gemini/antigravity/brain/100d5e0e-8617-4832-89a4-5f673a78f4ef/uploaded_image_1767854351496.jpg';

async function testSlip() {
    console.log("🚀 Testing SlipOK API...");
    console.log(`📂 Reading Image: ${IMAGE_PATH}`);

    try {
        // 2. Read & Convert Image to Base64
        const fileBuffer = fs.readFileSync(IMAGE_PATH);
        const base64Image = fileBuffer.toString('base64');
        console.log(`✅ Image converted to Base64 (Size: ${base64Image.length} chars)`);

        // 3. Send Request
        const postData = JSON.stringify({
            data: base64Image
        });

        const options = {
            hostname: 'api.slipok.com',
            path: `/api/line/apikey/${BRANCH_ID}`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-authorization': SLIPOK_API_KEY,
                'Content-Length': postData.length
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const result = JSON.parse(data);
                    console.log("\n📡 API Response:");
                    console.log("---------------------------------------------------");
                    if (result.success) {
                        console.log("✅ SUCCESS! Slip Verified.");
                        console.log(`💰 Amount: ${result.data.amount} THB`);
                        console.log(`👤 Payer: ${result.data.sender ? result.data.sender.displayName : 'Unknown'}`);
                        console.log(`🏦 Receiver: ${result.data.receiver ? result.data.receiver.displayName : 'Unknown'}`);
                        console.log(`📅 Date: ${result.data.transDate} ${result.data.transTime}`);
                        console.log("---------------------------------------------------");
                    } else {
                        console.log("❌ FAILED.");
                        console.log(result);
                    }
                } catch (e) {
                    console.error("Parse Error:", e);
                    console.log("Raw Response:", data);
                }
            });
        });

        req.on('error', (e) => {
            console.error(`Request Error: ${e.message}`);
        });

        req.write(postData);
        req.end();

    } catch (error) {
        console.error("❌ Error:", error.message);
    }
}

testSlip();
