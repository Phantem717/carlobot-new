// src/routes/qrRoute.js
const express = require('express');
const { getCurrentQrCode } = require('../initializeMessageBot');
const QRCode = require('qrcode'); // Library untuk konversi QR


const router = express.Router();

// Route untuk mendapatkan QR code
router.get('/qr', async (req, res) => {
    const qrCode = getCurrentQrCode();
    if (!qrCode) {
        return res.status(404).json({ error: 'No QR code available or bot is already connected.' });
    }

    try {
        // Konversi QR code menjadi gambar PNG
        const qrImage = await QRCode.toDataURL(qrCode); // Konversi ke Base64
        const base64Data = qrImage.replace(/^data:image\/png;base64,/, ""); // Hapus prefix Base64
        const imgBuffer = Buffer.from(base64Data, 'base64'); // Konversi ke Buffer

        // Kirimkan sebagai respons gambar PNG
        res.writeHead(200, {
            'Content-Type': 'image/png',
            'Content-Length': imgBuffer.length,
        });
        res.end(imgBuffer);
    } catch (error) {
        console.error('Failed to generate QR image:', error);
        res.status(500).json({ error: 'Failed to generate QR image' });
    }
});

module.exports = router;
