const cityData = require('./kota.json');
const cityList = cityData.kota; // This now contains the array of cities

function isValidDate(dateString) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        return false;
    }

    const [year, month, day] = dateString.split('-').map(Number);

    if (year < 1900 || year > 2100) {
        return false;
    }

    if (month < 1 || month > 12) {
        return false;
    }

    const daysInMonth = new Date(year, month, 0).getDate();
    return day >= 1 && day <= daysInMonth;
}

function isValidWeight(weight) {
    const parsedWeight = parseInt(weight, 10);
    return !isNaN(parsedWeight) && parsedWeight > 0 && parsedWeight <= 999 && Number.isInteger(parsedWeight);
}

function isValidRemainingMedication(remainingMedication) {
    const parsedWeight = parseInt(remainingMedication, 10);
    return !isNaN(parsedWeight) && parsedWeight > 0 && parsedWeight <= 999 && Number.isInteger(parsedWeight);
}

function isValidFullName(name) {
    const trimmed = name.trim();
    const words = trimmed.split(/\s+/); 
    if (words.length < 1) {
        return false;
    }
    return /^[A-Za-z\s]+$/.test(trimmed);
}

function isValidNationalNumber(number) {
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