// utils/stateManager.js
const userState = {};
const sessionTimeouts = {}; // Objek untuk menyimpan timeout per sesi

function getState(chatId) {
    if (!userState[chatId]) {
        userState[chatId] = {
            step: 0,
            data: {},
            editing: false
        };
        setSessionTimeout(chatId); // Atur timeout saat sesi dibuat
    }
    return userState[chatId];
}

function resetState(chatId, onSessionExpired) {
    if (userState[chatId]) {
        delete userState[chatId];
        clearTimeout(sessionTimeouts[chatId]); // Hapus timeout jika sesi direset
        delete sessionTimeouts[chatId];
        if (onSessionExpired) {
            onSessionExpired(chatId); // Panggil callback jika ada
        }
    }
}

function setSessionTimeout(chatId, onSessionExpired) {
    clearTimeout(sessionTimeouts[chatId]); // Hapus timeout sebelumnya jika ada
    sessionTimeouts[chatId] = setTimeout(() => {
        console.log(`Session for ${chatId} has been reset due to inactivity.`);
        resetState(chatId, onSessionExpired); // Reset state dan panggil callback
    }, 15 * 60 * 1000); // 15 menit dalam milidetik
}

function refreshSession(chatId, onSessionExpired) {
    if (userState[chatId]) {
        setSessionTimeout(chatId, onSessionExpired); // Perbarui timeout saat ada interaksi
    }
}

module.exports = {
    getState,
    resetState,
    refreshSession,
    setSessionTimeout
};
