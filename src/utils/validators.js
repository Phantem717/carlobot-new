// utils/validators.js
const cityData = require('./kota.json');
const cityList = cityData.kota; // This now contains the array of cities

function isValidDate(dateString) {
    // Pertama, cek format YYYY-MM-DD dengan regex
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        return false;
    }

    const [year, month, day] = dateString.split('-').map(Number);

    // Cek rentang tahun misalnya antara 1900 - 2100 (opsional, bisa disesuaikan)
    if (year < 1900 || year > 2100) {
        return false;
    }

    // Cek bulan antara 1 - 12
    if (month < 1 || month > 12) {
        return false;
    }

    // Hitung jumlah hari dalam bulan tersebut
    const daysInMonth = new Date(year, month, 0).getDate();

    // Pastikan hari valid untuk bulan tersebut
    return day >= 1 && day <= daysInMonth;
}

// Validasi Berat Badan (harus angka positif)
function isValidWeight(weight) {
    const parsedWeight = parseInt(weight, 10); // Mengonversi ke integer (basis 10)
    // Periksa apakah angka valid, positif, dan memiliki maksimal 3 digit
    return !isNaN(parsedWeight) && parsedWeight > 0 && parsedWeight <= 999 && Number.isInteger(parsedWeight);
}

function isValidRemainingMedication(remainingMedication) {
    const parsedWeight = parseInt(remainingMedication, 10); // Mengonversi ke integer (basis 10)
    // Periksa apakah angka valid, positif, dan memiliki maksimal 3 digit
    return !isNaN(parsedWeight) && parsedWeight > 0 && parsedWeight <= 999 && Number.isInteger(parsedWeight);
}

// Validasi Nama Lengkap (minimal 2 kata)
function isValidFullName(name) {
    const trimmed = name.trim();
    // Pastikan minimal 2 kata
    const words = trimmed.split(/\s+/); 
    if (words.length < 1) {
        return false;
    }

    // Pastikan hanya huruf dan spasi (A-Z atau a-z), tanpa angka
    // Regex: ^[A-Za-z\s]+$ akan memvalidasi bahwa string hanya berisi huruf dan spasi
    return /^[A-Za-z\s]+$/.test(trimmed);
}

function isValidNationalNumber(number) {
    // Format: 7 sampai 11 karakter alfanumerik, lalu '-', kemudian 4 karakter alfanumerik
    return /^[0-9]{16}$/.test(number);
}

function isValidAddress(address) {
    const addressArr = address.split(',').map(part => part.trim());
    // console.log("address",addressArr, addressArr.length, addressArr[0], addressArr[1], addressArr[2]);
    if (addressArr.length != 3 || addressArr[0] == "" || addressArr[1] == "" || addressArr[2] == "") {
        // console.log("INCORRECT ADDRESS STRUCTURE");
        return false;
    }

   const postalCode = addressArr[1];
    if (postalCode.length !== 5 || !/^1\d{4}$/.test(postalCode)) {
        return false;
    }

    const normalizedCityList = cityList.map(city => city.toLowerCase().trim());
    // console.log("normalizedCityList", normalizedCityList, "RESULT", normalizedCityList.includes(addressArr[2].toLowerCase().trim()));
    return normalizedCityList.includes(addressArr[2].toLowerCase().trim());
}


module.exports = {
    isValidDate,
    isValidWeight,
    isValidFullName,
    isValidNationalNumber,
    isValidRemainingMedication,
    isValidAddress
};
