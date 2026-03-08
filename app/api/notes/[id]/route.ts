import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Note from '@/models/Note';
import { getSession } from '@/lib/auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Oturum gerekli' },
        { status: 401 }
      );
    }
    
    await connectDB();
    
    const { id } = await params;
    const { content } = await request.json();
    
    const note = await Note.findOneAndUpdate(
      { _id: id, userId: session.userId },
      { content },
      { new: true }
    );
    
    if (!note) {
      return NextResponse.json(
        { error: 'Not bulunamadı' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      note: {
        id: note._id.toString(),
        sahabeId: note.sahabeId,
        sahabeName: note.sahabeName,
        content: note.content,
        createdAt: note.createdAt,
        updatedAt: note.updatedAt,
      },
      message: 'Not güncellendi',
    });
  } catch (error) {
    console.error('Update note error:', error);
    return NextResponse.json(
      { error: 'Not güncellenemedi' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Oturum gerekli' },
        { status: 401 }
      );
    }
    
    await connectDB();
    
    const { id } = await params;
    
    const note = await Note.findOneAndDelete({
      _id: id,
      userId: session.userId,
    });
    
    if (!note) {
      return NextResponse.json(
        { error: 'Not bulunamadı' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      message: 'Not silindi',
    });
  } catch (error) {
    console.error('Delete note error:', error);
    return NextResponse.json(
      { error: 'Not silinemedi' },
      { status: 500 }
    );
  }
}
