export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { fileId } = req.body;
        if (!fileId) {
            return res.status(400).json({ error: 'Missing fileId' });
        }

        // Use Apps Script (Victoria's account) to set public permissions
        const response = await fetch(process.env.GOOGLE_APPS_SCRIPT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'make_public',
                fileId
            })
        });

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error);
        }

        return res.status(200).json({ success: true });
    } catch (err) {
        console.error('Drive permission error:', err);
        return res.status(500).json({ error: 'Error setting permissions' });
    }
}
