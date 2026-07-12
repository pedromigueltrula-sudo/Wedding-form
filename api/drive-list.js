export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { pageToken } = req.query;

        const response = await fetch(process.env.GOOGLE_APPS_SCRIPT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'list',
                pageToken: pageToken || ""
            })
        });

        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error);
        }

        return res.status(200).json({
            files: data.files || [],
            nextPageToken: data.nextPageToken,
        });

    } catch (err) {
        console.error('Drive list error:', err);
        return res.status(500).json({ error: 'Error fetching gallery files' });
    }
}
