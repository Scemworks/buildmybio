import { NextResponse } from 'next/server';
import figlet from 'figlet';

export async function GET(request: Request) {
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
