import mongoose, { Schema, Document, Model } from 'mongoose';

export interface INote extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  sahabeId: mongoose.Types.ObjectId;
  sahabeName: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const NoteSchema = new Schema<INote>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    sahabeId: {
      type: Schema.Types.ObjectId,
      ref: 'Sahabe',
      required: true,
    },
    sahabeName: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: [true, 'Not içeriği gerekli'],
      maxlength: [5000, 'Not en fazla 5000 karakter olabilir'],
    },
  },
  {
    timestamps: true,
  }
);

NoteSchema.index({ userId: 1, sahabeId: 1 });

const Note: Model<INote> = mongoose.models.Note || mongoose.model<INote>('Note', NoteSchema);

export default Note;
