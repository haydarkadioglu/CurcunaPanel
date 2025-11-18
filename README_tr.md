# CurcunaPanel 🎭

**Kaotik, eğlencelik, sürpriz dolu mini uygulamalar paneli.**

CurcunaPanel, deneysel bir yazılım laboratuvarının "eğlence modülleri" bölümünden yanlışlıkla internete sızmış bir paneldir. Her modül normal bir araç gibi görünür ama hepsinde hafif bir arıza veya mizahi bozulma vardır.

## 🎯 Konsept

Bu panelin amacı: **"Her ciddi aracı bilerek bozup eğlenceye dönüştürmek."**

Kullanıcı ne zaman yeni bir modül açsa, CurcunaPanel biraz trip atabilir, alay edebilir veya glitch efektleri gösterebilir.

## 🧩 Modüller

### 🔢 GlitchCalculator
Normal hesap makinesi + komik yorumlar + glitch animasyonları. Bazen saçma sonuç verip özür diler.

**Özellikler:**
- Standart hesap makinesi işlevleri
- Rastgele komik yorumlar
- Bazen yanlış sonuçlar (özür dileyerek)
- Glitch animasyonları

### 🌦️ MoodWeather
Gerçek hava durumu + komik yorumlar. Ruh haline göre hava durumunu yorumluyor.

**Özellikler:**
- Gerçek hava durumu API entegrasyonu (OpenWeatherMap)
- Şehir adı girişi
- 6 farklı ruh hali seçeneği
- Ruh haline göre hava durumu yorumları
- Komik, ruh haline özel yorumlar

### 📝 MischiefNotepad
Kullanıcı yazarken cümleleri değiştiriyor. Arada ASCII hayalet veya garip emojiler ekliyor.

**Özellikler:**
- Gerçek zamanlı metin manipülasyonu
- Kelime değiştirme (sen→ben, evet→hayır, vb.)
- Rastgele emoji ekleme
- ASCII hayalet ekleme
- Dile özel yaramazlık desenleri

### 🏃 EscapeButton Game
Tıklanmak istemeyen, kaçan bir buton mini oyunu. Buton her tıklamada şekil değiştiriyor ve imleçten kaçıyor.

**Özellikler:**
- İmleç algılama ve kaçış mekanizması
- İmleç yaklaştığında buton kaçar (200px yarıçap)
- Farklı buton şekilleri ve mesajları
- Tıklama sayacı
- Yumuşak hareket animasyonları

### 🔮 FortuneTroll
Mantıksız, rastgele, eğlenceli fal/kader tahmini.

**Özellikler:**
- 30+ farklı fal metni
- Glitch efektli animasyonlar
- Rastgele fal üretimi

### 🤥 ExcuseGenerator
Absürt bahaneleri JSON'dan çekerek üretiyor.

**Özellikler:**
- 25+ absürt bahane
- Bahaneler geçmişi
- Tek tıkla bahane üretimi

### 💥 HiddenChaosMode
Gizli klavye kombinasyonuyla açılan "kaos modu". UI hafif glitch'leniyor, yazılar titriyor, renkler kayıyor.

**Özellikler:**
- Gizli tuş kombinasyonu: `curcuna`
- Aktif olduğunda tüm UI glitch'leniyor
- Renkler kayıyor, yazılar titriyor
- Deneysel efektler

## 💻 Teknik Detaylar

### Stack
- **Next.js 14** (App Router)
- **TypeScript**
- **TailwindCSS**
- **React 18**

### Proje Yapısı

```
curcuna-panel/
├── app/
│   ├── layout.tsx          # Ana layout
│   ├── page.tsx             # Ana sayfa (modül grid)
│   ├── globals.css          # Global stiller
│   ├── api/
│   │   └── weather/         # Hava durumu API route'u
│   └── modules/              # Modül sayfaları
│       ├── calculator/
│       ├── weather/
│       ├── notepad/
│       ├── escape-button/
│       ├── fortune/
│       ├── excuses/
│       └── chaos/
├── components/
│   ├── ui/                   # UI bileşenleri
│   │   ├── Card.tsx
│   │   ├── Button.tsx
│   │   └── GlitchText.tsx
│   └── LanguageSwitcher.tsx
├── contexts/
│   └── LanguageContext.tsx   # Dil context'i
├── data/
│   ├── translations/         # Çeviri dosyaları
│   │   ├── tr.json
│   │   └── en.json
│   ├── excuses.json
│   └── fortunes.json
├── styles/
│   └── globals.css           # Global CSS ve animasyonlar
└── README.md
```

