import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Sahabe from '@/models/Sahabe';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Oturum gerekli' },
        { status: 401 }
      );
    }
    
    await connectDB();
    
    const user = await User.findById(session.userId)
      .populate('favoritesSahabeler', 'name slug image shortBio');
    
    if (!user) {
      return NextResponse.json(
        { error: 'Kullanıcı bulunamadı' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      favorites: user.favoritesSahabeler,
    });
  } catch (error) {
    console.error('Get favorites error:', error);
    return NextResponse.json(
      { error: 'Favoriler alınamadı' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Oturum gerekli' },
        { status: 401 }
      );
    }
    
    await connectDB();
    
    const { sahabeId } = await request.json();
    
    const sahabe = await Sahabe.findById(sahabeId);
    
    if (!sahabe) {
      return NextResponse.json(
        { error: 'Sahabe bulunamadı' },
        { status: 404 }
      );
    }
    
    const user = await User.findByIdAndUpdate(
      session.userId,
      { $addToSet: { favoritesSahabeler: sahabeId } },
      { new: true }
    ).populate('favoritesSahabeler', 'name slug image shortBio');
    
    return NextResponse.json({
      favorites: user?.favoritesSahabeler || [],
      message: 'Favorilere eklendi',
    });
  } catch (error) {
    console.error('Add favorite error:', error);
    return NextResponse.json(
      { error: 'Favorilere eklenemedi' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Oturum gerekli' },
        { status: 401 }
      );
    }
    
    await connectDB();
    
    const { sahabeId } = await request.json();
    
    const user = await User.findByIdAndUpdate(
      session.userId,
      { $pull: { favoritesSahabeler: sahabeId } },
      { new: true }
    ).populate('favoritesSahabeler', 'name slug image shortBio');
    
    return NextResponse.json({
      favorites: user?.favoritesSahabeler || [],
      message: 'Favorilerden kaldırıldı',
    });
  } catch (error) {
    console.error('Remove favorite error:', error);
    return NextResponse.json(
      { error: 'Favorilerden kaldırılamadı' },
      { status: 500 }
    );
  }
}
