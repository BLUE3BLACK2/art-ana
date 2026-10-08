# art-ana

Prototype toko art print untuk tugas React. Semua 16 gambar berada di `my-app/public/images/paintings`.

## Menjalankan

Dari folder `ecommerce`:

```powershell
npm install
npm run dev
npm run build
npm run lint
npm run test
```

## Fitur dan batasan

- Katalog dengan pencarian, pengurutan, serta filter era, asal, subjek, harga awal, seniman, dan stok. Filter ukuran dihapus; ukuran dipilih pada detail karya.
- Detail karya, pilihan ukuran cetak, harga per ukuran, rating bintang, dan komentar.
- Harga contoh katalog Rp240–450 juta; harga per ukuran sampai Rp990 juta, tetap di bawah Rp1 miliar per cetakan. Jumlah total pesanan dapat lebih besar jika membeli beberapa cetakan.
- Keranjang dengan jumlah per ukuran dan batas stok gabungan; ongkir Rp25.000, gratis mulai Rp500.000.
- Checkout simulasi: pesanan dicatat, keranjang dikosongkan, stok browser berkurang. Tidak ada pembayaran atau pengiriman sungguhan.
- Tema terang/gelap dengan palet UI abu-abu dan putih; ikon dari `lucide-react`.

Data katalog, keranjang, ulasan, stok simulasi, pesanan, dan tema disimpan di `localStorage`. Data tidak dibagikan antar browser/perangkat dan dapat hilang bila penyimpanan situs dihapus. Pengunjung tidak perlu login. Ini bukan database/server yang aman untuk produksi. Nama, email, dan alamat checkout tidak disimpan; gunakan data contoh saat demonstrasi.

## Admin studio

Buka `/admin` atau `/admin/login` pada alamat server yang sedang berjalan (contoh `http://127.0.0.1:5175/admin`). Login demo: username `admin`, password `Artana2026!`. Sesi disimpan di `sessionStorage`; tombol **Sign out** mengakhiri sesi di tab itu. Kredensial ini publik di frontend, bukan autentikasi aman atau proteksi produksi.

- **Overview**: jumlah lukisan, pesanan, ulasan, nilai pesanan demo, dan pesanan terbaru.
- **Artworks**: cari, tambah, edit, dan hapus lukisan dengan konfirmasi. Atur judul, seniman, kategori, asal, deskripsi, atribusi, harga awal, dan stok tersedia. Form tambah dimulai tanpa gambar bawaan; tombol **Upload artwork image** memilih PNG/JPEG/WebP milik sendiri dari perangkat (maksimal 1 MB) dan menampilkan preview. Tidak perlu memilih gambar katalog. Saat edit, gambar lama tetap ada sampai diganti melalui **Replace artwork image**.
- Kartu admin memakai komponen kartu galeri yang sama. Klik di mana saja pada kartu membuka `/admin/artworks/:id`; tombol edit/hapus tetap menjalankan aksinya sendiri. Detail tetap memakai layout admin, termasuk setelah refresh, dan tombol kembali mempertahankan pencarian di daftar. Katalog publik tetap membuka `/product/:id`.
- **Orders**: cari/filter, lihat detail item dan total, ubah status Pending/Processing/Shipped/Completed/Cancelled. Status hanya pencatatan, tidak memproses pembayaran/pengiriman atau otomatis mengembalikan stok; sesuaikan stok di Artworks bila perlu.
- **Reviews**: cari/filter, sembunyikan/tampilkan atau hapus ulasan dengan konfirmasi. Ulasan tersembunyi tidak tampil di galeri atau memengaruhi rating.
- Perubahan katalog memengaruhi galeri, detail, filter, harga cart, dan stok dalam browser ini. Riwayat pesanan menyimpan judul/gambar/harga saat checkout dan tetap ada jika lukisannya dihapus. Penghapusan lukisan menghapus cart dan ulasannya.
- Harga awal admin dibatasi Rp100–450 juta agar seluruh ukuran tetap di bawah Rp1 miliar. Penyimpanan gambar mengikuti kapasitas browser; peringatan muncul jika penyimpanan gagal.

