const express = require('express');
const router = express.Router();
const { logoutBot } = require('../initializeMessageBot');

// API endpoint untuk logout
router.post('/logout', async (req, res) => {
    try {
        
        const success = await logoutBot();
        if (success) {
            return res.status(200).json({ message: 'Bot logged out successfully.' });
        } else {
            return res.status(500).json({ message: 'Failed to log out the bot.' });
        }
    } catch (err) {
        console.error('Error during logout:', err.message);
        return res.status(500).json({ error: 'An unexpected error occurred during logout.' });
    }
});

module.exports = router;
