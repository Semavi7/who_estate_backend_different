# Who Estate Backend - Node.js + Express + TypeScript

Bu proje, orijinal NestJS tabanlı Who Estate backend uygulamasının Node.js + Express + TypeScript ile yeniden implementasyonudur. N-tier mimari (route-controller-service-repository) kullanılarak geliştirilmiştir.

## 🏗️ Mimari Yapısı

```
nodejsts/
├── src/
│   ├── config/                 # Konfigürasyon dosyaları
│   ├── controllers/           # HTTP isteklerini yöneten controller'lar
│   ├── entities/              # TypeORM entity'leri
│   ├── middleware/            # Express middleware'leri
│   ├── repositories/          # Veri erişim katmanı
│   ├── routes/                # API route'ları
│   ├── services/              # İş mantığı katmanı
│   ├── templates/             # E-posta şablonları
│   ├── types/                 # TypeScript tipleri
│   └── server.ts              # Ana sunucu dosyası
├── package.json
├── tsconfig.json
└── .env.example
```

## 📦 Modüller

### 1. Auth Modülü
- Kullanıcı girişi ve çıkışı
- JWT tabanlı kimlik doğrulama
- Şifre sıfırlama işlemleri
- E-posta doğrulama

### 2. User Modülü
- Kullanıcı yönetimi (CRUD)
- Profil fotoğrafı yükleme
- Şifre değiştirme
- Rol tabanlı yetkilendirme

### 3. Properties Modülü
- Emlak ilanları yönetimi
- Gelişmiş filtreleme ve arama
- Coğrafi konum tabanlı arama
- İstatistikler ve raporlar
- Çoklu dosya yükleme

### 4. Messages Modülü
- İletişim formu mesajları
- Mesaj okunma durumu takibi

### 5. TrackView Modülü
- Site trafiği takibi
- Aylık ve yıllık istatistikler

### 6. FeatureOptions Modülü
- Emlak özellikleri yönetimi
- Kategori bazlı özellik gruplama

### 7. ClientIntake Modülü
- Müşteri kayıt formları
- Potansiyel müşteri yönetimi

## 🚀 Kurulum

### Gereksinimler
- Node.js 18+
- MongoDB
- TypeScript

### Adımlar

1. **Proje dizinine gidin:**
   ```bash
   cd nodejsts
   ```

2. **Bağımlılıkları yükleyin:**
   ```bash
   npm install
   ```

3. **Çevre değişkenlerini ayarlayın:**
   ```bash
   cp .env.example .env
   ```
   `.env` dosyasını düzenleyerek gerekli değerleri girin.

4. **Geliştirme modunda çalıştırın:**
   ```bash
   npm run dev
   ```

5. **Production build:**
   ```bash
   npm run build
   npm start
   ```

## 🔧 Çevre Değişkenleri

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Database Configuration
MONGO_URL=mongodb://localhost:27017/who_estate

# JWT Configuration
JWT_SECRET=your-jwt-secret-key-here