## 🚀 Kurulum

1. **Bağımlılıkları yükleyin:**
```bash
npm install
```

2. **Ortam değişkenlerini ayarlayın (isteğe bağlı):**
```bash
# Gerçek hava durumu verisi için .env.local dosyasına ekleyin:
OPENWEATHER_API_KEY=api_anahtarınız_buraya
```

3. **Geliştirme sunucusunu başlatın:**
```bash
npm run dev
```

4. **Tarayıcıda açın:**
```
http://localhost:3000
```

## 🎨 Tema ve Stil

### Renkler
- **Neon Mavi**: `#00f0ff`
- **Neon Pembe**: `#ff00ff`
- **Neon Mor**: `#9d00ff`
- **Neon Cyan**: `#00ffff`
- **Neon Yeşil**: `#00ff88`

### Animasyonlar
- `glitch`: Hafif glitch efekti
- `glitch-2`: Yoğun glitch efekti
- `float`: Yüzen animasyon
- `pulse-neon`: Neon nabız efekti
- `chaos-shake`: Kaos modu sallama efekti
- Dinamik animasyonlu arka plan (gradient kaymaları)
- Grid pattern animasyonu

## 🌍 Çoklu Dil Desteği

Uygulama hem **Türkçe** hem de **İngilizce** dillerini destekler:
- Sağ üst köşede dil değiştirici
- Tüm modüller tam çevirili
- Dil tercihi localStorage'da saklanır

## 🔧 Geliştirme

### Yeni Modül Ekleme

1. `app/modules/` altında yeni bir klasör oluşturun
2. `page.tsx` dosyası ekleyin
3. Ana sayfadaki `modules` array'ine yeni modülü ekleyin
4. `data/translations/tr.json` ve `data/translations/en.json` dosyalarına çevirileri ekleyin

**Örnek:**
```typescript
// app/modules/yeni-modul/page.tsx
'use client';

import Link from 'next/link';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';

export default function YeniModulPage() {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <Link href="/" className="text-neon-cyan hover:text-neon-pink">
          {t.common.backToHome}
        </Link>
        <LanguageSwitcher />
      </div>
      {/* Modül içeriği */}
    </div>
  );
}
```

### UI Bileşenleri

- **Card**: Modül kartları için
- **Button**: Stilize butonlar için
- **GlitchText**: Glitch efektli metin için
- **LanguageSwitcher**: Dil seçimi için

## 📝 Notlar

- Bu proje tamamen eğlence amaçlıdır
- Modüller bilerek "bozuk" tasarlanmıştır
- Önemli işlemler için kullanmayın!
- Kaos modu deneyseldir ve performansı etkileyebilir
- Hava durumu modülü OpenWeatherMap API kullanır (API anahtarı yoksa mock veri kullanır)

## 🎭 Hikâye

CurcunaPanel, bir yazılım laboratuvarının eğlence modülleri bölümünden yanlışlıkla internete sızmış bir paneldir. Her modül normal bir araç gibi görünür ama hepsinde hafif bir arıza veya mizahi bozulma vardır.

Kullanıcı ne zaman yeni bir modül açsa, CurcunaPanel biraz trip atabilir, alay edebilir veya glitch efektleri gösterebilir.

## 📄 Lisans

Bu proje eğlence amaçlıdır. İstediğiniz gibi kullanabilirsiniz.

---

**⚠️ Uyarı: Bu panel deneyseldir. Kullanırken dikkatli olun. ⚠️**

**💡 İpucu: Kaos modunu açmak için "curcuna" yazmayı deneyin!**

