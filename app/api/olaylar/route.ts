import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import HistoricalEvent from '@/models/Event';
import { getSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const category = searchParams.get('category') || '';
    const sortOrder = searchParams.get('sort') === 'desc' ? -1 : 1;
    
    const status = searchParams.get('status') || '';
    const query: Record<string, unknown> = {};

    if (!session || session.role === 'viewer') {
      query.status = 'approved';
    } else if (session.role === 'editor') {
      query.$or = [
        { status: 'approved' },
        { createdBy: session.userId },
      ];
    } else if (status) {
      query.status = status;
    }
    
    if (category) {
      query.category = category;
    }

    if (slug) {
      const event = await HistoricalEvent.findOne({ slug })
        .populate('participants', 'name slug image')
        .populate('createdBy', 'name email role')
        .populate('moderatedBy', 'name email role');

      if (!event) {
        return NextResponse.json({ error: 'Olay bulunamadı' }, { status: 404 });
      }

      if (
        event.status !== 'approved' &&
        (!session ||
          session.role === 'viewer' ||
          (session.role === 'editor' && String(event.createdBy?._id || event.createdBy) !== session.userId))
      ) {
        return NextResponse.json({ error: 'Bu içeriği görüntüleme yetkiniz yok' }, { status: 403 });
      }

      return NextResponse.json({
        event: {
          id: event._id.toString(),
          name: event.name,
          title: event.name,
          slug: event.slug,
          year: event.year,
          description: event.description,
          fullDescription: event.fullDescription,
          image: event.image,
          imageUrl: event.image,
          participants: event.participants,
          importance: event.importance,
          category: event.category,
          status: event.status,
          seo: event.seo,
        },
      });
    }
    
    const skip = (page - 1) * limit;
    
    const [events, total] = await Promise.all([
      HistoricalEvent.find(query)
        .sort({ year: sortOrder })
        .skip(skip)
        .limit(limit)
        .populate('participants', 'name slug image'),
      HistoricalEvent.countDocuments(query),
    ]);
    
    return NextResponse.json({
      events: events.map(e => ({
        id: e._id.toString(),
        name: e.name,
        title: e.name,
        slug: e.slug,
        year: e.year,
        description: e.description,
        fullDescription: e.fullDescription,
        image: e.image,
        imageUrl: e.image,
        participants: e.participants,
        importance: e.importance,
        category: e.category,
        status: e.status,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get events error:', error);
    return NextResponse.json(
      { error: 'Olaylar alınamadı' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session || !['editor', 'moderator', 'admin'].includes(session.role)) {
      return NextResponse.json(
        { error: 'Bu işlem için yetkiniz yok' },
        { status: 403 }
      );
    }
    
    await connectDB();
    
    const data = await request.json();

    if (!data.seo?.metaTitle) {
      data.seo = {
        ...data.seo,
        metaTitle: `${data.name} | Sahabeler.net`,
      };
    }

    if (!data.seo?.metaDescription) {
      data.seo = {
        ...data.seo,
        metaDescription: data.description || `${data.name} olayı hakkında bilgi`,
      };
    }

    let status = 'draft';
    if (session.role === 'admin') status = 'approved';
    if (session.role === 'moderator') status = 'pending';

    const event = await HistoricalEvent.create({
      ...data,
      status,
      createdBy: session.userId,
    });
    
    return NextResponse.json({
      event: {
        id: event._id.toString(),
        ...event.toObject(),
      },
      message: 'Olay eklendi',
    }, { status: 201 });
  } catch (error) {
    console.error('Create event error:', error);
    return NextResponse.json(
      { error: 'Olay eklenemedi' },
      { status: 500 }
    );
  }
}
