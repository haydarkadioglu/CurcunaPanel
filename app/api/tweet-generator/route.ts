import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { topic, language } = await request.json();

    if (!topic || !topic.trim()) {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY not configured', tweet: null },
        { status: 500 }
      );
    }

    try {
      const prompt = language === 'tr'
        ? `Sen yaratıcı bir tweet üreticisisin. Kullanıcı "${topic}" konusu hakkında bir tweet istiyor. Bu konuda ilham verici, düşündürücü, komik veya derin bir tweet üret. Tweet formatında yaz, hashtag kullanabilirsin ama abartma. Maksimum 2-3 cümle, kısa ve öz. Twitter karakter limitine uygun (280 karakter). Sadece tweet metnini döndür, başka açıklama yapma.`
        : `You are a creative tweet generator. The user wants a tweet about "${topic}". Generate an inspiring, thought-provoking, funny or deep tweet about this topic. Write in tweet format, you can use hashtags but don't overdo it. Maximum 2-3 sentences, short and concise. Keep it within Twitter character limit (280 characters). Only return the tweet text, no other explanation.`;

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
                text: prompt.trim()
              }]
            }]
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return NextResponse.json({
          error: errorData.error?.message || `HTTP ${response.status}`,
          tweet: null,
        });
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

      if (text) {
        // Remove quotes if the response is wrapped in quotes
        const cleanedText = text.replace(/^["']|["']$/g, '');
        return NextResponse.json({
          tweet: cleanedText,
          error: null,
        });
      }

      return NextResponse.json({
        error: 'No tweet generated',
        tweet: null,
      });
    } catch (error: any) {
      return NextResponse.json({
        error: error.message || 'Unknown error',
        tweet: null,
      });
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Invalid request', tweet: null },
      { status: 400 }
    );
  }
}

