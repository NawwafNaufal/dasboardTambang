# Dokumentasi Dashboard Tambang (Productivity Feature)

Aplikasi Dashboard Tambang dirancang untuk memantau, menganalisis, dan memvisualisasikan produktivitas operasional tambang di beberapa lokasi (seperti Tonasa, LSB, UTSG, dan Padang). Aplikasi ini mengintegrasikan data dari Google Sheets secara otomatis ke dalam database MongoDB, lalu menyajikannya dalam bentuk grafik interaktif di frontend.

---

## 📂 Arsitektur & Struktur Proyek

Proyek ini dibangun menggunakan arsitektur monorepo dengan pemisahan penuh antara backend (API) dan frontend (SPA).

```
.
├── backend/                  # Server REST API (Express & TypeScript)
│   ├── src/                  # Kode sumber backend
│   │   ├── main.ts           # Entry point aplikasi backend
│   │   └── ...
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
├── frontend/                 
│   └── vite-project/         # Single Page Application (React, Vite & Tailwind)
│       ├── src/              # Kode sumber frontend
│       ├── index.html
│       ├── Dockerfile
│       ├── package.json
│       └── vite.config.ts
├── docker-compose.yml        # Konfigurasi orkestrasi Docker
├── .env.example              # Template konfigurasi environment variables
└── README.md                 # Dokumentasi proyek
```

---

## ⚙️ Konfigurasi Environment Variables (`.env`)

Sebelum menjalankan aplikasi, Anda wajib membuat file `.env` di root direktori dengan menyalin `.env.example`. Berikut adalah detail variabel yang perlu dikonfigurasi:

### 1. Konfigurasi Server
* `PORT`: Port yang digunakan oleh server backend (Default: `4000`).

### 2. Kredensial Google Service Account (Akses API Google Sheets)
Digunakan oleh backend untuk melakukan autentikasi ke Google Drive & Sheets API:
* `TYPE`: Tipe akun (biasanya `service_account`).
* `PROJECT_ID`: ID project di Google Cloud Platform.
* `PRIVATE_KEY_ID`: ID private key Google service account.
* `PRIVATE_KEY`: Private key lengkap (termasuk header `-----BEGIN PRIVATE KEY-----` dan akhiran `-----END PRIVATE KEY-----`).
* `CLIENT_EMAIL`: Email service account yang diberi akses edit/read pada Google Sheets.
* `CLIENT_ID`: ID unik klien service account.
* `AUTH_URI`, `TOKEN_URI`, `AUTH_PROVIDER_X509_CERT_URL`, `CLIENT_X509_CERT_URL`: URL endpoint OAuth2 bawaan Google.

### 3. Google Spreadsheet IDs
ID unik Google Spreadsheet untuk masing-masing lokasi tambang (dapat ditemukan di URL Spreadsheet):
* `ID_SPREADSHEETS_TONASA`
* `ID_SPREADSHEETS_LSB`
* `ID_SPREADSHEETS_UTSG`
* `ID_SPREADSHEETS_PADANG`

### 4. Database (MongoDB)
* `MONGO_ROOT_USER`: Username admin database MongoDB.
* `MONGO_ROOT_PASSWORD`: Password admin database MongoDB.
* `MONGO_DB_NAME`: Nama database (Default: `dataTambang`).
* `MONGO_URI`: URI koneksi lengkap.
  * Gunakan `mongodb://admin:admin123@mongo:27017/dataTambang?authSource=admin` untuk Docker Compose.
  * Gunakan `mongodb://admin:admin123@localhost:27017/dataTambang?authSource=admin` jika database berjalan secara lokal (non-Docker).

---

## 📊 Panduan Integrasi & Sinkronisasi Google Sheets

Aplikasi ini menggunakan **Google Sheets API** untuk mengambil data dari spreadsheet Anda secara berkala dan menyimpannya ke MongoDB. Berikut langkah menghubungkan spreadsheet dari akun Google Anda ke aplikasi:

