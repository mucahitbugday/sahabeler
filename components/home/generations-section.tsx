'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Loader2 } from 'lucide-react';
import { generationService } from '@/services/api';

interface GenerationItem {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description?: string;
  image?: string;
}

export function GenerationsSection() {
  const [generations, setGenerations] = useState<GenerationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGenerations = async () => {
      try {
        const data = await generationService.list();
        const mapped = (data.generations || []).map((generation) => ({
          id: String(generation.id || ''),
          slug: String(generation.slug || ''),
          title: String(generation.title || ''),
          subtitle: String(generation.subtitle || ''),
          description: generation.description ? String(generation.description) : undefined,
          image: generation.image ? String(generation.image) : undefined,
        }));
        setGenerations(mapped);
      } catch (error) {
        console.error('Nesiller yüklenemedi:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGenerations();
  }, []);

  return (
    <section className="py-14 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <div className="mb-3 h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />
          <h2 className="font-serif text-3xl font-bold text-foreground mb-3">İslam&apos;ın Nesilleri</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Peygamber Efendimizden başlayarak günümüze kadar uzanan kutlu silsile
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {generations.map((generation, index) => (
              <Link
                key={generation.id}
                href={`/${generation.slug}`}
                className="group relative overflow-hidden rounded-lg border border-border aspect-[16/10] md:aspect-[4/3]"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${generation.image || '/placeholder.svg'})`, filter: 'sepia(0.2) saturate(0.9)' }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-foreground/75 via-foreground/35 to-foreground/15 group-hover:from-primary/85 group-hover:via-primary/50 transition-colors duration-500" />

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                  <div className="absolute top-4 left-4 h-8 w-8 rounded-full bg-background/20 backdrop-blur flex items-center justify-center text-background font-bold text-sm">
                    {index + 1}
                  </div>

                  <h3 className="font-serif text-4xl font-bold text-background mb-2 tracking-wide">{generation.title}</h3>
                  <p className="text-background/80 text-sm md:text-base mb-4">{generation.subtitle}</p>

                  {generation.description ? (
                    <p className="text-background/60 text-sm max-w-xs hidden md:block mb-4">{generation.description}</p>
                  ) : null}

                  <div className="flex items-center gap-2 text-background text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Keşfet</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>

                <div className="absolute inset-3 border border-background/25 rounded-md pointer-events-none" />
              </Link>
            ))}
          </div>
        )}

        <div className="mt-9 text-center">
          <Link href="/nesiller" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors">
            Tüm Nesilleri Keşfet
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
