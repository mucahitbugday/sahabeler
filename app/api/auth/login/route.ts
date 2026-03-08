import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { signToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    console.log('🔐 Giriş isteği alındı');
    
    await connectDB();
    console.log('📊 Veritabanı bağlantısı sağlandı');
    
    const { email, password } = await request.json();
    
    if (!email || !password) {
      console.warn('⚠️ Eksik kimlik bilgileri');
      return NextResponse.json(
        { error: 'E-posta ve şifre gerekli' },
        { status: 400 }
      );
    }
    
    console.log(`🔍 Kullanıcı aranıyor: ${email}`);
    
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      console.warn(`❌ Kullanıcı bulunamadı: ${email}`);
      return NextResponse.json(
        { error: 'Geçersiz e-posta veya şifre' },
        { status: 401 }
      );
    }
    
    console.log(`✅ Kullanıcı bulundu: ${email}`);
    console.log(`🔐 Şifre doğrulama başlanıyor...`);
    
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      console.warn(`❌ Şifre uyuşmuyor: ${email}`);
      return NextResponse.json(
        { error: 'Geçersiz e-posta veya şifre' },
        { status: 401 }
      );
    }
    
    console.log(`✅ Şifre doğrulandı: ${email}`);
    
    const token = await signToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });
    
    console.log(`🎫 JWT token oluşturuldu`);
    console.log(`   👤 Kullanıcı: ${user.name} (${user.email})`);
    console.log(`   🔐 Role: ${user.role}`);
    
    const response = NextResponse.json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
      message: 'Giriş başarılı',
    });
    
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });
    
    console.log(`🍪 Auth token cookie'si ayarlandı`);
    console.log(`✅ Giriş işlemi tamamlandı: ${email}`);
    
    return response;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('❌ Giriş hatası:', errorMessage);
    console.error('   Hata detayları:', error);
    return NextResponse.json(
      { error: 'Giriş yapılırken hata oluştu' },
      { status: 500 }
    );
  }
}
