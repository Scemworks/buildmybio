import { NextResponse, NextRequest } from 'next/server';
import figlet from 'figlet';
import ansiShadowFont from 'figlet/fonts/ANSI Shadow';
import { checkRateLimit } from '@/lib/rateLimit';

// Pre-parse the font so it's bundled into the serverless function
// instead of relying on filesystem access (which fails on Vercel).
figlet.parseFont('ANSI Shadow', ansiShadowFont);

export async function GET(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';
  const { success, limit, remaining, reset } = checkRateLimit(ip, 60, 60000); // 60 requests per minute
  
  if (!success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { 
        status: 429,
        headers: {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': reset.toString(),
        }
      }
    );
  }

  const { searchParams } = new URL(request.url);
  const text = searchParams.get('text');
  
  if (!text) {
    return NextResponse.json({ error: 'Text is required' }, { status: 400 });
  }

  try {
    const ascii = await new Promise<string>((resolve, reject) => {
      figlet.text(text, { font: 'ANSI Shadow' }, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data || '');
        }
      });
    });

    return new NextResponse(ascii, {
      headers: { 'Content-Type': 'text/plain' }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate ASCII art' }, { status: 500 });
  }
}