### Langkah 1: Bagikan Akses Spreadsheet ke Service Account
Aplikasi ini membaca spreadsheet melalui perantara akun layanan (Service Account) yang alamat emailnya dikonfigurasi di file `.env` pada variabel `CLIENT_EMAIL`.
1. Buka file `.env` Anda dan salin nilai dari `CLIENT_EMAIL` (formatnya menyerupai: `nama-akun@nama-project.iam.gserviceaccount.com`).
2. Buka file Google Spreadsheet Anda di browser.
3. Klik tombol **Share (Bagikan)** di sudut kanan atas.
4. Tempelkan email `CLIENT_EMAIL` tadi ke kolom input pengguna.
5. Berikan hak akses sebagai **Viewer** (karena aplikasi hanya perlu membaca data/`readonly`).
6. *Matikan opsi mengirim notifikasi/email jika ada*, lalu klik **Share/Bagikan**.

### Langkah 2: Salin Spreadsheet ID ke file `.env`
Setiap dokumen spreadsheet memiliki kode ID unik di alamat URL-nya.
1. Salin ID spreadsheet dari URL browser Anda. Format URL spreadsheet adalah sebagai berikut:
   `https://docs.google.com/spreadsheets/d/`**[ID_SPREADSHEET_DI_SINI]**`/edit#gid=0`
   *Salin kode acak panjang di antara `/d/` dan sebelum `/edit`.*
2. Buka file `.env` proyek Anda, lalu masukkan ID tersebut pada variabel yang sesuai dengan nama site tambang:
   ```env
   ID_SPREADSHEETS_TONASA=id_dari_spreadsheet_tonasa
   ID_SPREADSHEETS_LSB=id_dari_spreadsheet_jakamitra
   ID_SPREADSHEETS_UTSG=id_dari_spreadsheet_site_sale
   ID_SPREADSHEETS_PADANG=id_dari_spreadsheet_semen_padang
   ```

### Langkah 3: Sesuaikan Struktur Nama Tab (Sheet)
Backend membaca tab spesifik berdasarkan modul produktivitas. Pastikan di dalam dokumen Spreadsheet Anda terdapat tab (sheet) dengan nama persis seperti berikut:
* **`Sheet1`**: Berisi data **PRODUKSI** (Range pembacaan: `Sheet1!A1:ZZ500`)
* **`Drilling`**: Berisi data **DRILLING** (Range pembacaan: `Drilling!A1:ZZ500`)
* **`Loading`**: Berisi data **LOADING** (Range pembacaan: `Loading!A1:ZZ500`)
* **`Hauling`**: Berisi data **HAULING** (Range pembacaan: `Hauling!A1:ZZ500`)
* **`Supporting`**: Berisi data **SUPPORTING** (Range pembacaan: `Supporting!A1:ZZ500`)

---

## 🔄 Panduan Transfer Kepemilikan & Handover (Serah-Terima)

Jika Anda ingin memindahkan kepemilikan Google Spreadsheet sepenuhnya ke akun Google orang/organisasi lain dan menghapus akses akun pribadi Anda dari file tersebut, ikuti langkah-langkah berikut:

### Langkah 1: Transfer Kepemilikan di Google Sheets
1. Buka Google Spreadsheet terkait.
2. Klik tombol **Share (Bagikan)** di sudut kanan atas.
3. Undang email pemilik baru sebagai **Editor**, lalu kirim/simpan.
4. Klik **Share (Bagikan)** kembali, temukan email pemilik baru tersebut pada daftar, lalu klik menu *dropdown* akses di samping namanya (yang bertuliskan "Editor").
5. Pilih **Transfer ownership (Pindahkan kepemilikan)**, lalu klik **Send invitation (Kirim undangan)**.

### Langkah 2: Konfirmasi Pemilik Baru
1. Pemilik baru harus masuk ke email/Google Drive mereka dan **menyetujui (accept)** undangan transfer kepemilikan tersebut.
2. Setelah disetujui, pemilik baru tersebut akan resmi berstatus sebagai **Owner (Pemilik)** dan status Anda akan turun menjadi **Editor**.

### Langkah 3: Hapus Akses Akun Lama
1. Pemilik baru (atau Anda sendiri) dapat membuka menu **Share (Bagikan)** kembali.
2. Klik *dropdown* akses di samping alamat email pribadi lama Anda, lalu pilih **Remove access (Hapus akses)**.
3. Anda kini telah sepenuhnya terlepas dari kepemilikan file tersebut.

