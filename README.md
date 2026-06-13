# SIPANGAN EDU — Prototype Aplikasi

Prototype interaktif **SIPANGAN EDU** — *Platform Pengawasan dan Transparansi Program Makan Bergizi Gratis (MBG) Berbasis Mobile untuk Sekolah.*

Dibangun dengan **HTML + Tailwind CSS** (via CDN) dan ikon **Lucide**. Tanpa proses build — tinggal buka.

> Catatan: **Design System, User Flow, dan Panduan TIDAK ada di dalam app ini.** Ketiganya adalah materi proposal dan didokumentasikan terpisah (lihat dokumen 02 Design System, 04 User Flow, 05 Panduan di Notion). App ini fokus pada prototype layar aplikasi saja.

## Cara Menjalankan
1. Ekstrak folder ini.
2. Buka `index.html` di browser (klik dua kali). Butuh internet karena Tailwind/Lucide/Font dimuat via CDN.
3. Klik layar di sidebar, atau gunakan tombol Sebelumnya/Berikutnya. Tombol & bottom-nav di dalam app bisa diklik.

## Tampilan Responsif
Di atas preview ada pilihan **HP / Tablet / Laptop** — klik untuk melihat tampilan menyesuaikan ukuran perangkat. Layout halaman juga otomatis menyesuaikan saat dibuka di layar laptop maupun tablet (sidebar daftar layar berpindah ke atas pada layar sempit).

## Aktor & Alur
- **Admin Pusat (SPPG)** — buat alokasi & jadwal per sekolah, monitoring, verifikasi laporan.
- **Petugas Pengantar** — antar makanan, scan QR sekolah saat tiba.
- **Pihak Sekolah** — lihat jatah & jadwal, tampilkan QR, konfirmasi penerimaan, lapor bila tidak sesuai.

Login demo mengarahkan ke alur sesuai role.

## Bottom Navigation per Role
- **Admin Pusat:** Dashboard · Sekolah · Jadwal · Laporan · Profil
- **Petugas Pengantar:** Beranda · Jadwal · Scan · Riwayat · Profil
- **Pihak Sekolah:** Beranda · Jatah · QR · Laporan · Profil

## Deploy ke GitHub Pages
1. Buat repo baru, upload semua isi folder ini (sudah ada `.nojekyll`).
2. Settings → Pages → Source: branch `main`, folder `/root`.
3. Akses di `https://<username>.github.io/<repo>/`.

## Struktur File
```
sipangan-edu/
├── index.html     # kerangka + sidebar daftar layar + tailwind config
├── app.js         # semua layar prototype + navigasi
├── logo.png       # logo maskot
├── favicon.png
├── .nojekyll
└── README.md
```
