# Sahabeler.net - İslam Tarihi Web Uygulaması

Modern Next.js, React ve MongoDB tabanlı İslam tarihine dair kapsamlı bilgi portalı.

## 🚀 Başlangıç

### Ön Gereksinimler
- **Node.js** (16+ sürümü)
- **pnpm** veya **npm** (Paket yöneticisi)
- **MongoDB** (Yerel veya MongoDB Atlas)
- **Git**

### Kurulum Adımları

1. **Projeyi klonlayın**
```bash
git clone <repository-url>
cd sahabeler-net
```

2. **Bağımlılıkları yükleyin**
```bash
pnpm install
# veya
npm install
```

3. **.env dosyasını yapılandırın**
```bash
cp .env.example .env
```

`.env` dosyasını aşağıdaki bilgilerle güncelleyin:

```env
# MongoDB Bağlantısı
MONGODB_URI=mongodb://localhost:27017/sahabeler
# veya MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/sahabeler

# JWT Secret (Üretim için güvenli bir key oluşturun)
JWT_SECRET=your-secure-secret-key-here

# API Konfigürasyonu
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Node Ortamı
NODE_ENV=development

# Port
PORT=3000
```

4. **MongoDB'yi başlatın** (Yerel geliştirme için)
```bash
# Windows (MongoDB Community Server kurulu ise)
mongod

# veya Docker ile
docker run -d --name mongodb -p 27017:27017 mongo
```

5. **Geliştirme sunucusunu başlatın**
```bash
pnpm dev
# veya
npm run dev
```

Uygulamaya `http://localhost:3000` adresinden erişin.

## 📁 Proje Yapısı

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   ├── sahabe/[slug]/     # Sahabe detay sayfası
│   ├── admin/             # Admin paneli
│   └── auth/              # Kimlik doğrulama sayfaları
├── components/            # Reusable React bileşenleri
│   ├── ui/               # UI bileşenleri
│   ├── sahabe/           # Sahabe-spesifik bileşenler
│   └── layout/           # Layout bileşenleri
├── lib/                   # Yardımcı fonksiyonlar
│   ├── auth.ts           # JWT yönetimi
│   └── mongodb.ts        # Veritabanı bağlantısı
├── models/               # Mongoose şemaları
├── contexts/             # React Context'ler
└── types/                # TypeScript type tanımları
```

## 🔐 Kimlik Doğrulama

### Admin Oluşturma

Kayıt sırasında şifreyi **`2012696`** ile başlatırsanız, otomatik olarak **admin** statüsü alınır:

```
E-posta: admin@example.com
Şifre: 2012696your-password-here
```

Admin paneline `/admin` adresinden erişebilirsiniz.

## 📝 Kullanılabilir Sahabeler

Sistemde hazır sahabeler:
- Hz. Ebubekir (hz-ebubekir)
- Hz. Ömer (hz-omer)
- Hz. Osman (hz-osman)
- Hz. Ali (hz-ali)
- Hz. Fatıma (hz-fatima)
- Ve daha fazlası...

Her sahabaye `/sahabe/{slug}` adresinden ulaşın:
- Örnek: `http://localhost:3000/sahabe/hz-omer`

## 🛠️ Komutlar

```bash
# Geliştirme modu
pnpm dev

# Production build
pnpm build

# Production modu çalıştır
pnpm start

# Linting kontrolü
pnpm lint
```

## 📊 API Endpoints

### Sahabeler
- `GET /api/sahabeler/[slug]` - Sahabe detaylarını getir
- `PUT /api/sahabeler/[slug]` - Sahabe güncelle (editör/admin)
- `DELETE /api/sahabeler/[slug]` - Sahabe sil (admin)

### Kimlik Doğrulama
- `POST /api/auth/register` - Yeni hesap oluştur
- `POST /api/auth/login` - Giriş yap
- `POST /api/auth/logout` - Çıkış yap
- `GET /api/auth/me` - Mevcut kullanıcı bilgisi

### Admin
- `GET /api/admin/users` - Tüm kullanıcıları listele (admin)
- `PUT /api/admin/users/{id}` - Kullanıcı rolünü güncelle (admin)
- `DELETE /api/admin/users/{id}` - Kullanıcı sil (admin)

## 🎨 Teknolojiler

- **Next.js 16** - Full-stack React framework
- **React 19** - UI library
- **TypeScript** - Type safety
- **MongoDB** - Veritabanı
- **Mongoose** - ODM
- **Tailwind CSS** - Styling
- **Radix UI** - Bileşen sistemi
- **jose** - JWT işlemleri
- **bcryptjs** - Şifre hashlama

## 🔒 Güvenlik Notları

⚠️ **Üretim Ortamında:**
1. `JWT_SECRET` için güvenli bir anahtar oluşturun:
   ```bash
   openssl rand -base64 32
   ```
2. `MONGODB_URI`'ı MongoDB Atlas veya başka bir güvenli servise ayarlayın
3. `NODE_ENV`'i `production` olarak ayarlayın
4. HTTPS kullanın
5. `secure: true` flag'ini cookie'lerde etkinleştiriniz

## 📧 İletişim

Sorunlar için GitHub Issues açınız veya proje yöneticisiyle iletişime geçiniz.

## 📄 Lisans

Bu proje özel kurulum içindir.
