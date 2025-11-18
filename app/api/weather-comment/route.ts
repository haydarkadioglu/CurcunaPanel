import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { weatherData, mood, language } = await request.json();

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ comment: null, source: 'fallback' });
    }

    try {
      const temp = weatherData.main.temp;
      const condition = weatherData.weather[0].description;
      const wind = weatherData.wind.speed;
      const city = weatherData.name;

      const moodMap: Record<string, string> = {
        angry: language === 'tr' ? 'sinirli' : 'angry',
        depressed: language === 'tr' ? 'depresif' : 'depressed',
        overjoyed: language === 'tr' ? 'aşırı neşeli' : 'overjoyed',
        anxious: language === 'tr' ? 'kaygılı' : 'anxious',
        calm: language === 'tr' ? 'sakin' : 'calm',
        suspicious: language === 'tr' ? 'şüpheli' : 'suspicious',
      };

      const moodText = moodMap[mood] || mood;

      const prompt = language === 'tr'
        ? `Sen samimi, küfürbaz, depresif ve absürt bir hava durumu yorumcususun. ${city} şehrinde hava durumu: ${temp}°C, ${condition}, rüzgar ${wind} km/s. Kullanıcının ruh hali: ${moodText}. Bu hava durumunu kullanıcının ruh haline göre yorumla. Çok samimi, küfürbaz, depresif ve komik ol. Küfür kullanabilirsin, saygı sınırlarını aşabilirsin. Çok doğal ve samimi konuş. Sadece yorum metnini döndür, başka açıklama yapma. Maksimum 60 kelime.`
        : `You are an intimate, profane, depressed and absurd weather commentator. Weather in ${city}: ${temp}°C, ${condition}, wind ${wind} km/h. User's mood: ${moodText}. Comment on this weather according to the user's mood. Be very intimate, profane, depressed and funny. You can use profanity, you can push boundaries. Be very natural and intimate. Only return the comment text, no other explanation. Maximum 60 words.`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: prompt
              }]
            }]
          })
        }
      );

      if (!response.ok) {
        throw new Error('Gemini API error');
      }

      const data = await response.json();
      const comment = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

      if (comment) {
        return NextResponse.json({ comment, source: 'gemini' });
      }

      throw new Error('No comment generated');
    } catch (error) {
      return NextResponse.json({ comment: null, source: 'fallback' });
    }
  } catch (error) {
    return NextResponse.json({ comment: null, source: 'fallback' });
  }
}

