const express = require('express');
const { isBotConnected } = require('../initializeMessageBot');

const router = express.Router();

router.get('/check-session', async (req, res) => {
    try {
        const isConnected = isBotConnected();
        return res.json({
            status: isConnected ? 'connected' : 'disconnected',
        });
    } catch (err) {
        console.error('Error checking session:', err.message);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
