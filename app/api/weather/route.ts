import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const city = searchParams.get('city');
  const lang = searchParams.get('lang') || 'en';

  if (!city) {
    return NextResponse.json(
      { error: 'City parameter is required' },
      { status: 400 }
    );
  }

  // OpenWeatherMap API key - kullanıcı kendi key'ini eklemeli
  const apiKey = process.env.OPENWEATHER_API_KEY;
  
  if (!apiKey) {
    // Fallback: Mock data for development
    return NextResponse.json({
      name: city,
      main: {
        temp: Math.round(Math.random() * 30 + 10),
        feels_like: Math.round(Math.random() * 30 + 10),
        humidity: Math.round(Math.random() * 50 + 30),
      },
      weather: [{
        main: ['Clear', 'Clouds', 'Rain', 'Snow'][Math.floor(Math.random() * 4)],
        description: 'partly cloudy',
      }],
      wind: {
        speed: Math.round(Math.random() * 10 + 2),
      },
    });
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&lang=${lang === 'tr' ? 'tr' : 'en'}`
    );

    if (!response.ok) {
      throw new Error('Weather API error');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: 500 }
    );
  }
}

