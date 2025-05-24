const express = require('express');
const app = express();
const { Client, LocalAuth } = require('whatsapp-web.js');
const bot = require('./bot'); // Impor logika bot

const PORT = process.env.PORT || 3000;

// Middleware untuk JSON
app.use(express.json());

// Endpoint sederhana untuk memastikan server berjalan
app.get('/', (req, res) => {
    res.send('WhatsApp Bot is Running!');
});

// Jalankan server Express
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Inisialisasi bot WhatsApp
bot();
