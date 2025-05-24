// utils/messages.js

const { MessageMedia } = require('whatsapp-web.js');

module.exports = {
    /*
    sendWelcomeMessage: async (msg) => {
        try {
            await msg.reply(
                "Halo Sahabat Carlo! Selamat datang di layanan pengiriman obat dari Ruang Carlo.\n\n" +
                "Untuk Memulai, mohon untuk membaca syarat dan ketentuan yang berlaku dibawah ini.\n\n" +
                "Ketik *Mulai* jika anda mengerti dan setuju dengan syarat dan ketentuan yang berlaku"
            );
        } catch (err) {
            console.error("Failed to reply:", err.message);
        }
    },*/

    sendWelcomeMessage: async (msg) => {
        try {
            // Buat objek media
            const media = MessageMedia.fromFilePath('./public/carolus.png');
    
            // Kirim pesan dengan gambar dan caption
            await msg.reply(
                media,
                null,
                {
                    caption: 
                        "Halo Sahabat Carlo! Selamat datang di layanan pengiriman obat dari Ruang Carlo.\n\n" +
                        "Untuk Memulai, mohon untuk membaca syarat dan ketentuan yang berlaku gambar.\n\n" +
                        "Ketik *Mulai* jika anda mengerti dan setuju dengan syarat dan ketentuan yang berlaku"
                }
            );
        } catch (err) {
            console.error("Failed to reply:", err.message);
        }
    },
    
    
    sendDataSummary: async (msg, data) => {
        const { name, birthDate, nationalNumber,alamat, weight, remainingMedicine } = data;
        const summary =
            "Apakah Data Anda Sudah Benar?\n" +
            "Jika sudah silahkan ketik *Sudah*, jika belum ketik *Belum*.\n\n" +
            `Nama : ${name}\n` +
            `Tanggal Lahir : ${birthDate}\n` +
            `Nomor Registrasi Nasional : ${nationalNumber}\n` +
            `Alamat: ${alamat}\n`+
            `Berat Badan : ${weight}\n` +
            `Sisa Obat : ${remainingMedicine}`;

        await msg.reply(summary);
    },

    goBackToSummary: async (msg, state) => {
        await module.exports.sendDataSummary(msg, state.data);
        state.step = 6;
        state.editing = false;
    }
};
