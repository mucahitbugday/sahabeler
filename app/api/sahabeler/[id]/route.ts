import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Sahabe from '@/models/Sahabe';
import { getSession, requireAuth } from '@/lib/auth';

function normalizeName(value: string) {
  return (value || '')
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/[üû]/g, 'u')
    .replace(/ş/g, 's')
    .replace(/[ıî]/g, 'i')
    .replace(/[öô]/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9\s.]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function getCaliphOrderByName(name?: string): number | null {
  const normalized = normalizeName(name || '');
  if (!normalized) return null;

  if (/^(hz\.?\s*)?ebu\s*bek(ir|r)\b/.test(normalized)) return 1;
  if (/^(hz\.?\s*)?(o|ö)?mer(\s+bin\s+hattab)?\b/.test(normalized)) return 2;
  if (/^(hz\.?\s*)?osman(\s+bin\s+affan)?\b/.test(normalized)) return 3;
  if (/^(hz\.?\s*)?ali(\s+bin\s+ebi\s+talib)?\b/.test(normalized)) return 4;

  return null;
}

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET - Sahabe detayını getir
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    console.log(`🔍 Sahabe getiriliyor: ${id}`);
    
    await connectDB();
    
    const sahabe = await Sahabe.findById(id)
      .populate('createdBy', 'name email role')
      .populate('moderatedBy', 'name email role');
    
    if (!sahabe) {
      console.log(`❌ Sahabe bulunamadı: ${id}`);
      return NextResponse.json(
        { error: 'Sahabe bulunamadı' },
        { status: 404 }
      );
    }

    // Status kontrolü - sadece onaylı içerikler veya kendi içerikleri görebilir
    const session = await getSession();
    if (
      sahabe.status !== 'approved' &&
      (!session || 
       (session.role === 'viewer') ||
       (session.role === 'editor' && sahabe.createdBy._id.toString() !== session.userId)
      )
    ) {
      return NextResponse.json(
        { error: 'Bu içeriği görüntüleme yetkiniz yok' },
        { status: 403 }
      );
    }
    
    console.log(`✅ Sahabe getirildi: ${sahabe.name}`);
    
    return NextResponse.json({ sahabe });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('❌ Sahabe getirme hatası:', errorMessage);
    return NextResponse.json(
      { error: 'Sahabe getirilemedi', details: errorMessage },
      { status: 500 }
    );
  }
}

// PUT - Sahabe güncelle
export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const session = await requireAuth();
    
    console.log(`📝 Sahabe güncelleniyor: ${id} (By: ${session.email})`);
    
    await connectDB();
    
    const sahabe = await Sahabe.findById(id);
    
    if (!sahabe) {
      return NextResponse.json(
        { error: 'Sahabe bulunamadı' },
        { status: 404 }
      );
    }

    // Yetki kontrolü
    // Admin her şeyi düzenleyebilir
    // Moderator onaylı olmayan içerikleri düzenleyebilir
    // Editor sadece kendi taslak ve reddedilmiş içeriklerini düzenleyebilir
    if (session.role === 'editor') {
      if (
        sahabe.createdBy.toString() !== session.userId ||
        (sahabe.status !== 'draft' && sahabe.status !== 'rejected')
      ) {
        return NextResponse.json(
          { error: 'Bu içeriği düzenleme yetkiniz yok' },
          { status: 403 }
        );
      }
    } else if (session.role === 'moderator') {
      if (sahabe.status === 'approved') {
        return NextResponse.json(
          { error: 'Onaylanmış içerikleri düzenleyemezsiniz' },
          { status: 403 }
        );
      }
    }
    
    const data = await request.json();

    const fixedCaliphOrder = getCaliphOrderByName(String(data.name || sahabe.name || ''));
    if (fixedCaliphOrder) {
      data.isFourCaliph = true;
      data.caliphOrder = fixedCaliphOrder;
    }
    
    // SEO alanlarını otomatik doldur
    if (!data.seo?.metaTitle) {
      data.seo = {
        ...data.seo,
        metaTitle: `${data.name} - ${data.title || 'Sahabe'} | Sahabeler.net`,
      };
    }
    
    if (!data.seo?.metaDescription) {
      data.seo = {
        ...data.seo,
        metaDescription: data.shortBio || data.biography?.substring(0, 160) || '',
      };
    }

    // Güncelleme
    Object.assign(sahabe, data);
    
    // Düzenleme sonrası status güncelleme
    if (session.role === 'editor' && sahabe.status === 'rejected') {
      sahabe.status = 'draft'; // Reddedilmiş içerik düzenlenince tekrar taslak olur
    }
    
    await sahabe.save();
    
    console.log(`✅ Sahabe güncellendi: ${sahabe.name}`);
    
    return NextResponse.json({
      sahabe,
      message: 'Sahabe güncellendi',
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('❌ Sahabe güncelleme hatası:', errorMessage);
    return NextResponse.json(
      { error: 'Sahabe güncellenemedi', details: errorMessage },
      { status: 500 }
    );
  }
}

// DELETE - Sahabe sil
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const session = await requireAuth();
    
    console.log(`🗑️ Sahabe siliniyor: ${id} (By: ${session.email})`);
    
    await connectDB();
    
    const sahabe = await Sahabe.findById(id);
    
    if (!sahabe) {
      return NextResponse.json(
        { error: 'Sahabe bulunamadı' },
        { status: 404 }
      );
    }

    // Yetki kontrolü
    // Admin her şeyi silebilir
    // Editor sadece kendi taslak içeriklerini silebilir
    // Moderator silemez
    if (session.role === 'editor') {
      if (
        sahabe.createdBy.toString() !== session.userId ||
        sahabe.status !== 'draft'
      ) {
        return NextResponse.json(
          { error: 'Sadece kendi taslak içeriklerinizi silebilirsiniz' },
          { status: 403 }
        );
      }
    } else if (session.role === 'moderator') {
      return NextResponse.json(
        { error: 'Moderatörler içerik silemez' },
        { status: 403 }
      );
    }
    
    await Sahabe.findByIdAndDelete(id);
    
    console.log(`✅ Sahabe silindi: ${sahabe.name}`);
    
    return NextResponse.json({
      message: 'Sahabe silindi',
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('❌ Sahabe silme hatası:', errorMessage);
    return NextResponse.json(
      { error: 'Sahabe silinemedi', details: errorMessage },
      { status: 500 }
    );
  }
}
