const express = require('express');
const sendMessageRoute = require('./sendMessageRoute');

const router = express.Router();

// Tambahkan routes lainnya di sini jika diperlukan
router.use('/', sendMessageRoute);

module.exports = router;
