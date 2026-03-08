'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Loader2, Users } from 'lucide-react';
import { sahabeService } from '@/services/api';

interface Caliph {
  id: string;
  name: string;
  arabicName?: string;
  slug: string;
  title?: string;
  shortBio?: string;
  image?: string;
  caliphOrder?: number;
}

export function FourCaliphs() {
  const [fourCaliphs, setFourCaliphs] = useState<Caliph[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFourCaliphs();
  }, []);

  const fetchFourCaliphs = async () => {
    try {
      const data = await sahabeService.list({ fourCaliphs: true, limit: 4 });
      setFourCaliphs((data.sahabeler as unknown as Caliph[]) || []);
    } catch (error) {
      console.error('Halifeler yükleme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-14 bg-background">
        <div className="container mx-auto px-4 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }
  return (
    <section className="py-14 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex-1">
            <div className="mb-2 h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />
            <h2 className="font-serif text-3xl font-bold text-foreground">Popüler Sahabeler</h2>
          </div>
          <Link 
            href="/sahabeler?filter=dort-halife"
            className="hidden md:flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium"
          >
            Tümünü Gör
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {fourCaliphs.map((caliph, index) => (
            <Link
              key={caliph.id}
              href={`/sahabe/${caliph.slug}`}
              className="group relative bg-card rounded-lg overflow-hidden border border-border hover:border-primary/30 transition-all hover:shadow-lg"
            >
              {/* Order Badge */}
              <div className="absolute top-4 left-4 z-10 h-8 w-8 rounded-full bg-primary/90 text-primary-foreground flex items-center justify-center font-bold text-sm">
                {caliph.caliphOrder || index + 1}
              </div>

              {/* Image */}
              <div className="aspect-[4/3] relative overflow-hidden bg-muted">
                {caliph.image ? (
                  <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url(${caliph.image})`, filter: 'sepia(0.2) saturate(0.9)' }}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-primary/5">
                    <Users className="h-16 w-16 text-primary/30" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/55 to-transparent" />
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-serif text-3xl font-bold text-foreground group-hover:text-primary transition-colors leading-none">
                    {caliph.name}
                  </h3>
                  {caliph.title && (
                    <span className="shrink-0 px-2 py-0.5 text-xs font-medium bg-accent/20 text-accent-foreground rounded">
                      {caliph.title}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4 min-h-10">
                  {caliph.shortBio}
                </p>
                <div className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-primary text-sm font-medium group-hover:gap-3 transition-all">
                  <span>Detayları Gör</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile Link */}
        <div className="mt-8 text-center md:hidden">
          <Link 
            href="/sahabeler?filter=dort-halife"
            className="inline-flex items-center gap-2 text-primary font-medium"
          >
            Tümünü Gör
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
