// utils/api.js
const fetch = require('node-fetch');
const FormData = require('form-data');

const BASE_URL = 'http://192.168.6.12/ecarlo_api';
const AUTH_URL = `${BASE_URL}/auth`;
const PATIENT_URL = `${BASE_URL}/pasien`;

// Cache untuk menyimpan token dan waktu kedaluwarsa
let cachedToken = null;
let tokenExpiry = null;

// Fungsi untuk mendapatkan token
async function getAuthToken() {
    const currentTime = Math.floor(Date.now() / 1000); // Waktu saat ini dalam detik

    // Jika token masih ada dan belum kadaluarsa, gunakan token yang ada
    if (cachedToken && tokenExpiry > currentTime) {
        console.log('Menggunakan token yang tersimpan.');
        return cachedToken;
    }

    console.log('Token kadaluarsa atau belum ada, mengambil token baru...');
    const formData = new FormData();
    formData.append('username', 'carlo');
    formData.append('password', 'Carlosian@2024');

    const response = await fetch(AUTH_URL, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        throw new Error(`Failed to authenticate: ${response.statusText}`);
    }

    const result = await response.json();
    cachedToken = result.token;
    tokenExpiry = currentTime + 3600; // Set waktu kedaluwarsa (1 jam dari sekarang)

    console.log('Token baru berhasil diambil.');
    return cachedToken;
}

// Fungsi untuk membuat pasien
async function createPatient(data) {
    const token = await getAuthToken(); // Ambil token dari cache atau server baru
    console.log(token);
    // console.log("DATA", data);

    const formData = new FormData();
    formData.append('nama', data.name);
    formData.append('tanggal_lahir', data.birthDate);
    formData.append('nomor_handphone', data.phoneNumber);
    formData.append('nomor_nik', data.nationalNumber);
    formData.append('tanggal_permintaan', data.requestDate || new Date().toISOString().split('T')[0]);
    formData.append('berat_badan', data.weight);
    formData.append('sisa_obat', data.remainingMedicine);
    formData.append('eligible',0);
    formData.append('alamat',data.alamat)

    // console.log("FORMDATA",formData)
    const response = await fetch(PATIENT_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`, // Sertakan token
        },
        body: formData,
    });

    if (!response.ok) {
        throw new Error(`Failed to create patient: ${response.statusText}`);
    }

    return await response.json();
}

module.exports = {
    createPatient,
};
