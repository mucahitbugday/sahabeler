import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sahabeler';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) {
    console.log('✅ Veritabanı bağlantısı zaten aktif (cached)');
    return cached.conn;
  }

  if (!cached.promise) {
    console.log('🔄 MongoDB bağlantısı başlatılıyor...');
    console.log(`📍 Bağlantı adresi: ${MONGODB_URI}`);

    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('✅ MongoDB bağlantısı başarıyla kuruldu!');
      console.log(`📊 Veritabanı: ${mongoose.connection.name}`);
      console.log(`🔗 Bağlantı durumu: ${mongoose.connection.readyState === 1 ? 'Bağlı' : 'Bağlanmadı'}`);
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
    console.log('📦 Mongoose cache olusturuldu');
  } catch (error) {
    cached.promise = null;
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('❌ MongoDB bağlantı hatası:', errorMessage);
    throw new Error(`MongoDB bağlantı hatası: ${errorMessage}`);
  }

  return cached.conn;
}

export default connectDB;
