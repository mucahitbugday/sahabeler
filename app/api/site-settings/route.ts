import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import SiteSettings from '@/models/SiteSettings';
import { getSession } from '@/lib/auth';

const DEFAULT_ABOUT = {
  heroTitle: 'Sahabeleri Tanıtmak, Sevdirmek',
  heroDescription:
    'sahabeler.net olarak misyonumuz, Hz. Peygamber\'in (sav) kutlu ashabını günümüz insanına tanıtmak ve onların örnek hayatlarından ilham almamızı sağlamaktır.',
  missionTitle: 'Misyonumuz',
  missionParagraph1:
    'Sahabeler.net, İslam\'ın ilk nesillerini tanıtan kapsamlı bir dijital ansiklopedi olarak kurulmuştur. Amacımız, sahabelerin hayatlarını, onların yaşadığı olayları ve rivayet ettikleri hadisleri herkesin erişebileceği bir platformda sunmaktır.',
  missionParagraph2:
    'Her içeriğimiz, alanında uzman akademisyenler tarafından hazırlanmakta ve muteber kaynaklara dayanmaktadır. Bilginin doğru aktarılması bizim için en önemli önceliktir.',
  stats: {
    sahabeCount: '500+',
    hadithCount: '10,000+',
    monthlyVisitors: '50,000+',
  },
  values: [
    {
      title: 'Güvenilir Kaynaklar',
      description: 'Tüm içeriklerimiz muteber hadis kaynaklarından ve tarih kitaplarından derlenmektedir.',
    },
    {
      title: 'Sevgi ve Saygı',
      description: 'Sahabelere olan sevgi ve saygımızı, onların hayatlarını doğru aktararak gösteriyoruz.',
    },
    {
      title: 'Topluluk',
      description: 'İslam tarihini seven, öğrenmek isteyen herkes için açık bir platform oluşturuyoruz.',
    },
    {
      title: 'Doğruluk',
      description: 'Her bilgiyi titizlikle araştırıyor, kaynaklarıyla birlikte sunuyoruz.',
    },
  ],
  team: [
    { name: 'Dr. Ahmet Yılmaz', role: 'İçerik Editörü', specialty: 'İslam Tarihi' },
    { name: 'Fatma Kaya', role: 'Araştırmacı', specialty: 'Hadis İlimleri' },
    { name: 'Mehmet Demir', role: 'Geliştirici', specialty: 'Web Teknolojileri' },
  ],
  contact: {
    email: 'info@sahabeler.net',
    phone: '+90 212 XXX XX XX',
    address: 'İstanbul, Türkiye',
  },
};

export async function GET() {
  try {
    await connectDB();

    let settings = await SiteSettings.findOne({ key: 'main' }).lean();

    if (!settings) {
      const created = await SiteSettings.create({ key: 'main', about: DEFAULT_ABOUT });
      settings = created.toObject();
    }

    return NextResponse.json({
      settings: {
        id: settings._id.toString(),
        about: settings.about,
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Get site settings error:', errorMessage);
    return NextResponse.json({ error: 'Site ayarları alınamadı' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Bu işlem için admin yetkisi gerekli' }, { status: 403 });
    }

    await connectDB();
    const body = await request.json();

    const updated = await SiteSettings.findOneAndUpdate(
      { key: 'main' },
      { about: body.about, updatedBy: session.userId },
      { new: true, upsert: true }
    );

    return NextResponse.json({
      settings: {
        id: updated._id.toString(),
        about: updated.about,
      },
      message: 'Site ayarları güncellendi',
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Update site settings error:', errorMessage);
    return NextResponse.json({ error: 'Site ayarları güncellenemedi' }, { status: 500 });
  }
}
