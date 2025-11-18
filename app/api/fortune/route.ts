import { NextRequest, NextResponse } from 'next/server';
import fortunesData from '@/data/fortunes.json';

export async function POST(request: NextRequest) {
  try {
    const { topic, language } = await request.json();

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Fallback to JSON
      const randomFortune = fortunesData.fortunes[Math.floor(Math.random() * fortunesData.fortunes.length)];
      return NextResponse.json({ fortune: randomFortune, source: 'fallback' });
    }

    try {
      const prompt = language === 'tr'
        ? `Sen mistik, gizemli, biraz komik ama saygılı bir falcısın. Kullanıcı "${topic}" konusu hakkında bir fal istiyor. Mistik ve gizemli bir fal üret, biraz komik olabilir ama saygılı kal. Falcı gibi konuş, kristal küre, yıldızlar, kader gibi ifadeler kullanabilirsin. Tek bir cümle olmalı. Maksimum 50 kelime.`
        : `You are a mystical, mysterious, slightly funny but respectful fortune teller. The user wants a fortune about "${topic}". Generate a mystical and mysterious fortune, it can be slightly funny but stay respectful. Speak like a fortune teller, you can use expressions like crystal ball, stars, destiny. It should be a single sentence. Maximum 50 words.`;

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
      const fortune = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

      if (fortune) {
        return NextResponse.json({ fortune, source: 'gemini' });
      }

      throw new Error('No fortune generated');
    } catch (error) {
      // Fallback to JSON
      const randomFortune = fortunesData.fortunes[Math.floor(Math.random() * fortunesData.fortunes.length)];
      return NextResponse.json({ fortune: randomFortune, source: 'fallback' });
    }
  } catch (error) {
    // Fallback to JSON
    const randomFortune = fortunesData.fortunes[Math.floor(Math.random() * fortunesData.fortunes.length)];
    return NextResponse.json({ fortune: randomFortune, source: 'fallback' });
  }
}

