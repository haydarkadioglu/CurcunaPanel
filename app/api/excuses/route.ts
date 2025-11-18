import { NextRequest, NextResponse } from 'next/server';
import excusesData from '@/data/excuses.json';

export async function POST(request: NextRequest) {
  try {
    const { topic, language } = await request.json();

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Fallback to JSON
      const randomExcuse = excusesData.excuses[Math.floor(Math.random() * excusesData.excuses.length)];
      return NextResponse.json({ excuse: randomExcuse, source: 'fallback' });
    }

    try {
      const prompt = language === 'tr' 
        ? `Sen gerçekçi ama yalan olduğu açıkça belli olan bahaneler üreten bir bahane üreticisisin. Kullanıcı "${topic}" konusu hakkında bir bahane istiyor. Gerçekçi görünen ama yalan olduğu belli olan, komik ve absürt bir bahane üret. Normal, günlük hayattan bahaneler kullan ama yalan olduğu açıkça anlaşılsın. Sadece bahane metnini döndür, başka açıklama yapma. Maksimum 1-2 cümle, kısa ve öz.`
        : `You are an excuse generator that creates realistic excuses that are obviously fake. The user wants an excuse about "${topic}". Generate a realistic-looking but obviously fake, funny and absurd excuse. Use normal, everyday excuses but make it clear they are lies. Only return the excuse text, no other explanation. Maximum 1-2 sentences, short and concise.`;

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
      const excuse = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

      if (excuse) {
        return NextResponse.json({ excuse, source: 'gemini' });
      }

      throw new Error('No excuse generated');
    } catch (error) {
      // Fallback to JSON
      const randomExcuse = excusesData.excuses[Math.floor(Math.random() * excusesData.excuses.length)];
      return NextResponse.json({ excuse: randomExcuse, source: 'fallback' });
    }
  } catch (error) {
    // Fallback to JSON
    const randomExcuse = excusesData.excuses[Math.floor(Math.random() * excusesData.excuses.length)];
    return NextResponse.json({ excuse: randomExcuse, source: 'fallback' });
  }
}

