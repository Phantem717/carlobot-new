// utils/api.js
const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000';

async function createPatient(data) {
    // Data yang ingin dikirim berdasarkan struktur yang Anda berikan
    const payload = {
        "patient_name": data.name,
        "birth_date": data.birthDate,
        "phone_number": data.phoneNumber, // perbaikan disini
        "user_weight":data.weight,
        "national_number_registration": data.nationalNumber,
        "status": "Need Verification",
        "user_id": null
    };
    console.log('Sending payload to POST /patients:', payload);


    const response = await fetch(`${BASE_URL}/patients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        throw new Error(`Failed to create patient: ${response.statusText}`);
    }

    return await response.json();
}

async function getPatients() {
    const response = await fetch(`${BASE_URL}/patients`);
    if (!response.ok) {
        throw new Error(`Failed to fetch patients: ${response.statusText}`);
    }
    return await response.json();
}

module.exports = {
    createPatient,
    getPatients
};
