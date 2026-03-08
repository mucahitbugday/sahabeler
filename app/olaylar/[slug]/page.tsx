'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Calendar, ArrowLeft, Loader2, Tag } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { eventService } from '@/services/api';

interface EventDetail {
  id: string;
  slug: string;
  title: string;
  year: number;
  description: string;
  fullDescription?: string;
  imageUrl?: string;
  category?: string;
  importance?: 'low' | 'medium' | 'high';
}

function toEventDetail(input: Record<string, unknown>): EventDetail {
  return {
    id: String(input.id || ''),
    slug: String(input.slug || ''),
    title: String(input.title || input.name || ''),
    year: Number(input.year || 0),
    description: String(input.description || ''),
    fullDescription: input.fullDescription ? String(input.fullDescription) : undefined,
    imageUrl: input.imageUrl ? String(input.imageUrl) : input.image ? String(input.image) : undefined,
    category: input.category ? String(input.category) : undefined,
    importance: input.importance as 'low' | 'medium' | 'high' | undefined,
  };
}

function getImportanceLabel(importance?: 'low' | 'medium' | 'high') {
  if (importance === 'high') return 'Yüksek Önem';
  if (importance === 'medium') return 'Orta Önem';
  if (importance === 'low') return 'Düşük Önem';
  return null;
}

export default function OlayDetayPage() {
  const params = useParams();
  const slug = String(params?.slug || '');

  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setError('Geçersiz olay adresi.');
      setLoading(false);
      return;
    }

    const fetchEvent = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await eventService.getBySlug(slug);
        if (!data.event) {
          setError('Olay bulunamadı.');
          return;
        }
        setEvent(toEventDetail(data.event));
      } catch {
        setError('Olay yüklenemedi.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [slug]);

  const importanceLabel = useMemo(() => getImportanceLabel(event?.importance), [event?.importance]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {loading ? (
          <section className="py-20">
            <div className="container mx-auto px-4 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          </section>
        ) : error || !event ? (
          <section className="py-20">
            <div className="container mx-auto px-4 max-w-2xl text-center">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3">Olay Bulunamadı</h1>
              <p className="text-muted-foreground mb-6">{error || 'Aradığınız olay mevcut değil.'}</p>
              <Link href="/olaylar" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium">
                <ArrowLeft className="h-4 w-4" />
                Olaylara Geri Dön
              </Link>
            </div>
          </section>
        ) : (
          <>
            <section className="bg-gradient-to-b from-accent/10 to-background py-10 md:py-14 border-b border-border">
              <div className="container mx-auto px-4 max-w-5xl">
                <Link href="/olaylar" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-5">
                  <ArrowLeft className="h-4 w-4" />
                  Olaylara Dön
                </Link>
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                    <Calendar className="h-4 w-4" />
                    {event.year}
                  </span>
                  {event.category ? (
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm">
                      <Tag className="h-4 w-4" />
                      {event.category}
                    </span>
                  ) : null}
                  {importanceLabel ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-accent/20 text-accent-foreground text-sm">
                      {importanceLabel}
                    </span>
                  ) : null}
                </div>
                <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">{event.title}</h1>
                <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">{event.description}</p>
              </div>
            </section>

            {event.imageUrl ? (
              <section className="py-8">
                <div className="container mx-auto px-4 max-w-5xl">
                  <div className="rounded-2xl overflow-hidden border border-border bg-card">
                    <div className="aspect-[16/8] bg-cover bg-center" style={{ backgroundImage: `url(${event.imageUrl})` }} />
                  </div>
                </div>
              </section>
            ) : null}

            <section className="py-10 md:py-14">
              <div className="container mx-auto px-4 max-w-3xl">
                <article className="prose prose-neutral max-w-none dark:prose-invert">
                  <p className="text-foreground leading-8 whitespace-pre-wrap">
                    {event.fullDescription || event.description}
                  </p>
                </article>
              </div>
            </section>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