> [!IMPORTANT]
> **Hal Penting yang Wajib Diperiksa Setelah Transfer:**
> * **Akses Service Account:** Pastikan pemilik baru **tidak menghapus** alamat email `CLIENT_EMAIL` (Google Service Account) dari daftar bagikan spreadsheet. Akun tersebut harus tetap terdaftar sebagai **Viewer** agar backend dashboard tetap dapat mengambil data.
> * **ID Spreadsheet:** Selama dokumen asli dipindahkan (bukan diduplikasi), ID Spreadsheet tidak akan berubah dan tidak perlu mengubah konfigurasi `.env`. Jika pemilik baru menduplikasi spreadsheet menjadi dokumen baru, pemilik baru wajib memasukkan ID spreadsheet baru tersebut ke dalam file `.env`.

---

## 📋 Informasi Penting & Checklist Handover untuk Pemilik Baru

Bagian ini ditujukan khusus untuk **Pemilik Baru** yang akan mengambil alih pemeliharaan (*maintenance*) dan pengelolaan sistem setelah proses serah-terima selesai:

### 1. Pengelolaan Google Cloud Platform (GCP) & Service Account
Kredensial Service Account yang saat ini terpasang di file `.env` (`CLIENT_EMAIL`, `PRIVATE_KEY`, dll.) terdaftar di Google Cloud Project milik pengembang sebelumnya.
* **Tindakan Sangat Penting:**
  * Jika akun Google pribadi pengembang sebelumnya dihapus atau dinonaktifkan, Service Account yang lama akan otomatis kedaluwarsa. Hal ini akan menyebabkan sinkronisasi data dari Google Sheets terhenti.
  * **Solusi A:** Tambahkan email pemilik baru sebagai **Owner** pada GCP Project terkait agar memiliki akses administrasi penuh terhadap kunci API.
  * **Solusi B (Disarankan):** Pemilik baru membuat proyek GCP baru, mengaktifkan Google Sheets API, membuat Service Account baru, mengunduh file kunci JSON (`.json`), lalu memperbarui seluruh variabel konfigurasi Google Cloud (`TYPE`, `PROJECT_ID`, `PRIVATE_KEY`, dll.) di dalam file `.env`.

### 2. Manajemen Konfigurasi `.env` Produksi
* File `.env` berisi data sensitif dan dilarang untuk diunggah ke Git repository (sengaja dikecualikan melalui `.gitignore`).
* Pemilik baru harus mencatat dan mengamankan salinan variabel `.env` ini secara mandiri untuk proses migrasi atau pemulihan bencana (*disaster recovery*).

### 3. Backup & Restore Database (MongoDB)
Data transaksi dan produktivitas tersimpan di MongoDB. Lakukan backup berkala dengan metode berikut:
* **Backup Data via Docker:**
  ```bash
  docker exec -t mongo mongodump --username <MONGO_ROOT_USER> --password <MONGO_ROOT_PASSWORD> --authenticationDatabase admin --db dataTambang --out /data/db/backup
  ```
* **Restore Data via Docker:**
  ```bash
  docker exec -t mongo mongorestore --username <MONGO_ROOT_USER> --password <MONGO_ROOT_PASSWORD> --authenticationDatabase admin --db dataTambang /data/db/backup/dataTambang
  ```

### 4. Pemantauan Penyimpanan Disk (Disk Space Maintenance)
* Backend menyimpan log harian di direktori `backend/logsDasboard/`.
* Pemilik baru wajib memeriksa kapasitas disk server secara berkala untuk menghindari server macet akibat disk penuh (*disk space exhausted*).

---

## 🚀 Pengembangan Lokal (Development Mode)

### Metode A: Menggunakan Docker Compose (Direkomendasikan)

Metode ini otomatis membangun dan menghubungkan database MongoDB, Backend, dan Frontend tanpa perlu menginstal dependensi lokal.

1. **Salin file konfigurasi env:**
   ```bash
   cp .env.example .env
   ```
2. **Jalankan Docker Compose:**
   ```bash
   docker compose up -d --build
   ```
