import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Generation from '@/models/Generation';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    await connectDB();

    const generations = await Generation.find({})
      .sort({ order: 1 })
      .lean();

    return NextResponse.json({
      generations: generations.map((item) => ({
        id: item._id.toString(),
        slug: item.slug,
        title: item.title,
        subtitle: item.subtitle,
        description: item.description,
        image: item.image,
        order: item.order,
        sahabelerCount: item.sahabelerCount,
      })),
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Get generations error:', errorMessage);
    return NextResponse.json({ error: 'Nesiller alınamadı' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session || !['editor', 'moderator', 'admin'].includes(session.role)) {
      return NextResponse.json({ error: 'Bu işlem için yetkiniz yok' }, { status: 403 });
    }

    await connectDB();
    const data = await request.json();

    const created = await Generation.create(data);

    return NextResponse.json({
      generation: {
        id: created._id.toString(),
        slug: created.slug,
        title: created.title,
        subtitle: created.subtitle,
        description: created.description,
        image: created.image,
        order: created.order,
        sahabelerCount: created.sahabelerCount,
      },
      message: 'Nesil eklendi',
    }, { status: 201 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Create generation error:', errorMessage);
    return NextResponse.json({ error: 'Nesil eklenemedi' }, { status: 500 });
  }
}
