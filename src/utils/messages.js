// utils/messages.js

const { MessageMedia, Buttons, List } = require('whatsapp-web.js');

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

      // Fungsi baru: kirim list
  sendWelcomeList: async (msg) => {
    try {
      const sections = [
        {
          title: 'Menu Utama',
          rows: [
            {
              id: 'mulaiRow',
              title: 'Mulai',
              description: 'Lanjutkan ke step pendaftaran'
            },
            {
              id: 'infoRow',
              title: 'Info Lain',
              description: 'Informasi tambahan'
            },
          ],
        },
      ];

      const listMessage = new List(
        'Halo Sahabat Carlo! Silakan pilih menu di bawah:',
        'Pilih', // Teks tombol (harus diisi)
        sections,
        'Judul Pesan (opsional)',
        'Footer Pesan (opsional)',
      );

      await msg.reply(listMessage);
    } catch (err) {
      console.error('Failed to send list message:', err.message);
    }
  },



  sendWelcomeMessage: async (msg) => {
    try {
        // Lokasi file gambar syarat dan ketentuan
        const imagePath = './public/carloterms2.jpg';
        const media = MessageMedia.fromFilePath(imagePath);

        // Pesan teks dengan format rapi
        const caption = `
Halo Sahabat Carlo! Selamat datang di layanan *Carloship*.

Layanan ini merupakan layanan pengiriman obat yang dikhususkan untuk pasien yang aktif mengambil obat di Ruang Carlo.

Sebelum menggunakan layanan CarloShip, mohon untuk membaca syarat dan ketentuan yang berlaku pada gambar di atas.

Ketik *Setuju* jika Anda memahami dan menyetujui syarat dan ketentuan yang berlaku.
        `.trim(); // Menghapus spasi ekstra di awal dan akhir teks

        // Kirim gambar beserta teks
        await msg.reply(media, null, { caption });
    } catch (err) {
        console.error("Failed to send welcome message:", err.message);
    }
},
    
    sendWelcomeButton: async (msg) => {
        try {
          const buttons = new Buttons(
            [
              { body: "Mulai", id: "mulaiBtn" },                 // tombol pertama
              // Anda bisa menambahkan tombol lain, misal:
              // { body: "Info Lain", id: "infoBtn" },
            ],
          );
          await msg.reply(buttons);
        } catch (err) {
          console.error("Failed to send button message:", err.message);
        }
      },
          
    
     sendDataSummary: async (msg, data) => {
        const { name, birthDate, nationalNumber,alamat, weight, remainingMedicine } = data;
        const summary =
            "Apakah Data Anda Sudah Benar?\n" +
            "Jika sudah silahkan ketik *Sudah*, jika belum ketik *Belum*.\n\n" +
            `Nama : ${name}\n` +
            `Tanggal Lahir : ${birthDate}\n` +
            `Nomor KTP : ${nationalNumber}\n` +
            `Alamat: ${alamat}\n`+
            `Berat Badan : ${weight}\n` +
            `Sisa Obat : ${remainingMedicine}`;

        await msg.reply(summary);
    },

    goBackToSummary: async (msg, state) => {
        await module.exports.sendDataSummary(msg, state.data);
        state.step = 6;
        state.editing = false;
    },

    editMessage: async (msg) => {
        const editMessage = `
Bagian mana yang ingin Anda edit?

    1. *Nama Lengkap*
    2. *Tanggal Lahir*
    3. *Nomor KTP*
    4. *Berat Badan*
    5. *Sisa Obat*

Ketik angka sesuai bagian yang ingin diedit, atau ketik *Cancel* untuk membatalkan pengeditan.
    `.trim(); // Menghapus spasi ekstra di awal/akhir

        await msg.reply(editMessage); // Kirim pesan menggunakan reply()
    },
};