3. **Alamat Akses:**
   * **Frontend Dashboard:** [http://localhost:5173](http://localhost:5173)
   * **Backend API:** [http://localhost:4000](http://localhost:4000)

Untuk menghentikan semua layanan:
```bash
docker compose down
```

---

### Metode B: Menjalankan Secara Lokal (Tanpa Docker)

#### Prasyarat Lokal:
* Node.js versi 18 atau lebih baru.
* Database MongoDB yang sedang berjalan secara lokal di port `27017`.

#### Langkah-langkah:
1. Pastikan nilai `MONGO_URI` di file `.env` mengarah ke database lokal (`localhost`).
2. **Jalankan Backend:**
   ```bash
   cd backend
   npm install
   npm run dev
   ```
3. **Jalankan Frontend:**
   ```bash
   cd ../frontend/vite-project
   npm install
   npm run dev
   ```

---

## 🌐 Panduan Deployment Produksi (Production Deployment Guide)

Untuk men-deploy aplikasi ini ke server produksi (seperti VPS Ubuntu/Debian, AWS, GCP, dll.), terdapat dua metode utama yang direkomendasikan:

### Metode 1: Menggunakan Docker (Direkomendasikan)
Sangat cocok untuk deployment cepat dan konsisten di server produksi.

1. **Persiapan Server:**
   Pastikan server Anda sudah terinstal **Docker** dan **Docker Compose**.
2. **Konfigurasi Environment:**
   Siapkan file `.env` di root server dengan variabel produksi yang valid.
3. **Jalankan Layanan:**
   Gunakan file `docker-compose.yml` bawaan untuk melakukan build & run:
   ```bash
   docker compose up -d --build
   ```
   *Layanan akan otomatis berjalan di background dan melakukan restart sendiri (`restart: always`) apabila server mati/reboot.*

---

### Metode 2: Deployment Manual (Tanpa Docker)

Metode ini direkomendasikan jika Anda ingin menggunakan server web eksternal (seperti Nginx) dan pengelola proses Node.js.

#### Langkah 1: Build & Jalankan Backend dengan PM2
Agar backend berjalan stabil di background dan memiliki fitur auto-restart:
1. Masuk ke folder backend, instal dependensi produksi, dan lakukan kompilasi TypeScript:
   ```bash
   cd backend
   npm install --omit=dev
   npm run build
   ```
2. Pasang **PM2** secara global di server dan jalankan backend:
   ```bash
   npm install -g pm2
   pm2 start dist/main.js --name "dashboard-backend"
   pm2 save
   pm2 startup
   ```

#### Langkah 2: Build & Distribusikan Frontend
Jangan gunakan *dev server* Vite di lingkungan produksi. Anda harus mengompilasinya menjadi file statis:
1. Masuk ke folder frontend dan bangun aset statis:
   ```bash
   cd ../frontend/vite-project
   npm install
   npm run build
   ```
   Langkah ini menghasilkan folder static files di `/frontend/vite-project/dist`.

#### Langkah 3: Konfigurasi Nginx sebagai Reverse Proxy
Gunakan Nginx untuk menyajikan file statis frontend dan mengarahkan API request ke backend Express (port 4000).

Buat file konfigurasi baru di `/etc/nginx/sites-available/dashboard-tambang`:
```nginx
server {
    listen 80;
    server_name domain_atau_ip_server;

    # Frontend (Static Files)
    location / {
        root /var/www/dashboard/frontend/vite-project/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # API Gateway (Proxy ke Backend Express)
    location /api/ {
        proxy_pass http://localhost:4000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
Aktifkan konfigurasi dan restart Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/dashboard-tambang /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 🔒 Praktik Keamanan Produksi (Production Security)
* **SSL/TLS (HTTPS):** Amankan lalu lintas data dengan sertifikat SSL (misalnya Let's Encrypt / Certbot).
* **Firewall (UFW):** Blokir akses publik langsung ke port database (`27017`) dan port backend Express (`4000`). Cukup buka port web standar `80` (HTTP) dan `443` (HTTPS) untuk Nginx.
* **Manajemen Log:** Monitor kapasitas disk secara berkala karena log winston disimpan di folder `backend/logsDasboard`.

---

## 🛠️ Fitur & Spesifikasi Teknis
* **Backend**: Express, TypeScript, Mongoose, Node-cron, Google APIs
* **Frontend**: React 19, Vite, TailwindCSS v4, Recharts, ApexCharts, Framer Motion
