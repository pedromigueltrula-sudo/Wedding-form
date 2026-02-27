// Replace this URL with your published Google Apps Script Web App URL
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyjd43XbMHeL5XtA6H2QMJ1P5D0XRBndH8IQHXgSDxsF4Ls0SNuIqttZBQ3Zt7hSw3a/exec';

export const submitForm = async (formData) => {

    const payload = {
        name: formData.name,
        email: formData.email,
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