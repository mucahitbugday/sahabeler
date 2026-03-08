import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  avatar?: string;
  role: 'viewer' | 'editor' | 'moderator' | 'admin';
  bio?: string;
  socialMedia?: {
    twitter?: string;
    instagram?: string;
    facebook?: string;
    linkedin?: string;
  };
  favoritesSahabeler: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Ad soyad gerekli'],
      trim: true,
      maxlength: [100, 'Ad soyad en fazla 100 karakter olabilir'],
    },
    email: {
      type: String,
      required: [true, 'E-posta gerekli'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Geçerli bir e-posta adresi girin'],
    },
    password: {
      type: String,
      required: [true, 'Şifre gerekli'],
      minlength: [6, 'Şifre en az 6 karakter olmalı'],
      select: false,
    },
    avatar: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      enum: ['viewer', 'editor', 'moderator', 'admin'],
      default: 'viewer',
    },
    bio: {
      type: String,
      maxlength: [500, 'Biyografi en fazla 500 karakter olabilir'],
      default: '',
    },
    socialMedia: {
      twitter: { type: String, default: '' },
      instagram: { type: String, default: '' },
      facebook: { type: String, default: '' },
      linkedin: { type: String, default: '' },
    },
    favoritesSahabeler: [{
      type: Schema.Types.ObjectId,
      ref: 'Sahabe',
    }],
  },
  {
    timestamps: true,
  }
);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    console.log('🔐 Şifre başarıyla hashlanmıştır:', this.email);
    next();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('❌ Şifre hashlama hatası:', errorMessage);
    next(error instanceof Error ? error : new Error(String(error)));
  }
});

UserSchema.pre('save', function (next) {
  if (this.isNew) {
    console.log(`👤 Yeni kullanıcı oluşturuluyor: ${this.email} (Role: ${this.role})`);
  } else {
    console.log(`✏️ Kullanıcı güncelleniyor: ${this.email}`);
  }
  next();
});

UserSchema.post('save', function () {
  console.log(`✅ Kullanıcı başarıyla kaydedildi: ${this.email}`);
});

UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
