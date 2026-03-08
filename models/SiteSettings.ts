import mongoose, { Schema, Document, Model } from 'mongoose';

interface IValueItem {
  title: string;
  description: string;
}

interface ITeamMember {
  name: string;
  role: string;
  specialty: string;
}

interface IAboutContent {
  heroTitle: string;
  heroDescription: string;
  missionTitle: string;
  missionParagraph1: string;
  missionParagraph2: string;
  stats: {
    sahabeCount: string;
    hadithCount: string;
    monthlyVisitors: string;
  };
  values: IValueItem[];
  team: ITeamMember[];
  contact: {
    email: string;
    phone: string;
    address: string;
  };
}

export interface ISiteSettings extends Document {
  _id: mongoose.Types.ObjectId;
  key: string;
  about: IAboutContent;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: 'main',
    },
    about: {
      heroTitle: { type: String, default: '' },
      heroDescription: { type: String, default: '' },
      missionTitle: { type: String, default: '' },
      missionParagraph1: { type: String, default: '' },
      missionParagraph2: { type: String, default: '' },
      stats: {
        sahabeCount: { type: String, default: '' },
        hadithCount: { type: String, default: '' },
        monthlyVisitors: { type: String, default: '' },
      },
      values: [
        {
          title: { type: String, required: true },
          description: { type: String, required: true },
        },
      ],
      team: [
        {
          name: { type: String, required: true },
          role: { type: String, required: true },
          specialty: { type: String, required: true },
        },
      ],
      contact: {
        email: { type: String, default: '' },
        phone: { type: String, default: '' },
        address: { type: String, default: '' },
      },
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const SiteSettings: Model<ISiteSettings> = mongoose.models.SiteSettings || mongoose.model<ISiteSettings>('SiteSettings', SiteSettingsSchema);

export default SiteSettings;
