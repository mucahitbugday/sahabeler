import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IGeneration extends Document {
  _id: mongoose.Types.ObjectId;
  slug: string;
  title: string;
  subtitle: string;
  description?: string;
  image?: string;
  order: number;
  sahabelerCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

const GenerationSchema = new Schema<IGeneration>(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    title: {
      type: String,
      required: [true, 'Başlık gerekli'],
      trim: true,
    },
    subtitle: {
      type: String,
      required: [true, 'Alt başlık gerekli'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: '',
    },
    order: {
      type: Number,
      required: true,
      default: 1,
    },
    sahabelerCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

GenerationSchema.index({ order: 1 });

const Generation: Model<IGeneration> = mongoose.models.Generation || mongoose.model<IGeneration>('Generation', GenerationSchema);

export default Generation;
