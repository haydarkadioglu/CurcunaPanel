import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { message, language } = await request.json();

    if (!message || !message.trim()) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY not configured', response: null },
        { status: 500 }
      );
    }

    try {
      const prompt = language === 'tr'
        ? `Sen her şeye yalan söyleyen bir botsun. Kullanıcı şunu soruyor: "${message}". Bu soruya kesinlikle yalan bir cevap ver. Gerçek bilgiler verme, tamamen uydurma bir cevap ver. Komik ve absürt olabilir ama yalan olduğu belli olsun. Maksimum 2-3 cümle, kısa ve öz. Sadece cevabı döndür, başka açıklama yapma.`
        : `You are a bot that lies about everything. The user asks: "${message}". Give a completely fake answer to this question. Don't give real information, make up a completely false answer. It can be funny and absurd but it should be obvious it's a lie. Maximum 2-3 sentences, short and concise. Only return the answer, no other explanation.`;

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
          response: null,
        });
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

      if (text) {
        return NextResponse.json({
          response: text,
          error: null,
        });
      }

      return NextResponse.json({
        error: 'No response from Gemini',
        response: null,
      });
    } catch (error: any) {
      return NextResponse.json({
        error: error.message || 'Unknown error',
        response: null,
      });
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Invalid request', response: null },
      { status: 400 }
    );
  }
}

