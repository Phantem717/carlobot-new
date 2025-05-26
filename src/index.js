// src/app.js
const express = require('express');
const { setupChatbot } = require('./bot');
const { initializeBot } = require('./initializeMessageBot');
const qrRoute = require('./routes/qrRoute'); // Impor route QR code
const logoutRoute = require('./routes/logoutRoute');
const sessionRoute = require('./routes/sessionRoute');


const app = express();
app.use(express.json());

// Endpoint sederhana untuk tes
app.get('/', (req, res) => {
  res.send('WhatsApp Bot is Running!');
});

app.use('/api', logoutRoute);
app.use('/api', qrRoute);
app.use('/api', sessionRoute);

// Contoh route untuk kirim pesan manual
app.post('/api/messages/send', async (req, res) => {
  try {
    const { number, message } = req.body;
    if (!number || !message) {
      return res.status(400).json({ error: 'number and message are required' });
    }
    // Gunakan instance yang sudah siap
    const client = await initializeBot();
    await client.sendMessage(`${number}@c.us`, message);
    return res.json({ status: 'sent' });
  } catch (err) {
    console.error('Error in /api/messages/send:', err.message);
    return res.status(500).json({ error: err.message });
  }
});

// Jalankan chatbot
setupChatbot()
  .then(() => console.log('Chatbot setup complete.'))
  .catch((err) => console.error('Chatbot setup error:', err));

// Jalankan server
const PORT = process.env.PORT || 4000;
// Jalankan server Express
app.listen(PORT, () => {
    console.log(`Server is running on http://172.16.86.21:${PORT}`);
});