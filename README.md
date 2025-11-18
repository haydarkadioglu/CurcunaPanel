# CurcunaPanel 🎭

**A chaotic, fun-filled, surprise-packed mini applications panel.**

CurcunaPanel is a panel that accidentally leaked to the internet from the "entertainment modules" section of an experimental software laboratory. Each module looks like a normal tool, but each has a slight malfunction or humorous glitch.

## 🎯 Concept

The purpose of this panel: **"Intentionally break every serious tool and turn it into entertainment."**

Whenever a user opens a new module, CurcunaPanel might trip a bit, mock, or show glitch effects.

## 🧩 Modules

### 🔢 GlitchCalculator
Normal calculator + funny comments + glitch animations. Sometimes gives absurd results and apologizes.

**Features:**
- Standard calculator functions
- Random funny comments
- Sometimes wrong results (with apologies)
- Glitch animations

### 🌦️ MoodWeather
Generates real weather reports with funny comments based on mood (angry, depressed, overly joyful).

**Features:**
- Real weather API integration (OpenWeatherMap)
- City name input
- 6 different mood options
- Mood-based weather interpretations
- Funny, mood-specific comments

### 📝 MischiefNotepad
Changes sentences while the user is typing. Occasionally adds ASCII ghosts or weird emojis.

**Features:**
- Real-time text manipulation
- Word replacement (you→me, yes→no, etc.)
- Random emoji insertion
- ASCII ghost insertion
- Language-specific mischief patterns

### 🏃 EscapeButton Game
A mini game with a button that doesn't want to be clicked and runs away. The button changes shape with each click and escapes from the cursor.

**Features:**
- Cursor detection and escape mechanism
- Button runs away when cursor approaches (200px radius)
- Different button shapes and messages
- Click counter
- Smooth movement animations

### 🔮 FortuneTroll
Illogical, random, fun fortune/destiny prediction.

**Features:**
- 30+ different fortune texts
- Glitch effect animations
- Random fortune generation

### 🤥 ExcuseGenerator
Generates absurd excuses by fetching from JSON.

**Features:**
- 25+ absurd excuses
- Excuse history
- One-click excuse generation

### 💥 HiddenChaosMode
A "chaos mode" opened with a hidden keyboard combination. UI glitches slightly, text shakes, colors shift.

**Features:**
- Hidden key combination: `curcuna`
- When active, entire UI glitches
- Colors shift, text shakes
- Experimental effects

## 💻 Technical Details

### Stack
- **Next.js 14** (App Router)
- **TypeScript**
- **TailwindCSS**
- **React 18**

### Project Structure

```
curcuna-panel/
├── app/
│   ├── layout.tsx          # Main layout
│   ├── page.tsx             # Home page (module grid)
│   ├── globals.css          # Global styles
│   ├── api/
│   │   └── weather/         # Weather API route
│   └── modules/              # Module pages
│       ├── calculator/
│       ├── weather/
│       ├── notepad/
│       ├── escape-button/
│       ├── fortune/
│       ├── excuses/
│       └── chaos/
├── components/
│   ├── ui/                   # UI components
│   │   ├── Card.tsx
│   │   ├── Button.tsx
│   │   └── GlitchText.tsx
│   └── LanguageSwitcher.tsx
├── contexts/
│   └── LanguageContext.tsx   # Language context
├── data/
│   ├── translations/         # Translation files
│   │   ├── tr.json
│   │   └── en.json
│   ├── excuses.json
│   └── fortunes.json
├── styles/
│   └── globals.css           # Global CSS and animations
└── README.md
```

## 🚀 Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Set up environment variables (optional):**
```bash
# For real weather data, add to .env.local:
OPENWEATHER_API_KEY=your_api_key_here
```

3. **Start the development server:**
```bash
npm run dev
```

4. **Open in browser:**
```
http://localhost:3000
```

## 🎨 Theme and Style

### Colors
- **Neon Blue**: `#00f0ff`
- **Neon Pink**: `#ff00ff`
- **Neon Purple**: `#9d00ff`
- **Neon Cyan**: `#00ffff`
- **Neon Green**: `#00ff88`

### Animations
- `glitch`: Light glitch effect
- `glitch-2`: Intense glitch effect
- `float`: Floating animation
- `pulse-neon`: Neon pulse effect
- `chaos-shake`: Chaos mode shake effect
- Dynamic animated background with gradient shifts
- Grid pattern animation

## 🌍 Internationalization

The application supports both **English** and **Turkish** languages:
- Language switcher in the top right corner
- All modules are fully translated
- Language preference saved in localStorage

## 🔧 Development

### Adding a New Module

1. Create a new folder under `app/modules/`
2. Add a `page.tsx` file
3. Add the new module to the `modules` array on the home page
4. Add translations to `data/translations/tr.json` and `data/translations/en.json`

**Example:**
```typescript
// app/modules/new-module/page.tsx
'use client';

import Link from 'next/link';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';

export default function NewModulePage() {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <Link href="/" className="text-neon-cyan hover:text-neon-pink">
          {t.common.backToHome}
        </Link>
        <LanguageSwitcher />
      </div>
      {/* Module content */}
    </div>
  );
}
```

### UI Components

- **Card**: For module cards
- **Button**: For styled buttons
- **GlitchText**: For glitch effect text
- **LanguageSwitcher**: For language selection

## 📝 Notes

- This project is purely for entertainment purposes
- Modules are intentionally "broken"
- Don't use for important operations!
- Chaos mode is experimental and may affect performance
- Weather module uses OpenWeatherMap API (fallback to mock data if API key not provided)

## 🎭 Story

CurcunaPanel is a panel that accidentally leaked to the internet from the entertainment modules section of a software laboratory. Each module looks like a normal tool, but each has a slight malfunction or humorous glitch.

Whenever a user opens a new module, CurcunaPanel might trip a bit, mock, or show glitch effects.

## 📄 License

This project is for entertainment purposes. You can use it however you like.

---

**⚠️ Warning: This panel is experimental. Use with caution. ⚠️**

**💡 Tip: Try typing "curcuna" to open chaos mode!**
