const express = require('express');
const router = express.Router();
const { getMessageBotClient, initializeMessageBot } = require('../messageBot');

// Token yang diizinkan
const ALLOWED_TOKEN = '$2y$10$G2YsCsX27x2H76Za7wAgAOhLczmK/wwc3wRJa7lEb6TYp6/VqWgaC';

// Middleware untuk memeriksa token
const verifyToken = (req, res, next) => {
    const token = req.headers['token'];

    if (!token) {
        return res.status(401).json({ message: 'Token diperlukan dalam header.' });
    }

    if (token !== ALLOWED_TOKEN) {
        return res.status(403).json({ message: 'Token tidak valid.' });
    }

    next(); // Jika token valid, lanjutkan ke handler berikutnya
};

// Endpoint untuk mengirim pesan
router.post('/send-message', verifyToken, async (req, res) => {
    const { number, message } = req.body;

    if (!number || !message) {
        return res.status(400).json({ message: 'Nomor dan pesan diperlukan.' });
    }

    try {
        const client = getMessageBotClient(); // Ambil client dari messageBot.js
        const chatId = `${number}@c.us`; // Format nomor untuk WhatsApp
        await client.sendMessage(chatId, message);

        res.status(200).json({ message: 'Pesan berhasil dikirim.' });
    } catch (error) {
        console.error('Error sending message:', error.message);
        res.status(500).json({ message: 'Gagal mengirim pesan.', error: error.message });
    }
});

// Inisialisasi bot saat server mulai
initializeMessageBot().catch((err) => {
    console.error('Failed to initialize message bot:', err.message);
});

module.exports = router;
