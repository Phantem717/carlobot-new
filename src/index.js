const express = require('express');
const app = express();
const bot = require('./bot'); // Impor logika bot
const sendMessageRoute = require('./routes/sendMessageRoute');
const qrRoute = require('./routes/qr');

const PORT = process.env.PORT || 4000;

// Middleware untuk JSON
app.use(express.json());

// Endpoint sederhana untuk memastikan server berjalan
app.get('/', (req, res) => {
    res.send('WhatsApp Bot is Running!');
});
app.use('/api', qrRoute);

// Gunakan route send-message
app.use('/api/messages', sendMessageRoute);


// Jalankan server Express
app.listen(PORT, () => {
    console.log(`Server is running on http://192.168.6.104:${PORT}`);
});

// Inisialisasi bot WhatsApp
bot();
