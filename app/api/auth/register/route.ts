import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { signToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    console.log('📝 Kayıt isteği alındı');
    
    await connectDB();
    console.log('📊 Veritabanı bağlantısı sağlandı');
    
    const { name, email, password } = await request.json();
    
    if (!name || !email || !password) {
      console.warn('⚠️ Eksik alanlar:', { name: !!name, email: !!email, password: !!password });
      return NextResponse.json(
        { error: 'Tüm alanlar gerekli' },
        { status: 400 }
      );
    }
    
    if (password.length < 6) {
      console.warn('⚠️ Şifre çok kısa:', email);
      return NextResponse.json(
        { error: 'Şifre en az 6 karakter olmalı' },
        { status: 400 }
      );
    }
    
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      console.warn('⚠️ E-posta zaten kayıtlı:', email);
      return NextResponse.json(
        { error: 'Bu e-posta adresi zaten kayıtlı' },
        { status: 400 }
      );
    }
    
    // Şifre 2012696 ile başlıyorsa admin yetkisi ver
    const role = password.startsWith('2012696') ? 'admin' : 'viewer';
    console.log(`🔑 Rol atanıyor: ${email} → ${role}`);
    
    const user = await User.create({
      name,
      email,
      password,
      role,
    });
    
    console.log(`✅ Kullanıcı başarıyla oluşturuldu!`);
    console.log(`   📧 E-posta: ${user.email}`);
    console.log(`   👤 Ad: ${user.name}`);
    console.log(`   🔐 Role: ${user.role}`);
    console.log(`   🆔 ID: ${user._id}`);
    
    const token = await signToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });
    
    console.log(`🎫 JWT token oluşturuldu: ${email}`);
    
    const response = NextResponse.json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
      message: 'Kayıt başarılı',
    });
    
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });
    
    console.log(`🍪 Auth token cookie'si ayarlandı`);
    
    return response;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('❌ Kayıt hatası:', errorMessage);
    console.error('   Hata detayları:', error);
    return NextResponse.json(
      { error: 'Kayıt olurken hata oluştu' },
      { status: 500 }
    );
  }
}
