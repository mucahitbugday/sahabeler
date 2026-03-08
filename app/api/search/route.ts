import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Sahabe from '@/models/Sahabe';
import HistoricalEvent from '@/models/Event';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const limit = parseInt(searchParams.get('limit') || '5');
    
    if (!query || query.length < 2) {
      return NextResponse.json({ results: [] });
    }
    
    const [sahabeler, events] = await Promise.all([
      Sahabe.find({
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { nickname: { $regex: query, $options: 'i' } },
        ],
      })
        .limit(limit)
        .select('name slug image shortBio'),
      HistoricalEvent.find({
        name: { $regex: query, $options: 'i' },
      })
        .limit(limit)
        .select('name slug year image'),
    ]);
    
    const results = [
      ...sahabeler.map(s => ({
        id: s._id.toString(),
        type: 'sahabe' as const,
        name: s.name,
        slug: s.slug,
        image: s.image,
        description: s.shortBio,
      })),
      ...events.map(e => ({
        id: e._id.toString(),
        type: 'event' as const,
        name: e.name,
        slug: e.slug,
        image: e.image,
        description: `${e.year} yılı`,
      })),
    ];
    
    return NextResponse.json({ results });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Arama yapılamadı' },
      { status: 500 }
    );
  }
}
