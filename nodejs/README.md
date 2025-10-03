# Who Estate Backend - Express Version

Bu proje, orijinal NestJS tabanlı Who Estate backend'inin Node.js ve Express kullanılarak yeniden yazılmış versiyonudur.

## Özellikler

- **Authentication**: JWT tabanlı kimlik doğrulama
- **User Management**: Kullanıcı yönetimi ve profil işlemleri
- **Property Management**: Emlak ilanları yönetimi
- **File Upload**: Google Cloud Storage ile dosya yükleme
- **Email Service**: Nodemailer ile e-posta gönderimi
- **Geospatial Queries**: MongoDB ile konum bazlı aramalar
- **API Documentation**: Swagger ile API dokümantasyonu
- **Security**: Helmet, CORS, Rate Limiting
- **Validation**: Joi ile giriş doğrulama
- **Error Handling**: Kapsamlı hata yönetimi

## Teknolojiler

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Multer** - File uploads
- **Sharp** - Image processing
- **Nodemailer** - Email service
- **Swagger** - API documentation
- **Joi** - Validation
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing

## Kurulum

1. **Gereksinimler**:
   - Node.js (v14 veya üzeri)
   - MongoDB
   - Google Cloud Storage hesabı (opsiyonel)

2. **Bağımlılıkları yükleyin**:
   ```bash
   cd nodejs
   npm install
   ```

3. **Çevre değişkenlerini ayarlayın**:
   ```bash
   cp .env.example .env
   # .env dosyasını düzenleyin
   ```

4. **Veritabanını başlatın**:
   - MongoDB'yi başlatın veya MongoDB Atlas kullanın

5. **Uygulamayı başlatın**:
   ```bash
   # Geliştirme modu
   npm run dev
   
   # Production modu
   npm start
   ```

## API Dokümantasyonu

Uygulama çalıştıktan sonra Swagger API dokümantasyonuna şu adresten erişebilirsiniz:
```
http://localhost:3001/api-docs
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Kullanıcı girişi
- `POST /api/auth/forgot-password` - Şifre sıfırlama talebi
- `POST /api/auth/reset-password` - Şifre sıfırlama

### Users
- `GET /api/user` - Tüm kullanıcıları listele
- `POST /api/user` - Yeni kullanıcı oluştur
- `GET /api/user/:id` - Kullanıcı detayları
- `PUT /api/user/:id` - Kullanıcı güncelle
- `DELETE /api/user/:id` - Kullanıcı sil
- `PATCH /api/user/:id/upload-image` - Profil resmi yükle
- `PATCH /api/user/:id/password` - Şifre değiştir

### Properties
- `GET /api/properties` - Tüm ilanları listele
- `POST /api/properties` - Yeni ilan oluştur
- `GET /api/properties/:id` - İlan detayları
- `PUT /api/properties/:id` - İlan güncelle
- `DELETE /api/properties/:id` - İlan sil
- `GET /api/properties/query` - Filtreli arama
- `GET /api/properties/near` - Yakın konumlardaki ilanlar
- `GET /api/properties/lastsix` - Son 6 ilan
- `GET /api/properties/count` - Toplam ilan sayısı

### Messages
- `POST /api/messages` - Yeni mesaj oluştur
- `GET /api/messages` - Tüm mesajları listele
- `GET /api/messages/:id` - Mesaj detayları
- `DELETE /api/messages/:id` - Mesaj sil
- `PATCH /api/messages/:id` - Mesajı okundu olarak işaretle

### Track View
- `POST /api/track-view` - Görüntüleme sayacını artır
- `GET /api/track-view` - Yıllık görüntüleme istatistikleri
- `GET /api/track-view/month` - Aylık toplam görüntüleme

### Feature Options
- `POST /api/feature-options` - Yeni özellik oluştur
- `GET /api/feature-options` - Gruplanmış özellikler
- `GET /api/feature-options/findall` - Tüm özellikler
- `PUT /api/feature-options/:id` - Özellik güncelle
- `DELETE /api/feature-options/:id` - Özellik sil

### Client Intake
- `POST /api/client-intake` - Yeni müşteri kaydı
- `GET /api/client-intake` - Tüm müşteri kayıtları
- `GET /api/client-intake/:id` - Müşteri kaydı detayları
- `PATCH /api/client-intake/:id` - Müşteri kaydı güncelle
- `DELETE /api/client-intake/:id` - Müşteri kaydı sil

## Güvenlik Özellikleri

- JWT tabanlı kimlik doğrulama
- Şifre hash'leme (bcrypt)
- CORS yapılandırması
- Güvenlik başlıkları (Helmet)
- Hız sınırlama (Rate Limiting)
- Giriş doğrulama (Joi)
- Hata yönetimi

## Dosya Yapısı

```
nodejs/
├── config/           # Yapılandırma dosyaları
├── middleware/       # Express middleware'leri
├── models/          # MongoDB modelleri
├── routes/          # API route'ları
├── services/        # İş mantığı servisleri
├── templates/       # E-posta şablonları
├── server.js        # Ana uygulama dosyası
├── package.json     # Bağımlılıklar
└── README.md        # Bu dosya
```

## Lisans

Bu proje özel lisans altındadır.