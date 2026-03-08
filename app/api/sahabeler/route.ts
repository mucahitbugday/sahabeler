import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Sahabe from '@/models/Sahabe';
import { getSession } from '@/lib/auth';

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

export async function GET(request: NextRequest) {
  try {
    console.log('📚 Sahabeler listesi isteniyor...');
    await connectDB();
    
    const session = await getSession();
    
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const search = searchParams.get('search') || '';
    const generation = searchParams.get('generation') || '';
    const fourCaliphs = searchParams.get('fourCaliphs') === 'true';
    const status = searchParams.get('status') || '';
    
    // Slug varsa tek sahabe döndür
    if (slug) {
      console.log(`🔍 Slug ile sahabe aranıyor: ${slug}`);
      const sahabe = await Sahabe.findOne({ slug })
        .populate('createdBy', 'name email role')
        .populate('moderatedBy', 'name email role');
      
      if (!sahabe) {
        console.log(`❌ Sahabe bulunamadı: ${slug}`);
        return NextResponse.json(
          { error: 'Sahabe bulunamadı' },
          { status: 404 }
        );
      }

      // Yetki kontrolü
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

      console.log(`✅ Sahabe bulundu: ${sahabe.name}`);
      return NextResponse.json({ sahabe });
    }
    
    const query: Record<string, unknown> = {};
    
    // Normal kullanıcılar sadece onaylı sahabeleri görebilir
    if (!session || session.role === 'viewer') {
      query.status = 'approved';
    } else if (session.role === 'editor') {
      // Editor kendi oluşturduklarını veya onaylı olanları görebilir
      query.$or = [
        { status: 'approved' },
        { createdBy: session.userId },
      ];
    } else if (status) {
      // Moderator ve Admin status filtresi uygulayabilir
      query.status = status;
    }
    
    if (search) {
      query.$and = query.$and || [];
      (query.$and as Record<string, unknown>[]).push({
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { biography: { $regex: search, $options: 'i' } },
        ],
      });
    }
    
    if (generation) {
      query.generation = generation;
    }
    
    if (fourCaliphs) {
      query.$and = query.$and || [];
      (query.$and as Record<string, unknown>[]).push({
        $or: [
          { isFourCaliph: true },
          { name: { $regex: 'Ebubekir|Ömer|Omer|Osman|Ali', $options: 'i' } },
        ],
      });
    }
    
    const skip = (page - 1) * limit;
    
    console.log(`🔍 Query: ${JSON.stringify(query)}`);
    
    const effectiveLimit = fourCaliphs ? 200 : limit;

    const [sahabeler, total] = await Promise.all([
      Sahabe.find(query)
        .populate('createdBy', 'name email')
        .populate('moderatedBy', 'name email')
        .sort(fourCaliphs ? { caliphOrder: 1 } : { views: -1, name: 1 })
        .skip(skip)
        .limit(effectiveLimit)
        .select('-hadiths -events -relations -lifeEvents'),
      Sahabe.countDocuments(query),
    ]);

    const orderedSahabeler = fourCaliphs
      ? sahabeler
        .map((item) => {
          const fixedOrder = getCaliphOrderByName(item.name) ?? (item.caliphOrder || null);
          return {
            item,
            order: fixedOrder,
          };
        })
        .filter((x) => x.order && x.order >= 1 && x.order <= 4)
        .sort((a, b) => Number(a.order) - Number(b.order))
        .map((x) => x.item)
      : sahabeler;
    
    console.log(`✅ ${sahabeler.length} sahabe bulundu (Toplam: ${total})`);
    
    return NextResponse.json({
      sahabeler: (fourCaliphs ? orderedSahabeler.slice(0, 4) : orderedSahabeler).map(s => ({
        id: s._id.toString(),
        name: s.name,
        arabicName: s.arabicName,
        slug: s.slug,
        title: s.title,
        nickname: s.nickname,
        birthYear: s.birthYear,
        birthPlace: s.birthPlace,
        deathYear: s.deathYear,
        deathPlace: s.deathPlace,
        generation: s.generation,
        shortBio: s.shortBio,
        image: s.image,
        isFourCaliph: s.isFourCaliph,
        caliphOrder: s.caliphOrder,
        views: s.views,
        status: s.status,
        createdBy: s.createdBy,
        moderatedBy: s.moderatedBy,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('❌ Sahabeler listesi hatası:', error);
    return NextResponse.json(
      { error: 'Sahabeler alınamadı' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('➕ Yeni sahabe ekleme isteği');
    
    const session = await getSession();
    
    if (!session || !['editor', 'moderator', 'admin'].includes(session.role)) {
      console.warn('⚠️ Yetkisiz sahabe ekleme girişimi:', session?.email);
      return NextResponse.json(
        { error: 'Bu işlem için yetkiniz yok' },
        { status: 403 }
      );
    }
    
    await connectDB();
    
    const data = await request.json();

    const fixedCaliphOrder = getCaliphOrderByName(String(data.name || ''));
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
        metaDescription: data.shortBio || data.biography?.substring(0, 160) || `${data.name} hakkında detaylı bilgi`,
      };
    }
    
    // Status belirleme
    let status = 'draft';
    if (session.role === 'admin') {
      status = 'approved'; // Admin direkt yayınlar
    } else if (session.role === 'moderator') {
      status = 'pending'; // Moderator onaya gönderir
    } else {
      status = 'draft'; // Editor taslak oluşturur
    }
    
    const sahabeData = {
      ...data,
      status,
      createdBy: session.userId,
    };
    
    console.log(`📝 Yeni sahabe: ${data.name} (Status: ${status}, By: ${session.email})`);
    
    const sahabe = await Sahabe.create(sahabeData);
    
    console.log(`✅ Sahabe oluşturuldu: ${sahabe._id}`);
    
    return NextResponse.json({
      sahabe: {
        id: sahabe._id.toString(),
        ...sahabe.toObject(),
      },
      message: 'Sahabe eklendi',
    }, { status: 201 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('❌ Sahabe ekleme hatası:', errorMessage);
    return NextResponse.json(
      { error: 'Sahabe eklenemedi', details: errorMessage },
      { status: 500 }
    );
  }
}
