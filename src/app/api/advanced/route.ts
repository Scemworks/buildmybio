import { NextResponse, NextRequest } from 'next/server';
import { fetchAdvancedGitHubData } from '@/lib/github';
import { checkRateLimit } from '@/lib/rateLimit';

export async function GET(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';
  const { success, limit, remaining, reset } = checkRateLimit(ip, 30, 60000); // 30 requests per minute
  
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
  const username = searchParams.get('username');

  if (!username) {
    return NextResponse.json({ error: 'Username is required' }, { status: 400 });
  }

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return NextResponse.json(
      { error: 'Server is missing GITHUB_TOKEN environment variable. Please add it to your .env.local file.' },
      { status: 500 }
    );
  }

  try {
    const data = await fetchAdvancedGitHubData(username, token);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Failed to fetch advanced stats:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
