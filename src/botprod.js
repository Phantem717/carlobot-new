// bot.js
const { Client, LocalAuth } = require('whatsapp-web.js');
const { getState, resetState } = require('./utils/stateManager');
const { sendWelcomeMessage, sendDataSummary, goBackToSummary } = require('./utils/messages');
const {
    isValidDate,
    isValidWeight,
    isValidFullName,
    isValidNationalNumber,
    isValidRemainingMedication
  } = require("./utils/validators");
const { createPatient } = require("./utils/apiV2");


module.exports = function initializeBot() {
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
        ],
    },
});

client.on('qr', (qr) => {
    console.log('QR Code received', qr);
});

client.on('ready', () => {
    console.log('WhatsApp client is ready!');
});

client.on('message', async (msg) => {
    const chatId = msg.from;
    const number = chatId.split('@')[0]; // Ambil hanya bagian nomor
    const state = getState(chatId);

    console.log(`Received message: "${msg.body}" from ${number}, current step: ${state.step}, editing: ${state.editing}`);

    // Cek Stop di awal
    if (msg.body.toLowerCase() === 'stop') {
        await msg.reply("Proses dibatalkan. Jika ingin memulai ulang, ketik 'Mulai'.");
        resetState(chatId);
        return;
    }

    if (state.step === 0) {
        if (msg.body.toLowerCase() !== 'mulai') {
            await sendWelcomeMessage(msg);
        } else {
            await msg.reply(
                "Terima Kasih Untuk Konfirmasi nya \n\n" +
                "Untuk memulai, mohon sebutkan *Nama Lengkap* anda Sesuai dengan KTP anda \n\n"+
                "\n\n Jika anda ingin Berhenti melakukan pelayanan silahkan ketik *Stop* "
            );
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
    } else if (state.step === 2) {
        const birthDate = msg.body.trim();
        if (!isValidDate(birthDate)) {
            await msg.reply(
                "Format tanggal lahir tidak sesuai, ( contoh *1992-08-25*). Silahkan coba lagi. \n\n" +
                "\n\n Jika anda ingin Berhenti melakukan pelayanan silahkan ketik *Stop*"
            );
        } else {
            state.data.birthDate = birthDate;
            if (state.editing) {
                await goBackToSummary(msg, state);
            } else {
                await msg.reply(
                    "Mohon Sebutkan Seluruh no registrasi nasional contohnya *3173051-5134* atau *PXXXXXXXXXX-XXXX* \n\n" +
                    "Jika anda ingin Berhenti melakukan pelayanan silahkan ketik *Stop*"

                );
                state.step = 3;
            }
        }
    } else if (state.step === 3) {
        const nationalNumber = msg.body.trim();
        if (!isValidNationalNumber(nationalNumber)) {
            await msg.reply(
                "Nomor Registrasi Nasional tidak valid. Format yang benar \n\n"+
                 "contohnya *3173051-5134* atau *PXXXXXXXXXX-XXXX Silahkan Coba Kembali* \n\n"+
                "\n\nJika anda ingin Berhenti melakukan pelayanan silahkan ketik *Stop*"

            );
        } else {
            state.data.nationalNumber = nationalNumber;
            if (state.editing) {
                await goBackToSummary(msg, state);
            } else {
                await msg.reply(
                    "Mohon sebutkan Berat Badan anda? contoh *60 kg* \n\n"+
                    "\n\nJika anda ingin Berhenti melakukan pelayanan silahkan ketik *Stop*"
                );
                state.step = 4;
            }
        }
    } else if (state.step === 4) {
        const weightInput = msg.body.trim();
        if (!isValidWeight(weightInput)) {
            await msg.reply(
                "Berat badan tidak valid. Mohon masukkan Angka seperti contoh *1 atau 2 atau 78 atau lainnya*. \n\n" +
                "\n\nJika anda ingin Berhenti melakukan pelayanan silahkan ketik *Stop*"
            );
        } else {
            const weight = parseFloat(weightInput); // Konversi input ke angka
            state.data.weight = weight; // Simpan dengan nama `weight` untuk sesuai dengan API
            if (state.editing) {
                await goBackToSummary(msg, state);
            } else {
                await msg.reply(
                    "Mohon sebutkan Sisa Obat anda Hari ini dengan contoh angka seperti *5* \n\n"+
                    "\n\nJika anda ingin Berhenti melakukan pelayanan silahkan ketik *Stop*"
                );
                state.step = 5;
            }
        }
        } else if (state.step === 5) {
            const remainingMedicine = msg.body.trim();
        if (!isValidRemainingMedication(remainingMedicine)) {
            await msg.reply(
                "Format Data yang anda berikan tidak tepat, Mohon sebutkan Sisa Obat anda Hari ini Seperti contoh angka ini *5 6 14* \n\n" +
                "\n\nJika anda ingin Berhenti melakukan pelayanan silahkan ketik *Stop*"
            );
        } else {
            state.data.remainingMedicine = msg.body.trim();
            if (state.editing) {
                await goBackToSummary(msg, state);
            } else {
                await sendDataSummary(msg, state.data);
                state.step = 6;
            }
        }
    } else if (state.step === 6) {
        const response = msg.body.toLowerCase();
        if (response === 'sudah') {
            // await msg.reply("Terima Kasih! Data anda sedang dalam proses verifikasi. Anda akan dihubungi oleh petugas kami untuk langkah selanjutnya.");

                // Perubahan dimulai disini
                try {
                    // Sertakan nomor telepon ke state.data jika belum ada
                    state.data.phoneNumber = number; 
                    const created = await createPatient(state.data);
                    console.log('Patient created:', created);

                    // Kirim pesan konfirmasi setelah berhasil create patient
                    await msg.reply("Data telah berhasil disimpan ke sistem. Anda akan dihubungi oleh petugas kami untuk langkah selanjutnya.");
                } catch (err) {
                    console.error('Error creating patient:', err.message);
                    await msg.reply("Maaf, terjadi kesalahan saat menyimpan data Anda. Silahkan coba lagi nanti.");
                }
                // Perubahan berakhir disini

            resetState(chatId);
        } else if (response === 'belum') {
            const editMessage = 
                `Bagian mana yang ingin anda edit?
                1. Nama Lengkap
                2. Tanggal Lahir
                3. Nomor Registrasi Nasional
                4. Berat Badan
                5. Sisa Obat

                Ketik angka sesuai bagian yang ingin diedit, atau ketik *cancel* untuk membatalkan pengeditan.`;
            await msg.reply(editMessage);
            state.step = 7;
        } else {
            // Pesan random, tampilkan ringkasan lagi
            await sendDataSummary(msg, state.data);
        }
    } else if (state.step === 7) {
        const input = msg.body.trim().toLowerCase();
        if (input === 'cancel') {
            // Batalkan pengeditan dan tampilkan lagi summary
            await msg.reply("Pengeditan dibatalkan.");
            await sendDataSummary(msg, state.data);
            state.step = 6;
        } else if (/^[1-5]$/.test(input)) {
            const choice = parseInt(input, 10);
            state.editing = true; // Aktifkan mode editing

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
                    message = "Mohon sebutkan Berat Badan anda? contoh *60*";
                    state.step = 4; 
                    break;
                case 5:
                    message = "Mohon sebutkan Sisa Obat anda Hari ini ?";
                    state.step = 5; 
                    break;
            }
            await msg.reply(message);
        } else {
            // Input tidak valid, ulangi daftar opsi
            await msg.reply("Input tidak valid. Mohon ketik angka 1-5 sesuai opsi di atas atau *cancel* untuk membatalkan.");
        }
    }
});

client.initialize();
};