# Google Cloud Storage Configuration
GCS_BUCKET_NAME=your-bucket-name
GCS_KEYFILE_PATH=path/to/your/service-account-key.json

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# CORS Configuration
FRONTEND_URL=http://localhost:3000
PRODUCTION_URL=https://www.deryaemlak.co
```

## 📚 API Endpoints

### Auth
- `POST /api/auth/login` - Kullanıcı girişi
- `POST /api/auth/forgot-password` - Şifre sıfırlama talebi
- `POST /api/auth/reset-password` - Şifre sıfırlama
- `POST /api/auth/logout` - Çıkış

### User
- `GET /api/user` - Tüm kullanıcılar (Public)
- `POST /api/user` - Kullanıcı oluşturma
- `GET /api/user/:id` - Kullanıcı detayı
- `PUT /api/user/:id` - Kullanıcı güncelleme
- `DELETE /api/user/:id` - Kullanıcı silme
- `PATCH /api/user/:id/upload-image` - Profil fotoğrafı yükleme
- `PATCH /api/user/:id/password` - Şifre değiştirme

### Properties
- `GET /api/properties` - Tüm ilanlar (Public)
- `POST /api/properties` - İlan oluşturma
- `GET /api/properties/:id` - İlan detayı (Public)
- `PUT /api/properties/:id` - İlan güncelleme
- `DELETE /api/properties/:id` - İlan silme
- `GET /api/properties/query` - Filtreleme (Public)
- `GET /api/properties/near` - Yakın ilanlar (Public)
- `GET /api/properties/lastsix` - Son 6 ilan (Public)
- `GET /api/properties/count` - Toplam ilan sayısı (Public)

### Messages
- `POST /api/messages` - Mesaj gönderme (Public)
- `GET /api/messages` - Tüm mesajlar
- `GET /api/messages/:id` - Mesaj detayı
- `DELETE /api/messages/:id` - Mesaj silme
- `PATCH /api/messages/:id` - Mesajı okundu olarak işaretle

### TrackView
- `POST /api/track-view` - Görüntüleme takibi (Public)
- `GET /api/track-view` - Yıllık istatistikler (Public)
- `GET /api/track-view/month` - Aylık toplam görüntüleme (Public)

### FeatureOptions
- `GET /api/feature-options` - Gruplanmış özellikler (Public)
- `POST /api/feature-options` - Özellik oluşturma
- `GET /api/feature-options/findall` - Tüm özellikler
- `GET /api/feature-options/:id` - Özellik detayı
- `PUT /api/feature-options/:id` - Özellik güncelleme
- `DELETE /api/feature-options/:id` - Özellik silme

### ClientIntake
- `POST /api/client-intake` - Müşteri kaydı oluşturma
- `GET /api/client-intake` - Tüm müşteri kayıtları
- `GET /api/client-intake/:id` - Müşteri kaydı detayı
- `PATCH /api/client-intake/:id` - Müşteri kaydı güncelleme
- `DELETE /api/client-intake/:id` - Müşteri kaydı silme

## 🔐 Kimlik Doğrulama ve Yetkilendirme

- **JWT Token**: HTTP-only cookie olarak saklanır
- **Roller**: Admin ve Member
- **Middleware**: `authenticateToken` ve `authorizeRoles`

## 🗄️ Veritabanı

- **MongoDB** kullanılmaktadır
- **TypeORM** ile ORM katmanı
- **Geospatial queries** desteklenmektedir

## 📁 Dosya Yükleme

- **Google Cloud Storage** entegrasyonu
- **Watermark** otomatik ekleme
- **Image processing** Sharp kütüphanesi ile

## ✉️ E-posta Sistemi

- **Nodemailer** ile SMTP entegrasyonu
- **Handlebars** template engine
- **Şifre sıfırlama** e-postaları

## 🛠️ Geliştirme

### Script'ler
- `npm run dev` - Geliştirme sunucusu
- `npm run build` - TypeScript derleme
- `npm start` - Production sunucusu
- `npm run lint` - Kod analizi

### Kod Yapısı
- **TypeScript** strict mode
- **ESLint** kod standartları
- **N-tier architecture**
- **Repository pattern**
- **Dependency injection**

## 📊 Özellikler

- ✅ Tamamen TypeScript
- ✅ N-tier mimari
- ✅ JWT kimlik doğrulama
- ✅ Rol tabanlı yetkilendirme
- ✅ MongoDB + TypeORM
- ✅ File upload (Google Cloud Storage)
- ✅ E-posta gönderimi
- ✅ Geospatial queries
- ✅ Error handling
- ✅ Validation
- ✅ CORS yapılandırması
- ✅ Environment configuration
- ✅ Logging

## 🚀 Deployment

1. Build alın:
   ```bash
   npm run build
   ```

2. Production environment değişkenlerini ayarlayın

3. PM2 veya benzeri process manager ile çalıştırın

## 📞 İletişim

Proje hakkında sorularınız için:
- Email: refiyederyaakgun@gmail.com
- Website: https://www.deryaemlak.co