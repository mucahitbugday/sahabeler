import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Sahabe from '@/models/Sahabe';
import { getSession } from '@/lib/auth';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    console.log('✅ Moderasyon isteği alındı');
    
    const session = await getSession();
    
    if (!session || !['moderator', 'admin'].includes(session.role)) {
      console.warn('⚠️ Yetkisiz moderasyon girişimi:', session?.email);
      return NextResponse.json(
        { error: 'Bu işlem için moderatör veya admin yetkisi gerekli' },
        { status: 403 }
      );
    }
    
    await connectDB();
    
    const { id } = await params;
    const { action, moderationNote } = await request.json();
    
    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'Geçersiz işlem. approve veya reject olmalı' },
        { status: 400 }
      );
    }
    
    const sahabe = await Sahabe.findById(id);
    
    if (!sahabe) {
      return NextResponse.json(
        { error: 'Sahabe bulunamadı' },
        { status: 404 }
      );
    }
    
    // Admin her şeyi onaylayabilir/reddedebilir
    // Moderator sadece pending olanları değiştirebilir
    if (session.role === 'moderator' && sahabe.status !== 'pending') {
      return NextResponse.json(
        { error: 'Sadece onay bekleyen içerikler üzerinde işlem yapabilirsiniz' },
        { status: 403 }
      );
    }
    
    sahabe.status = action === 'approve' ? 'approved' : 'rejected';
    sahabe.moderatedBy = session.userId as unknown as typeof sahabe.moderatedBy;
    if (moderationNote) {
      sahabe.moderationNote = moderationNote;
    }
    
    await sahabe.save();
    
    console.log(`✅ ${action === 'approve' ? 'Onaylandı' : 'Reddedildi'}: ${sahabe.name} (By: ${session.email})`);
    
    return NextResponse.json({
      message: `Sahabe ${action === 'approve' ? 'onaylandı' : 'reddedildi'}`,
      sahabe: {
        id: sahabe._id.toString(),
        name: sahabe.name,
        status: sahabe.status,
        moderatedBy: sahabe.moderatedBy,
        moderationNote: sahabe.moderationNote,
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('❌ Moderasyon hatası:', errorMessage);
    return NextResponse.json(
      { error: 'Moderasyon işlemi başarısız', details: errorMessage },
      { status: 500 }
    );
  }
}
