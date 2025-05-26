const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

let messageClient = null;

const initializeMessageBot = async () => {
    if (messageClient) {
        console.log('Message bot is already initialized!');
        return messageClient;
    }

    messageClient = new Client({
        authStrategy: new LocalAuth({ clientId: 'message-bot' }),
        puppeteer: {
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--disable-gpu',
                '--window-size=1920x1080'
            ],
            },
    });

    // Tampilkan QR Code di terminal menggunakan qrcode-terminal
    messageClient.on('qr', (qr) => {
        console.log('Scan this QR Code to initialize the bot:');
        qrcode.generate(qr, { small: true }); // Menampilkan QR code dalam bentuk kecil
    });

    messageClient.on('ready', () => {
        console.log('Message bot is ready!');
    });

    messageClient.on('auth_failure', (msg) => {
        console.error('Authentication failure for message bot:', msg);
    });

    messageClient.on('disconnected', (reason) => {
        console.log('Message bot disconnected:', reason);
        messageClient = null; // Reset instance on disconnect
    });

    await messageClient.initialize();
    return messageClient;
};

const getMessageBotClient = () => {
    if (!messageClient) {
        throw new Error('Message bot is not initialized!');
    }
    return messageClient;
};

module.exports = { initializeMessageBot, getMessageBotClient };
