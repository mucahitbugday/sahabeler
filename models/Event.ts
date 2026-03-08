import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IHistoricalEvent extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  year: number;
  description: string;
  fullDescription?: string;
  image?: string;
  participants: mongoose.Types.ObjectId[];
  importance: 'low' | 'medium' | 'high';
  category: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  createdBy: mongoose.Types.ObjectId;
  moderatedBy?: mongoose.Types.ObjectId;
  moderationNote?: string;
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
    ogImage?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const HistoricalEventSchema = new Schema<IHistoricalEvent>(
  {
    name: {
      type: String,
      required: [true, 'Olay adı gerekli'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    year: {
      type: Number,
      required: [true, 'Yıl gerekli'],
    },
    description: {
      type: String,
      required: [true, 'Açıklama gerekli'],
    },
    fullDescription: String,
    image: String,
    participants: [{
      type: Schema.Types.ObjectId,
      ref: 'Sahabe',
    }],
    importance: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    category: {
      type: String,
      default: 'genel',
    },
    status: {
      type: String,
      enum: ['draft', 'pending', 'approved', 'rejected'],
      default: 'draft',
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    moderatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    moderationNote: String,
    seo: {
      metaTitle: String,
      metaDescription: String,
      keywords: [String],
      ogImage: String,
    },
  },
  {
    timestamps: true,
  }
);

HistoricalEventSchema.index({ year: 1 });

const HistoricalEvent: Model<IHistoricalEvent> = mongoose.models.HistoricalEvent || mongoose.model<IHistoricalEvent>('HistoricalEvent', HistoricalEventSchema);

export default HistoricalEvent;
