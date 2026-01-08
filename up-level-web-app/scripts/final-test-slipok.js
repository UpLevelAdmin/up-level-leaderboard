
const https = require('https');
const fs = require('fs');

async function testFinal() {
    const imagePath = '/Users/chawanutcharoenthammachoke/.gemini/antigravity/brain/100d5e0e-8617-4832-89a4-5f673a78f4ef/uploaded_image_1767856735872.jpg';
    const hostname = 'up-level-guild.web.app';
    const path = '/api/verify-slip';

    try {
        console.log("Reading image...");
        const imageBuffer = fs.readFileSync(imagePath);
        const base64Image = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;

        const postData = JSON.stringify({
            slipImage: base64Image,
            userId: 'DEBUG_USER',
            amount: 0
        });

        const options = {
            hostname: hostname,
            port: 443,
            path: path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': postData.length
            }
        };

        console.log("Sending request to API...");
        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                console.log("✅ RESULT Status:", res.statusCode);
                try {
                    const result = JSON.parse(data);
                    console.log(JSON.stringify(result, null, 2));
                    if (result.success) {
                        console.log("\n✨ CONGRATULATIONS! SLIP VERIFIED SUCCESSFULLY! ✨");
                    } else {
                        console.log("\n❌ VERIFICATION FAILED.");
                    }
                } catch (e) {
                    console.log("Response was not JSON:", data.substring(0, 500));
                }
            });
        });

        req.on('error', (e) => {
            console.error("Request Error:", e);
        });

        req.write(postData);
        req.end();

    } catch (error) {
        console.error("Error during test:", error);
    }
}

testFinal();
