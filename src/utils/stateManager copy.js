// utils/stateManager.js
const userState = {};

function getState(chatId) {
    if (!userState[chatId]) {
        userState[chatId] = {
            step: 0,
            data: {},
            editing: false
        };
    }
    return userState[chatId];
}

function resetState(chatId) {
    delete userState[chatId];
}

module.exports = {
    getState,
    resetState
};
