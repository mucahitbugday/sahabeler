import { NextRequest, NextResponse } from 'next/server';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { requireAuth } from '@/lib/auth';

const MAX_FILE_SIZE = 5 * 1024 * 1024;

function getSafeExtension(fileName: string, mimeType: string) {
  const extFromName = path.extname(fileName || '').toLowerCase();
  const allowed = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif']);
  if (allowed.has(extFromName)) return extFromName;

  if (mimeType === 'image/jpeg') return '.jpg';
  if (mimeType === 'image/png') return '.png';
  if (mimeType === 'image/webp') return '.webp';
  if (mimeType === 'image/gif') return '.gif';
  if (mimeType === 'image/avif') return '.avif';
  return '.jpg';
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth();

    const form = await request.formData();
    const file = form.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Dosya bulunamadı' }, { status: 400 });
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Sadece resim dosyası yüklenebilir' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'Dosya boyutu 5MB sınırını aşıyor' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const extension = getSafeExtension(file.name, file.type);
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}${extension}`;

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });

    const fullPath = path.join(uploadDir, fileName);
    await writeFile(fullPath, buffer);

    return NextResponse.json({
      message: 'Yükleme başarılı',
      url: `/uploads/${fileName}`,
    });
  } catch (error) {
    const details = error instanceof Error ? error.message : 'Bilinmeyen hata';
    return NextResponse.json({ error: 'Yükleme başarısız', details }, { status: 500 });
  }
}