Login menggunakan posisi gambar Muscle Lisa di kiri dan formulir di kanan (bertumpuk di layar kecil). Admin dan login memakai palet abu-abu/putih, logo bersama, ikon Lucide, dan tema terang/gelap seperti galeri. Backend, database, otorisasi server, dan autentikasi sungguhan belum diterapkan.

Panel kredensial di login dan label “demo” pada antarmuka admin dihilangkan untuk presentasi yang lebih profesional. Kredensial dan batasan teknis tetap dicatat di README ini; perubahan teks bukan peningkatan keamanan.

Harga, stok, dan ukuran adalah contoh produk **cetakan tanpa bingkai**, bukan klaim harga/ukuran kanvas asli. Atribusi adaptasi/parodi dijelaskan pada detail karya. Hak penggunaan gambar dan izin reproduksi belum diverifikasi; jangan gunakan katalog ini untuk penjualan nyata tanpa izin yang sesuai.

## Letak konsep wajib React

| Konsep | Contoh implementasi |
| --- | --- |
| Component | `Hero`, `PaintingCard`, `Reviews`, `QuantityControl`, `OrderSummary` |
| Passing props | `painting` ke `PaintingCard`/`Reviews`, nilai dan callback ke `QuantityControl` |
| Conditional rendering | Hasil filter kosong, keranjang kosong, stok habis, konfirmasi pesanan, ikon tema |
| `useState` | Filter dan pencarian, ukuran/jumlah, rating, tema dan data toko |
| `useContext` | `useShop()` membagikan keranjang, ulasan, stok, pesanan, serta tema antar halaman |

## File utama

- `my-app/src/data/paintings.js`: ubah judul, seniman, kategori, gambar, harga, ukuran, dan stok di sini.
- `my-app/src/data/printoptions.js`: daftar ukuran cetak dan pengali harganya.
- `my-app/src/context/shop.js`: definisi Context dan hook `useShop`.
- `my-app/src/context/shopcontext.jsx`: `ShopProvider`, state bersama dan penyimpanan browser.
- `my-app/src/lib/shop.js`: perhitungan harga, ongkir, batas stok, validasi data, dan pembuatan pesanan.
- `my-app/src/lib/admin.js`: validasi katalog, CRUD, moderasi ulasan, status pesanan, migrasi data, dan kredensial demo.
- `my-app/src/pages/adminpages/`: login, overview, pengelolaan lukisan/pesanan/ulasan, serta informasi proyek.
- `my-app/src/pages/frontpages/dashboard.jsx`: katalog, pencarian, filter, dan pengurutan.
- `my-app/src/pages/frontpages/productdetail.jsx`: detail dan pilihan pembelian.
- `my-app/src/components/reviews.jsx`: formulir rating/komentar dan daftar ulasan.
- `my-app/src/pages/frontpages/cart.jsx`: isi keranjang, ubah jumlah, hapus barang.
- `my-app/src/pages/frontpages/checkout.jsx`: validasi formulir dan konfirmasi simulasi.
- `my-app/src/index.css`: token warna kedua tema dan tata letak responsif.
- `my-app/tests/shop.test.js`: pengujian logika toko dengan Node test runner.
- `my-app/tests/admin.test.js`: pengujian CRUD, stok, histori pesanan, moderasi, validasi, dan pemulihan katalog setelah refresh.

Composer mengelola paket PHP, bukan database. Backend PHP + database bisa menjadi pengembangan berikutnya, tetapi belum diperlukan untuk demonstrasi konsep React ini.

Deployment, tautan portofolio, dan laporan tugas tetap perlu diselesaikan terpisah. Untuk deployment SPA dengan BrowserRouter, hosting perlu mengarahkan URL halaman seperti `/product/1` ke `index.html`.
