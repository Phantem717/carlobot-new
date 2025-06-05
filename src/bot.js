// bot.js
const { initializeBot } = require('./initializeMessageBot');
const { getState, resetState, refreshSession, setSessionTimeout } = require('./utils/stateManager');
const { sendWelcomeMessage, sendDataSummary, goBackToSummary, sendWelcomeButton, sendWelcomeList,editMessage } = require('./utils/messages');
const {
    isValidDate,
    isValidWeight,
    isValidFullName,
    isValidNationalNumber,
    isValidRemainingMedication,
    isValidAddress
  } = require("./utils/validators");
const { createPatient } = require("./utils/apiV2");


async function setupChatbot() {
    const client = await initializeBot();

      // Kita bungkus semua if-else flow di dalam event handler ini
    client.on('message', async (msg) => {
        const chatId = msg.from;
        const number = chatId.split('@')[0];
        const state = getState(chatId);

    // Refresh sesi setiap kali pesan diterima
    refreshSession(chatId, async (expiredChatId) => {
        // Kirim pesan ke pengguna saat sesi habis
        await client.sendMessage(
            expiredChatId,
            "Sesi Anda telah habis karena tidak ada aktivitas selama 30 menit. Silakan ketik *Mulai* untuk memulai ulang."
        );
    });

    // Cek Stop di awal
    if (msg.body.toLowerCase() === 'stop') {
        await msg.reply("Proses dibatalkan. Jika ingin memulai ulang, ketik 'Mulai'.");
        resetState(chatId);
        return;
    }
    
    if (state.step === 0) {
        if (
            msg.body.toLowerCase() !== 'setuju' &&
            msg.body.toLowerCase() !== 'setuju ' 
        ) {            await sendWelcomeMessage(msg);                        
        } else {
            await msg.reply(`
Terima Kasih atas konfirmasi Anda!

Untuk memulai, mohon sebutkan *Nama Lengkap* Anda sesuai dengan KTP.

Jika Anda ingin berhenti melakukan pelayanan, silakan ketik *Stop*.
                `.trim()); // Menghapus spasi ekstra di awal dan akhir teks
                state.step = 1;
        }
    } else if (state.step === 1) {
            const fullName = msg.body.trim();
            if (!isValidFullName(fullName)) {
                await msg.reply(
                    "Nama lengkap tidak valid. Mohon sebutkan minimal 1 kata dengan benar. \n\n" +
                    "\n\n Jika anda ingin Berhenti melakukan pelayanan silahkan ketik *Stop*"
                );
            } else {
                state.data.name = fullName;
                if (state.editing) {
                    await goBackToSummary(msg, state);
                } else {
                    await msg.reply(
                        "Mohon sebutkan *Tanggal Lahir* anda dengan format *YYYY-MM-DD* ( contoh *1992-08-25*)  \n\n" +
                        "\n\n Jika anda ingin Berhenti melakukan pelayanan silahkan ketik *Stop*"
                    );
                    state.step = 2;
                }
            }
        } 
        else if (state.step === 2) {
            const birthDate = msg.body.trim();
            if (!isValidDate(birthDate)) {
                await msg.reply(
                    "Format tanggal lahir tidak sesuai, (contoh *1992-08-25*). Silahkan coba lagi. \n\n" +
                    "\n\n Jika anda ingin Berhenti melakukan pelayanan silahkan ketik *Stop*"
                );
            } else {
                state.data.birthDate = birthDate;
                if (state.editing) {
                    await goBackToSummary(msg, state);
                } else {
                    await msg.reply(
                        "Mohon Sebutkan Seluruh no NIK contohnya *1234567890123456* \n\n" +
                        "Jika anda ingin Berhenti melakukan pelayanan silahkan ketik *Stop*"
                    );
                    state.step = 3;
                }
            }
        } 
        else if (state.step === 3) {
            const nationalNumber = msg.body.trim();
            if (!isValidNationalNumber(nationalNumber)) {
                await msg.reply(
                    "Nomor NIK tidak valid. Format yang benar \n\n" +
                    "contohnya *1234567890123456* Silahkan Coba Kembali* \n\n" +
                    "\n\nJika anda ingin Berhenti melakukan pelayanan silahkan ketik *Stop*"
                );
            } else {
                state.data.nationalNumber = nationalNumber;
                if (state.editing) {
                    await goBackToSummary(msg, state);
                } else {
                    await msg.reply(
                        "Mohon Sebutkan Alamat Lengkap Anda Sesuai dengan alamat pengiriman anda. \n\n" +
                        "Urutannya Alamat, Kota, Kode Pos \n\n" +
                        "contohnya *Jalan Salemba Raya No. 41, 10440, Jakarta Selatan* \n\n" +
                        "\n\nJika anda ingin Berhenti melakukan pelayanan silahkan ketik *Stop*"
                    );
                    state.step = 4;
                }
            }
        } 
        else if (state.step === 4) {
            const alamat = msg.body.trim();
            if (!isValidAddress(alamat)) {
                await msg.reply(
                    "Alamat tidak valid. Mohon sebutkan Alamat Lengkap Sesuai dengan alamat pengiriman anda. \n\n" +
                    "contohnya *Jalan Salemba Raya No. 41, 10440, Jakarta Selatan* \n\n" +
                    "\n\nJika anda ingin Berhenti melakukan pelayanan silahkan ketik *Stop*"
                );
            } else {
                state.data.alamat = alamat;
                if (state.editing) {
                    await goBackToSummary(msg, state);
                } else {
                    await msg.reply(
                        "Mohon sebutkan Berat Badan anda? contoh *60 kg* \n\n" +
                        "\n\nJika anda ingin Berhenti melakukan pelayanan silahkan ketik *Stop*"
                    );
                    state.step = 5;
                }
            }
        } 
        else if (state.step === 5) {
            const weightInput = msg.body.trim();
            if (!isValidWeight(weightInput)) {
                await msg.reply(
                    "Berat badan tidak valid. Mohon masukkan Angka seperti contoh *1 atau 2 atau 78 atau lainnya*. \n\n" +
                    "\n\nJika anda ingin Berhenti melakukan pelayanan silahkan ketik *Stop*"
                );
            } else {
                const weight = parseFloat(weightInput);
                state.data.weight = weight;
                if (state.editing) {
                    await goBackToSummary(msg, state);
                } else {
                    await msg.reply(
                        "Mohon sebutkan Sisa Obat anda Hari ini dengan contoh angka seperti *5* \n\n" +
                        "\n\nJika anda ingin Berhenti melakukan pelayanan silahkan ketik *Stop*"
                    );
                    state.step = 6;
                }
            }
        } 
        else if (state.step === 6) {
            const remainingMedicine = msg.body.trim();
            if (!isValidRemainingMedication(remainingMedicine)) {
                await msg.reply(
                    "Format Data yang anda berikan tidak tepat, Mohon sebutkan Sisa Obat anda Hari ini Seperti contoh angka ini *5 6 14* \n\n" +
                    "\n\nJika anda ingin Berhenti melakukan pelayanan silahkan ketik *Stop*"
                );
            } else {
                state.data.remainingMedicine = remainingMedicine;
                if (state.editing) {
                    await goBackToSummary(msg, state);
                } else {
                    await sendDataSummary(msg, state.data);
                    state.step = 7;
                }
            }
        } 
        else if (state.step === 7) {
            const response = msg.body.toLowerCase();
            if (response === 'sudah') {
                try {
                    state.data.phoneNumber = number;
                    const created = await createPatient(state.data);
                    console.log('Patient created:', created);
                    await msg.reply("Data telah berhasil disimpan ke sistem. Anda akan dihubungi oleh petugas kami untuk langkah selanjutnya.");
                } catch (err) {
                    console.error('Error creating patient:', err.message);
                    await msg.reply("Maaf, terjadi kesalahan saat menyimpan data Anda. Silahkan coba lagi nanti.");
                }
                resetState(chatId);
            } 
            else if (response === 'belum') {
                const editMessage = 
                    `Bagian mana yang ingin anda edit?
                    1. Nama Lengkap
                    2. Tanggal Lahir
                    3. Nomor Registrasi Nasional
                    4. Alamat
                    5. Berat Badan
                    6. Sisa Obat

                    Ketik angka sesuai bagian yang ingin diedit, atau ketik *cancel* untuk membatalkan pengeditan.`;
                await msg.reply(editMessage);
                state.step = 8;
            } else {
                await sendDataSummary(msg, state.data);
            }
        } 
        else if (state.step === 8) {
            const input = msg.body.trim().toLowerCase();
            if (input === 'cancel') {
                await msg.reply("Pengeditan dibatalkan.");
                await sendDataSummary(msg, state.data);
                state.step = 7;
            } else if (/^[1-6]$/.test(input)) {
                const choice = parseInt(input, 10);
                state.editing = true;

                let message;
                switch(choice) {
                    case 1:
                        message = "Silahkan sebutkan *Nama Lengkap* anda lagi:";
                        state.step = 1;
                        break;
                    case 2:
                        message = "Mohon sebutkan *Tanggal Lahir* anda dengan format *YYYY-MM-DD* ( contoh *1992-08-25* )";
                        state.step = 2;
                        break;
                    case 3:
                        message = "Mohon Sebutkan Seluruh no registrasi nasional contohnya *3173051-5134* ";
                        state.step = 3;
                        break;
                    case 4:
                        message = "Mohon sebutkan Alamat anda? contoh *Jakarta Salemba Raya No. 41 - Jakarta 10440*";
                        state.step = 4;
                        break;
                    case 5:
                        message = "Mohon sebutkan Berat Badan anda? contoh *60*";
                        state.step = 5;
                        break;
                    case 6:
                        message = "Mohon sebutkan Sisa Obat anda Hari ini ?";
                        state.step = 6;
                        break;
                }
                await msg.reply(message);
            } else {
                await msg.reply("Input tidak valid. Mohon ketik angka 1-6 sesuai opsi di atas atau *cancel* untuk membatalkan.");
            }
    }
  });
}
module.exports = { setupChatbot };

