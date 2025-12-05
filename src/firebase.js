import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

// KONFIGURASI FIREBASE
// PENTING: Agar Voice Note bisa disimpan online dan dibuka di HP lain, 
// kamu HARUS mengganti kode di bawah ini dengan konfigurasi Firebase kamu sendiri.
// 
// CARA MENDAPATKANNYA:
// 1. Buka https://console.firebase.google.com/
// 2. Klik "Add Project" (Buat Project Baru), beri nama (misal: BucinWebsite), ikuti langkahnya.
// 3. Setelah jadi, klik icon web (</>) di halaman dashboard project.
// 4. Beri nama app, lalu copy bagian properties di dalam variable firebaseConfig.
// 5. Paste & Ganti bagian di bawah ini.

const firebaseConfig = {
    apiKey: "API_KEY_HARUS_DIISI",
    authDomain: "PROJECT_ID.firebaseapp.com",
    projectId: "PROJECT_ID",
    storageBucket: "PROJECT_ID.appspot.com",
    messagingSenderId: "SENDER_ID",
    appId: "APP_ID"
};

// Error handling biar gak blank kalau belum disetting
let storage = null;
let db = null;

try {
    // Hanya inisialisasi jika config sudah diganti (tanda sederhana: 'API_KEY_HARUS_DIISI' sudah dihapus)
    // Tapi untuk sekarang kita init aja, nanti errornya ditangkap pas dipake
    const app = initializeApp(firebaseConfig);
    storage = getStorage(app);
    db = getFirestore(app);
} catch (error) {
    console.error("Firebase belum disetting dengan benar:", error);
}

export { storage, db };
