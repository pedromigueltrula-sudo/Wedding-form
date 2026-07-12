import crypto from 'crypto';

// In-memory token cache — persists for the lifetime of the serverless instance
let cachedToken = null;
let tokenExpiry = 0;

async function getAccessToken() {
    // Return cached token if still valid (with 5 min buffer)
    if (cachedToken && Date.now() < tokenExpiry - 300000) {
        return cachedToken;
    }

    const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const key = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n');

    const now = Math.floor(Date.now() / 1000);
    const header = { alg: 'RS256', typ: 'JWT' };
    const payload = {
        iss: email,
        scope: 'https://www.googleapis.com/auth/drive.readonly',
        aud: 'https://oauth2.googleapis.com/token',
        iat: now,
        exp: now + 3600
    };

    const encode = (obj) => Buffer.from(JSON.stringify(obj)).toString('base64url');
    const headerB64 = encode(header);
    const payloadB64 = encode(payload);
    const signatureInput = `${headerB64}.${payloadB64}`;

    const sign = crypto.createSign('RSA-SHA256');
    sign.update(signatureInput);
    const signature = sign.sign(key, 'base64url');

    const jwt = `${signatureInput}.${signature}`;

    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`
    });

    const tokenData = await tokenRes.json();
    cachedToken = tokenData.access_token;
    tokenExpiry = Date.now() + (tokenData.expires_in || 3600) * 1000;
    return cachedToken;
}

export default async function handler(req, res) {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { id } = req.query;
    if (!id) {
        return res.status(400).json({ error: 'Missing file id' });
    }

    try {
        const token = await getAccessToken();
        const driveUrl = `https://www.googleapis.com/drive/v3/files/${id}?alt=media`;

        // Parse client Range header; default to first 4MB if none provided
        const MAX_CHUNK = 4 * 1024 * 1024; // 4 MB — safely under Vercel's 4.5 MB limit
        let rangeStart = 0;
        let rangeEnd = '';
        const rangeHeader = req.headers.range;

        if (rangeHeader) {
            const match = rangeHeader.match(/bytes=(\d+)-(\d*)/);
            if (match) {
                rangeStart = parseInt(match[1]);
                rangeEnd = match[2] || '';
            }
        }

        // Cap the chunk size so each response fits within Vercel's body limit
        if (!rangeEnd || (parseInt(rangeEnd) - rangeStart + 1) > MAX_CHUNK) {
            rangeEnd = String(rangeStart + MAX_CHUNK - 1);
        }

        // Fetch the byte range from Google Drive API
        const driveRes = await fetch(driveUrl, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Range': `bytes=${rangeStart}-${rangeEnd}`
            }
        });

        if (!driveRes.ok && driveRes.status !== 206) {
            console.error('Google Drive error:', driveRes.status, await driveRes.text());
            return res.status(driveRes.status).json({ error: `Google Drive returned ${driveRes.status}` });
        }

        // Forward Google's response headers
        const contentType = driveRes.headers.get('content-type') || 'video/mp4';
        res.setHeader('Content-Type', contentType);
        res.setHeader('Accept-Ranges', 'bytes');
        res.setHeader('Cache-Control', 'public, max-age=3600');

        const contentLength = driveRes.headers.get('content-length');
        if (contentLength) {
            res.setHeader('Content-Length', contentLength);
        }

        const contentRange = driveRes.headers.get('content-range');
        if (contentRange) {
            res.setHeader('Content-Range', contentRange);
        }

        // 206 Partial Content for range responses, 200 for full
        res.status(driveRes.status);

        if (req.method === 'HEAD') {
            return res.end();
        }

        // Stream the bytes to the client
        const reader = driveRes.body.getReader();
        try {
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                res.write(Buffer.from(value));
            }
        } finally {
            reader.releaseLock();
        }
        res.end();

    } catch (err) {
        console.error('Drive video stream error:', err);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Error streaming video' });
        }
    }
}
