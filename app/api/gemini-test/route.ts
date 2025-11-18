import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt || !prompt.trim()) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY not configured', response: null, source: 'error' },
        { status: 500 }
      );
    }

    try {
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
          source: 'error',
          status: response.status,
        });
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

      if (text) {
        return NextResponse.json({
          response: text,
          source: 'gemini',
          error: null,
        });
      }

      return NextResponse.json({
        error: 'No response from Gemini',
        response: null,
        source: 'error',
      });
    } catch (error: any) {
      return NextResponse.json({
        error: error.message || 'Unknown error',
        response: null,
        source: 'error',
      });
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Invalid request', response: null, source: 'error' },
      { status: 400 }
    );
  }
}

