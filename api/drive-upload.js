export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { filename, mimeType, size } = req.body;
        if (!filename || !mimeType) {
            return res.status(400).json({ error: 'Missing filename or mimeType' });
        }

        const protocol = req.headers['x-forwarded-proto'] || 'http';
        const host = req.headers['x-forwarded-host'] || req.headers.host;
        const defaultOrigin = `${protocol}://${host}`;
        const origin = req.headers.origin || defaultOrigin;

        // Fetch to Apps Script
        const response = await fetch(process.env.GOOGLE_APPS_SCRIPT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'upload_init',
                filename,
                mimeType,
                size,
                origin
            })
        });

        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error);
        }

        return res.status(200).json({ uploadUrl: data.uploadUrl });
    } catch (err) {
        console.error('Drive upload init error:', err);
        return res.status(500).json({ error: 'Error initializing upload session' });
    }
}
