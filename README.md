# 🎬 SubCrack - Browser Extension

**SubCrack** adalah ekstensi browser untuk Firefox yang memungkinkan pengguna menyuntikkan file subtitle lokal (`.srt`) langsung ke pemutar video di situs web mana pun. Sangat berguna untuk platform streaming yang tidak menyediakan fitur unggah subtitle sendiri.

## ✨ Fitur Utama

* **Video Finder:** Secara otomatis mendeteksi elemen `<video>` di halaman web melalui sistem highlight interaktif.
* **Local Injection:** Mendukung unggahan file `.srt` langsung dari penyimpanan lokal perangkat kamu.
* **Smart Sync:** Subtitle berjalan sinkron dengan *timestamp* video menggunakan event listener `timeupdate`.
* **Fullscreen Support:** Overlay subtitle tetap muncul dan menyesuaikan posisi saat video masuk ke mode layar penuh.
* **Modern UI:** Antarmuka popup yang bersih dengan efek *backdrop-blur* dan tema gelap yang futuristik.

## 🛠️ Teknologi yang Digunakan

* **JavaScript (ES6+):** Logika utama untuk parsing SRT, injeksi DOM, dan sinkronisasi.
* **Manifest V3:** Menggunakan standar ekstensi terbaru untuk performa dan keamanan optimal.
* **CSS3:** Penataan gaya overlay subtitle dan antarmuka pengguna.

## 🚀 Cara Instalasi (Untuk Developer)

Jika ingin mencoba atau mengembangkan kode ini secara lokal di Firefox:

1. **Clone Repositori:**
   ```bash
   git clone [https://github.com/Dare-desuka/subcrack.git](https://github.com/Dare-desuka/subcrack.git)
   ```
2. **Buka Firefox:**
   Ketik `about:debugging` di address bar.
3. **Load Extension:**
   Klik **"This Firefox"** -> **"Load Temporary Add-on..."** -> Pilih file `manifest.json` dari folder proyek.

## 📦 Cara Build untuk Produksi

1. Pilih semua file di dalam folder proyek (pastikan `manifest.json` ada di root zip).
2. Kompres menjadi file `.zip`.
3. Unggah ke [Mozilla Add-on Developer Hub](https://addons.mozilla.org/en-US/developers/) untuk ditandatangani.
4. Pasang file `.xpi` hasil build ke Firefox kamu.

---
**Author:** onecode

**License:** MIT
