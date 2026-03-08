# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Bağımlılıkları yükle
COPY package*.json pnpm-lock.yaml* ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Uygulamayı build et
COPY . .
RUN pnpm build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Node paketi yöneticilerini yükle
RUN npm install -g pnpm

# Sadece production bağımlılıklarını yükle
COPY package*.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile --prod

# Build çıktısını kopyala
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./

# Port'u expose et
EXPOSE 3000

# Environment değişkenleri
ENV NODE_ENV=production
ENV PORT=3000

# Uygulamayı başlat
CMD ["npm", "start"]
