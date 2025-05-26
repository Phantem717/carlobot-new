// src/initializeBot.js
const { Client, LocalAuth, Buttons, List } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');


let botClient = null;
let currentQrCode = null; // Variabel untuk menyimpan QR code terbaru


async function initializeBot() {
  if (botClient) {
    // Jika sudah pernah diinisialisasi, kembalikan instance yang ada
    return botClient;
  }

  botClient = new Client({
    authStrategy: new LocalAuth({ clientId: 'my-bot' }),
    puppeteer: {
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        // opsional args lainnya...
      ],
    },
  });

  botClient.on('connection.update', (update) => {
    const { connection } = update;
    if (connection === 'open') {
        currentQrCode = null; // Hapus QR code
        console.log('Connection opened. Bot is now connected.');
    } else if (connection === 'close') {
        console.log('Connection closed. Waiting for reconnection...');
    }
});

  botClient.on('qr', (qr) => {
    console.log('Scan this QR Code to initialize the bot:');
    qrcode.generate(qr, { small: true });
    currentQrCode = qr; // Simpan QR code ke variabel
  });

  botClient.on('ready', () => {
    console.log('WhatsApp bot client is ready!');
    currentQrCode = null; // Hapus QR code ketika bot siap
  });

  botClient.on('auth_failure', (msg) => {
    console.error('Authentication failure:', msg);
    currentQrCode = null; // Hapus QR code ketika bot siap
  });

  botClient.on('disconnected', (reason) => {
    console.log('Bot disconnected:', reason);
    currentQrCode = null; // Reset QR code ketika bot terputus
  });

  await botClient.initialize();
  return botClient;
}

function getCurrentQrCode() {
    return currentQrCode;
  }
  
  async function logoutBot() {
    if (!botClient) {
        console.log('Bot is not initialized yet.');
        return false;
    }

    try {
        // Logout dari sesi WhatsApp jika bot terhubung
        if (botClient.info) {
            await botClient.logout();
            console.log('Bot has been logged out successfully.');
        }

        // Path folder cache autentikasi
        const authPath = path.join(__dirname, '../.wwebjs_auth');
        if (fs.existsSync(authPath)) {
            console.log('Clearing authentication cache...');
            clearDirectory(authPath); // Hapus folder cache
            console.log('Authentication cache has been cleared.');
        } else {
            console.log('No authentication cache found.');
        }

        // Tutup sesi Puppeteer jika masih aktif
        if (botClient.pupBrowser) {
            console.log('Closing Puppeteer browser session...');
            await botClient.pupBrowser.close();
        }

        botClient = null; // Reset bot client
        currentQrCode = null; // Reset QR code

        console.log('Reinitializing bot...');
        await initializeBot(); // Inisialisasi ulang bot
        console.log('Bot reinitialized successfully.');
        return true;
    } catch (err) {
        console.error('Failed to log out:', err.message);
        return false;
    }
}

// Fungsi untuk mengecek apakah bot terhubung
function isBotConnected() {
    return botClient && botClient.info && botClient.info.wid ? true : false;
}

function clearDirectory(directoryPath) {
    if (fs.existsSync(directoryPath)) {
        fs.readdirSync(directoryPath).forEach((file) => {
            const curPath = path.join(directoryPath, file);
            if (fs.lstatSync(curPath).isDirectory()) {
                clearDirectory(curPath); // Rekursif untuk folder
            } else {
                fs.unlinkSync(curPath); // Hapus file
            }
        });
        fs.rmdirSync(directoryPath); // Hapus folder setelah isinya kosong
    }
}


module.exports = { initializeBot, getCurrentQrCode, logoutBot, isBotConnected, clearDirectory  };
