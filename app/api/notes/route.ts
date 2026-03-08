import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Note from '@/models/Note';
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
    
    const notes = await Note.find({ userId: session.userId })
      .sort({ updatedAt: -1 })
      .populate('sahabeId', 'name slug image');
    
    return NextResponse.json({
      notes: notes.map(n => ({
        id: n._id.toString(),
        sahabeId: n.sahabeId,
        sahabeName: n.sahabeName,
        content: n.content,
        createdAt: n.createdAt,
        updatedAt: n.updatedAt,
      })),
    });
  } catch (error) {
    console.error('Get notes error:', error);
    return NextResponse.json(
      { error: 'Notlar alınamadı' },
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
    
    const { sahabeId, sahabeName, content } = await request.json();
    
    if (!sahabeId || !content) {
      return NextResponse.json(
        { error: 'Sahabe ve içerik gerekli' },
        { status: 400 }
      );
    }
    
    const note = await Note.create({
      userId: session.userId,
      sahabeId,
      sahabeName,
      content,
    });
    
    return NextResponse.json({
      note: {
        id: note._id.toString(),
        sahabeId: note.sahabeId,
        sahabeName: note.sahabeName,
        content: note.content,
        createdAt: note.createdAt,
        updatedAt: note.updatedAt,
      },
      message: 'Not eklendi',
    }, { status: 201 });
  } catch (error) {
    console.error('Create note error:', error);
    return NextResponse.json(
      { error: 'Not eklenemedi' },
      { status: 500 }
    );
  }
}
