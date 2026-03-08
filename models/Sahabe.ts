import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IHadith {
  id: string;
  text: string;
  source: string;
  narrator?: string;
}

export interface IRelation {
  sahabeId: mongoose.Types.ObjectId | string;
  name: string;
  relationType: string;
  image?: string;
}

export interface IEvent {
  id: string;
  name: string;
  year: number;
  description?: string;
  image?: string;
}

export interface ILifeEvent {
  year: number;
  title: string;
  description: string;
}

export interface ISahabe extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  arabicName?: string;
  slug: string;
  title?: string;
  nickname?: string;
  birthYear?: number;
  birthPlace?: string;
  deathYear?: number;
  deathPlace?: string;
  grave?: string;
  generation: 'sahabe' | 'tabiin' | 'tebe-i-tabiin';
  biography: string;
  shortBio?: string;
  image?: string;
  headerImage?: string;
  hadiths: IHadith[];
  events: IEvent[];
  relations: IRelation[];
  lifeEvents: ILifeEvent[];
  isFourCaliph: boolean;
  caliphOrder?: number;
  views: number;
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

const HadithSchema = new Schema({
  id: String,
  text: { type: String, required: true },
  source: { type: String, required: true },
  narrator: String,
});

const RelationSchema = new Schema({
  sahabeId: { type: Schema.Types.ObjectId, ref: 'Sahabe' },
  name: { type: String, required: true },
  relationType: { type: String, required: true },
  image: String,
});

const EventSchema = new Schema({
  id: String,
  name: { type: String, required: true },
  year: { type: Number, required: true },
  description: String,
  image: String,
});

const LifeEventSchema = new Schema({
  year: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
});

const SahabeSchema = new Schema<ISahabe>(
  {
    name: {
      type: String,
      required: [true, 'İsim gerekli'],
      trim: true,
    },
    arabicName: String,
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    title: String,
    nickname: String,
    birthYear: Number,
    birthPlace: String,
    deathYear: Number,
    deathPlace: String,
    grave: String,
    generation: {
      type: String,
      enum: ['sahabe', 'tabiin', 'tebe-i-tabiin'],
      default: 'sahabe',
    },
    biography: {
      type: String,
      required: true,
    },
    shortBio: String,
    image: String,
    headerImage: String,
    hadiths: [HadithSchema],
    events: [EventSchema],
    relations: [RelationSchema],
    lifeEvents: [LifeEventSchema],
    isFourCaliph: {
      type: Boolean,
      default: false,
    },
    caliphOrder: Number,
    views: {
      type: Number,
      default: 0,
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

SahabeSchema.index({ name: 'text', biography: 'text' });
SahabeSchema.index({ generation: 1 });
SahabeSchema.index({ isFourCaliph: 1 });

const Sahabe: Model<ISahabe> = mongoose.models.Sahabe || mongoose.model<ISahabe>('Sahabe', SahabeSchema);

export default Sahabe;
