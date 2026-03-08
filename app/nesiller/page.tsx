'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, ArrowRight, ChevronRight } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { generationService } from '@/services/api';

interface Generation {
  _id: string;
  slug: string;
  title: string;
  subtitle: string;
  description?: string;
  image?: string;
  order: number;
  sahabelerCount?: number;
}

function toGeneration(item: Record<string, unknown>): Generation {
  return {
    _id: String(item._id || ''),
    slug: String(item.slug || ''),
    title: String(item.title || ''),
    subtitle: String(item.subtitle || ''),
    description: item.description ? String(item.description) : undefined,
    image: item.image ? String(item.image) : undefined,
    order: Number(item.order || 0),
    sahabelerCount: item.sahabelerCount ? Number(item.sahabelerCount) : undefined,
  };
}

function getGenerationPath(slug: string) {
  if (slug === 'tabiin') return '/tabiin';
  if (slug === 'tebe-i-tabiin' || slug === 'tebei-tabiin') return '/tebei-tabiin';
  if (slug === 'sahabeler' || slug === 'sahabe') return '/sahabeler';
  return `/nesiller/${slug}`;
}

export default function NesillerPage() {
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGenerations() {
      try {
        const data = await generationService.list();
        const mapped = data.generations.map(toGeneration);
        setGenerations(mapped);
      } catch (error) {
        console.error('Nesiller yüklenemedi:', error);
      } finally {
        setLoading(false);
      }
    }
    loadGenerations();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Yükleniyor...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-b from-primary/10 to-background py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">İslam&apos;ın Nesilleri</h1>
              <p className="text-muted-foreground text-lg">
                Peygamber Efendimizden başlayarak günümüze kadar uzanan kutlu silsile.
                Her nesil, İslam&apos;ın nurunu bir sonrakine aktarmıştır.
              </p>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="relative">
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-primary/20 hidden md:block" />

              <div className="space-y-8 md:space-y-0">
                {generations.map((generation, index) => (
                  <div key={generation._id.toString()} className="relative">
                    <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                      <div className="h-6 w-6 rounded-full bg-primary ring-4 ring-background flex items-center justify-center text-primary-foreground font-bold text-xs">
                        {index + 1}
                      </div>
                    </div>

                    <div className={`md:flex items-center gap-8 ${index % 2 === 0 ? '' : 'md:flex-row-reverse'}`}>
                      <Link
                        href={getGenerationPath(generation.slug)}
                        className={`group flex-1 block ${index % 2 === 0 ? 'md:pr-16' : 'md:pl-16'}`}
                      >
                        <div className="bg-card rounded-2xl border border-border hover:border-primary/30 transition-all hover:shadow-xl overflow-hidden">
                          <div className="md:flex">
                            <div className="md:w-2/5 aspect-video md:aspect-auto relative overflow-hidden">
                              <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                style={{ backgroundImage: `url(${generation.image || ''})` }}
                              />
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card/50 hidden md:block" />
                              <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent md:hidden" />

                              <div className="absolute top-4 left-4 md:hidden">
                                <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                                  {index + 1}
                                </div>
                              </div>
                            </div>

                            <div className="md:w-3/5 p-6 md:p-8">
                              <div className="flex items-center gap-2 text-primary mb-2">
                                <span className="text-sm font-medium uppercase tracking-wider">
                                  {index + 1}. Nesil
                                </span>
                              </div>
                              <h2 className="text-2xl md:text-3xl font-bold text-foreground group-hover:text-primary transition-colors mb-3">
                                {generation.title}
                              </h2>
                              <p className="text-lg text-accent-foreground mb-2">{generation.subtitle}</p>
                              {generation.description && (
                                <p className="text-muted-foreground mb-4">{generation.description}</p>
                              )}
                              {generation.sahabelerCount ? (
                                <p className="text-sm text-muted-foreground mb-4">
                                  <span className="font-semibold text-foreground">
                                    {generation.sahabelerCount.toLocaleString('tr-TR')}+
                                  </span>{' '}
                                  kayıtlı sahabe
                                </p>
                              ) : null}
                              <div className="flex items-center gap-2 text-primary font-medium group-hover:gap-3 transition-all">
                                <span>Detayları Keşfet</span>
                                <ArrowRight className="h-5 w-5" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>

                      <div className="hidden md:block flex-1" />
                    </div>

                    {index < generations.length - 1 && (
                      <div className="flex justify-center py-4 md:py-8">
                        <ChevronRight className="h-6 w-6 text-primary/50 rotate-90" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl font-bold text-foreground mb-4">Nesiller Hakkında</h2>
              <p className="text-muted-foreground leading-relaxed">
                İslam tarihinde nesiller, ilmin ve hikmetin aktarımında kritik bir rol oynamıştır.
                Sahabeler, Peygamber Efendimizden doğrudan öğrendiklerini Tabiine aktarmış;
                Tabiin de bu mirası Tebe-i Tabiine emanet etmiştir. Bu kutlu silsile,
                günümüze kadar kesintisiz bir şekilde devam etmektedir.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
