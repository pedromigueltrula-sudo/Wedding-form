// Replace this URL with your published Google Apps Script Web App URL
const SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL';

export const submitForm = async (formData) => {
    if (SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL') {
        console.warn("Script URL not configured. Simulating successful submission for dev.");
        // Faster timeout for dev testing
        return new Promise(resolve => setTimeout(resolve, 400));
    }

    const payload = {
        name: formData.name,
        phone: formData.phone,
        allergies: formData.allergies === 'Sí' ? formData.allergiesDetail : formData.allergies,
        bus: formData.bus,
        accommodationType: formData.accommodationType,
        accommodationSpecific: formData.accommodationSpecific,
        accommodationCompanions: formData.accommodationCompanions,
        accommodationStatus: formData.accommodationStatus
    };

    const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // Because Apps Script handles CORS by redirecting causing fetch to fail otherwise
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    // no-cors means response is opaque, we just assume it worked if no network error
    return response;
};
