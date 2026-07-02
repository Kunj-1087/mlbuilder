import { NextResponse } from 'next/server';
import { buildSearchIndex } from '@/lib/search/searchIndex';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const items = await buildSearchIndex();
    return NextResponse.json(items, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=59',
      },
    });
  } catch (error) {
    console.error('Error in search index route:', error);
    return NextResponse.json({ error: 'Failed to build search index' }, { status: 500 });
  }
}
