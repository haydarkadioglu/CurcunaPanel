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
        ? `Sen samimi, küfürbaz, depresif ve absürt bir falcısın. Kullanıcı "${topic}" konusu hakkında bir fal istiyor. Çok yaratıcı, komik, absürt, samimi ve depresif bir fal üret. Küfür kullanabilirsin, saygı sınırlarını aşabilirsin. Çok samimi ve doğal konuş. Tek bir cümle olmalı. Maksimum 50 kelime.`
        : `You are an intimate, profane, depressed and absurd fortune teller. The user wants a fortune about "${topic}". Generate a very creative, funny, absurd, intimate and depressed fortune. You can use profanity, you can push boundaries. Be very intimate and natural. It should be a single sentence. Maximum 50 words.`;

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

