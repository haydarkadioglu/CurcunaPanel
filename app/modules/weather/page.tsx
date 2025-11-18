'use client';

import { useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import GlitchText from '@/components/ui/GlitchText';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';

interface WeatherData {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: Array<{
    main: string;
    description: string;
  }>;
  wind: {
    speed: number;
  };
}

export default function WeatherPage() {
  const { t, language } = useLanguage();
  const [city, setCity] = useState('');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [weatherComment, setWeatherComment] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const moods = [
    { key: 'angry', emoji: '😠', color: 'text-red-400' },
    { key: 'depressed', emoji: '😢', color: 'text-blue-400' },
    { key: 'overjoyed', emoji: '🤪', color: 'text-yellow-400' },
    { key: 'anxious', emoji: '😰', color: 'text-orange-400' },
    { key: 'calm', emoji: '😌', color: 'text-green-400' },
    { key: 'suspicious', emoji: '🤔', color: 'text-purple-400' },
  ];

  const generateMoodComment = async (data: WeatherData, mood: string): Promise<string> => {
    const temp = data.main.temp;
    const condition = data.weather[0].main.toLowerCase();
    const wind = data.wind.speed;

    // Try Gemini API first
    try {
      const response = await fetch('/api/weather-comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          weatherData: data,
          mood: mood,
          language: language,
        }),
      });

      const result = await response.json();
      if (result.comment && result.source === 'gemini') {
        return result.comment;
      }
    } catch (error) {
      // Fall through to fallback
    }

    // Fallback to static comments

    // Helper function to get condition description
    const getConditionDesc = (isTr: boolean) => {
      if (condition === 'rain') return isTr ? 'yağmurlu' : 'rainy';
      if (condition === 'clouds') return isTr ? 'bulutlu' : 'cloudy';
      return isTr ? 'açık' : 'clear';
    };

    const getConditionDesc2 = (isTr: boolean) => {
      if (condition === 'rain') return isTr ? 'yağmur yağıyor' : 'raining';
      if (condition === 'clouds') return isTr ? 'bulutlu' : 'cloudy';
      return isTr ? 'açık' : 'clear';
    };

    const getConditionDesc3 = (isTr: boolean) => {
      if (condition === 'rain') return isTr ? 'yağmurlu' : 'rainy';
      if (condition === 'clouds') return isTr ? 'bulutlu' : 'cloudy';
      return isTr ? 'güneşli' : 'sunny';
    };

    const getDepressedCondition = (isTr: boolean) => {
      if (condition === 'rain') return isTr ? 'yağmur sürekli yağıyor' : 'continuously raining';
      if (condition === 'clouds') return isTr ? 'çok bulutlu' : 'very cloudy';
      return isTr ? 'güneş yok' : 'no sun';
    };

    const getOverjoyedCondition = (isTr: boolean) => {
      if (condition === 'rain') return isTr ? 'yağmur şarkı söylüyor' : 'rain is singing';
      if (condition === 'clouds') return isTr ? 'bulutlar dans ediyor' : 'clouds are dancing';
      return isTr ? 'güneş çok mutlu' : 'sun is very happy';
    };

    const getOverjoyedCondition2 = (isTr: boolean) => {
      if (condition === 'rain') return isTr ? 'yağmurlu ama mutlu' : 'rainy but happy';
      if (condition === 'clouds') return isTr ? 'bulutlu ama neşeli' : 'cloudy but joyful';
      return isTr ? 'güneşli ve coşkulu' : 'sunny and enthusiastic';
    };

    const getAnxiousCondition = (isTr: boolean) => {
      if (condition === 'rain') return isTr ? 'Evet yağmur var!' : 'Yes, there\'s rain!';
      if (condition === 'clouds') return isTr ? 'Bulutlar var, belki yağar?' : 'There are clouds, maybe it will rain?';
      return isTr ? 'Açık ama... belki?' : 'Clear but... maybe?';
    };

    const getAnxiousCondition2 = (isTr: boolean) => {
      if (condition === 'rain') return isTr ? 'Yağmur var ama' : 'There\'s rain but';
      if (condition === 'clouds') return isTr ? 'Bulutlar var ama' : 'There are clouds but';
      return isTr ? 'Güneş var ama' : 'There\'s sun but';
    };

    const getCalmCondition = (isTr: boolean) => {
      if (condition === 'rain') return isTr ? 'hafif yağmurlu' : 'lightly rainy';
      if (condition === 'clouds') return isTr ? 'sakin bulutlu' : 'calmly cloudy';
      return isTr ? 'güneşli' : 'sunny';
    };

    const getCalmCondition2 = (isTr: boolean) => {
      if (condition === 'rain') return isTr ? 'Yağmur yumuşak' : 'Rain is soft';
      if (condition === 'clouds') return isTr ? 'Bulutlar yavaş' : 'Clouds are slow';
      return isTr ? 'Güneş yumuşak' : 'Sun is soft';
    };

    const getSuspiciousCondition = (isTr: boolean) => {
      if (condition === 'rain') return isTr ? 'Yağmur var mı?' : 'Is there rain?';
      if (condition === 'clouds') return isTr ? 'Bulutlar gerçek mi?' : 'Are the clouds real?';
      return isTr ? 'Güneş var mı?' : 'Is there sun?';
    };

    const comments: Record<string, string[]> = {
      angry: language === 'tr' ? [
        `${data.name} bugün ${temp}°C ve ${getConditionDesc2(true)}. Hava çok sinirli! Bulutlar birbirine bağırıyor gibi!`,
        `${temp}°C? Bu sıcaklık çok agresif! Rüzgar ${wind} km/s ile esiyor, sanki kızgın!`,
        `Hava bugün ${getConditionDesc3(true)} ve ${temp}°C. Güneş bugün çok huysuz görünüyor!`,
      ] : [
        `${data.name} is ${temp}°C and ${getConditionDesc2(false)} today. The weather is very angry! Clouds seem to be shouting at each other!`,
        `${temp}°C? This temperature is too aggressive! Wind is blowing at ${wind} km/h, as if angry!`,
        `Weather is ${getConditionDesc3(false)} and ${temp}°C today. The sun looks very grumpy!`,
      ],
      depressed: language === 'tr' ? [
        `${data.name}'de hava ${temp}°C ve ${getDepressedCondition(true)}. Hava bugün çok üzgün görünüyor.`,
        `${temp}°C... Hava o kadar ağır ki, sanki gökyüzü ağlıyor. Nem %${data.main.humidity}, çok yüksek.`,
        `Hava durumu: ${temp}°C, ${getConditionDesc(true)}. Sanki hiç güneş yokmuş gibi.`,
      ] : [
        `Weather in ${data.name} is ${temp}°C and ${getDepressedCondition(false)}. The weather looks very sad today.`,
        `${temp}°C... The weather is so heavy, as if the sky is crying. Humidity is ${data.main.humidity}%, very high.`,
        `Weather: ${temp}°C, ${getConditionDesc(false)}. As if there's no sun at all.`,
      ],
      overjoyed: language === 'tr' ? [
        `${data.name}'de hava ${temp}°C ve ${getOverjoyedCondition(true)}! Her şey çok neşeli!`,
        `Wow! ${temp}°C! Hava o kadar mutlu ki, rüzgar bile ${wind} km/s ile dans ediyor!`,
        `Hava durumu: ${temp}°C, ${getOverjoyedCondition2(true)}! Her şey harika!`,
      ] : [
        `Weather in ${data.name} is ${temp}°C and ${getOverjoyedCondition(false)}! Everything is so joyful!`,
        `Wow! ${temp}°C! The weather is so happy that even the wind is dancing at ${wind} km/h!`,
        `Weather: ${temp}°C, ${getOverjoyedCondition2(false)}! Everything is great!`,
      ],
      anxious: language === 'tr' ? [
        `${data.name}'de hava ${temp}°C... Belki yağmur yağacak? Belki değil? ${getAnxiousCondition(true)}`,
        `Hava ${temp}°C ve ${getConditionDesc(true)}. Ne olacağını kimse bilmiyor. Rüzgar ${wind} km/s... Endişeli.`,
        `${temp}°C... Hava belirsiz. ${getAnxiousCondition2(true)}... Belki bir şeyler olacak?`,
      ] : [
        `Weather in ${data.name} is ${temp}°C... Maybe it will rain? Maybe not? ${getAnxiousCondition(false)}`,
        `Weather is ${temp}°C and ${getConditionDesc(false)}. No one knows what will happen. Wind is ${wind} km/h... Anxious.`,
        `${temp}°C... Weather is uncertain. ${getAnxiousCondition2(false)}... Maybe something will happen?`,
      ],
      calm: language === 'tr' ? [
        `${data.name}'de hava ${temp}°C ve ${getCalmCondition(true)}. Her şey çok huzurlu.`,
        `Hava ${temp}°C, ${getConditionDesc(true)}. Rüzgar ${wind} km/s ile hafifçe esiyor. Çok sakin.`,
        `${temp}°C... Hava bugün çok sakin. ${getCalmCondition2(true)}. Her şey durgun.`,
      ] : [
        `Weather in ${data.name} is ${temp}°C and ${getCalmCondition(false)}. Everything is very peaceful.`,
        `Weather is ${temp}°C, ${getConditionDesc(false)}. Wind is blowing gently at ${wind} km/h. Very calm.`,
        `${temp}°C... Weather is very calm today. ${getCalmCondition2(false)}. Everything is still.`,
      ],
      suspicious: language === 'tr' ? [
        `${data.name}'de hava ${temp}°C diyorlar... Ama gerçekten ${temp}°C mi? ${getSuspiciousCondition(true)} Şüpheli...`,
        `Hava ${temp}°C ve ${getConditionDesc(true)} görünüyor. Ama gerçekten öyle mi? Rüzgar ${wind} km/s... Tuhaf.`,
        `${temp}°C? Belki. Belki değil. Hava ${getConditionDesc(true)} ama... Bir şeyler yanlış gibi.`,
      ] : [
        `They say weather in ${data.name} is ${temp}°C... But is it really ${temp}°C? ${getSuspiciousCondition(false)} Suspicious...`,
        `Weather looks ${temp}°C and ${getConditionDesc(false)}. But is it really? Wind is ${wind} km/h... Strange.`,
        `${temp}°C? Maybe. Maybe not. Weather is ${getConditionDesc(false)} but... Something seems wrong.`,
      ],
    };

    const moodComments = comments[mood] || comments.calm;
    return moodComments[Math.floor(Math.random() * moodComments.length)];
  };

  const fetchWeather = async () => {
    if (!city.trim() || !selectedMood) {
      setError(language === 'tr' ? 'Lütfen şehir adı girin ve ruh hali seçin!' : 'Please enter city name and select a mood!');
      return;
    }

    setLoading(true);
    setError('');
    setWeatherData(null);
    setWeatherComment('');

    try {
      const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}&lang=${language}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch weather');
      }

      const data: WeatherData = await response.json();
      setWeatherData(data);
      const comment = await generateMoodComment(data, selectedMood);
      setWeatherComment(comment);
    } catch (err) {
      setError(t.modules.weather.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="text-neon-cyan hover:text-neon-pink">
            {t.common.backToHome}
          </Link>
          <LanguageSwitcher />
        </div>

        <div className="bg-black/50 border-2 border-neon-blue rounded-lg p-8 backdrop-blur-sm">
          <h1 className="text-4xl font-bold mb-6 text-center">
            <GlitchText intensity="medium">{t.modules.weather.title}</GlitchText>
          </h1>

          <p className="text-center text-gray-300 mb-8">
            {t.modules.weather.subtitle}
          </p>

          {/* City Input */}
          <div className="mb-6">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && fetchWeather()}
              placeholder={t.modules.weather.cityPlaceholder}
              className="w-full p-4 bg-black border-2 border-neon-purple rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-pink transition-colors"
            />
          </div>

          {/* Mood Selection */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {moods.map((mood) => (
              <button
                key={mood.key}
                onClick={() => {
                  setSelectedMood(mood.key);
                  setWeatherData(null);
                  setWeatherComment('');
                }}
                className={`
                  p-6 rounded-lg border-2 transition-all
                  ${selectedMood === mood.key
                    ? 'border-neon-pink bg-neon-pink/10'
                    : 'border-neon-blue hover:border-neon-cyan'
                  }
                `}
              >
                <div className="text-4xl mb-2">{mood.emoji}</div>
                <div className={`font-bold ${mood.color}`}>
                  {t.modules.weather.moods[mood.key as keyof typeof t.modules.weather.moods]}
                </div>
              </button>
            ))}
          </div>

          {/* Generate Button */}
          {city && selectedMood && (
            <div className="text-center mb-6">
              <Button 
                onClick={fetchWeather} 
                variant="primary" 
                glitch
                disabled={loading}
              >
                {loading ? t.modules.weather.loading : t.modules.weather.generate}
              </Button>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded text-red-300 text-center">
              {error}
            </div>
          )}

          {/* Weather Report */}
          {weatherData && weatherComment && selectedMood && (
            <div className="mt-8 p-6 bg-black/70 border-2 border-neon-purple rounded-lg">
              <div className="text-2xl mb-4 text-center">
                {moods.find(m => m.key === selectedMood)?.emoji} {t.modules.weather.moods[selectedMood as keyof typeof t.modules.weather.moods]} {language === 'tr' ? 'Hava Durumu' : 'Weather'}
              </div>
              <div className="text-center mb-4 text-lg text-neon-cyan">
                {weatherData.name}: {weatherData.main.temp}°C ({weatherData.weather[0].description})
              </div>
              <div className="text-xl text-center text-neon-cyan animate-pulse-neon">
                {weatherComment}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
