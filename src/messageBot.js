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
                '--window-size=1920x1080',
                  '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
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

   messageClient.on('disconnected', async (reason) => {
  console.log('Disconnected:', reason);
  await messageClient.destroy();
  setTimeout(() => messageClient.initialize(), 5000); // Restart after 5s
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
