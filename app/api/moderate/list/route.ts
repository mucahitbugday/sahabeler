import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Sahabe from '@/models/Sahabe';
import { getSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    console.log('📋 Moderasyon listesi isteniyor');
    
    const session = await getSession();
    
    if (!session || !['moderator', 'admin'].includes(session.role)) {
      return NextResponse.json(
        { error: 'Bu işlem için moderatör veya admin yetkisi gerekli' },
        { status: 403 }
      );
    }
    
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'pending';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    
    const skip = (page - 1) * limit;
    
    const query: Record<string, unknown> = {};
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    const [items, total] = await Promise.all([
      Sahabe.find(query)
        .populate('createdBy', 'name email role')
        .populate('moderatedBy', 'name email')
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('name arabicName slug status createdBy moderatedBy moderationNote createdAt updatedAt'),
      Sahabe.countDocuments(query),
    ]);
    
    // Durum istatistikleri
    const stats = await Sahabe.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);
    
    const statusStats = {
      draft: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
    };
    
    stats.forEach(stat => {
      statusStats[stat._id as keyof typeof statusStats] = stat.count;
    });
    
    console.log(`✅ ${items.length} moderasyon kaydı bulundu`);
    
    return NextResponse.json({
      items: items.map(item => ({
        id: item._id.toString(),
        name: item.name,
        arabicName: item.arabicName,
        slug: item.slug,
        status: item.status,
        createdBy: item.createdBy,
        moderatedBy: item.moderatedBy,
        moderationNote: item.moderationNote,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      })),
      stats: statusStats,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('❌ Moderasyon listesi hatası:', errorMessage);
    return NextResponse.json(
      { error: 'Moderasyon listesi alınamadı', details: errorMessage },
      { status: 500 }
    );
  }
}
