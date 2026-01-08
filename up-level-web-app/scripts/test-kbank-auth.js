
const https = require('https');

// --- SETUP ---
// นี่คือค่าจาก "Example Credentials" ในหน้าจอของท่าน
// ถ้าท่านมี Key ของตัวเอง (จากหน้า My Apps) ให้เอามาเปลี่ยนตรงนี้ครับ
const CONSUMER_ID = 'eTuq2c0ZqWAGWwcZgeid33AFjuRzs4cG';
const CONSUMER_SECRET = 'Bi8Arh2rB4oQ9RAJ';

// URL ของ KBank Sandbox (ตามโจทย์เป๊ะๆ)
const HOST = 'openapi-sandbox.kasikornbank.com';
const PATH = '/v2/oauth/token';

async function getKBankToken() {
    console.log("🚀 Testing KBank API (Exercise 1)...");

    const postData = 'grant_type=client_credentials';

    const options = {
        hostname: HOST,
        path: PATH,
        method: 'POST',
        headers: {
            // Basic Auth: Base64(ID:Secret)
            'Authorization': 'Basic ' + Buffer.from(CONSUMER_ID + ':' + CONSUMER_SECRET).toString('base64'),
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': postData.length,
            'x-test-mode': 'true',
            'env-id': 'OAUTH2'
        }
    };

    const req = https.request(options, (res) => {
        console.log(`STATUS: ${res.statusCode}`);
        let data = '';

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            try {
                const json = JSON.parse(data);
                if (res.statusCode === 200) {
                    console.log("\n✅ SUCCESS! ได้รับ Access Token แล้ว:");
                    console.log("------------------------------------------------");
                    console.log(json.access_token);
                    console.log("------------------------------------------------");
                    console.log("Login สำเร็จ! ท่านสามารถนำ Token นี้ไปใช้ใน Step ต่อไปได้ครับ");
                } else {
                    console.log("\n❌ FAILED. Response:");
                    console.log(json);
                    console.log("\nคำแนะนำ: อาจจะต้องใช้ Consumer ID/Secret ของท่านเองจากหน้า 'My Apps' > 'รายละเอียด'");
                }
            } catch (e) {
                console.log("Error parsing response:", data);
            }
        });
    });

    req.on('error', (e) => {
        console.error(`problem with request: ${e.message}`);
    });

    // Write data to request body
    req.write(postData);
    req.end();
}

getKBankToken();
