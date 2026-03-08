'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { eventService } from '@/services/api';

interface EventItem {
  id: string;
  slug: string;
  title: string;
  year: number;
  description: string;
  imageUrl?: string;
}

export function TimelineEvents() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await eventService.list({ limit: 12 });
        const mapped = (data.events || []).map((event) => ({
          id: String(event.id || ''),
          slug: String(event.slug || ''),
          title: String(event.title || event.name || ''),
          year: Number(event.year || 0),
          description: String(event.description || ''),
          imageUrl: event.imageUrl ? String(event.imageUrl) : undefined,
        }));
        setEvents(mapped);
      } catch (error) {
        console.error('Timeline events yüklenemedi:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const sortedEvents = useMemo(() => [...events].sort((a, b) => a.year - b.year), [events]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="py-14 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex-1">
            <div className="mb-2 h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />
            <h2 className="font-serif text-3xl font-bold text-foreground">Tarihi Olaylar</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => scroll('left')} className="hidden md:flex h-10 w-10 rounded-full border-border">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => scroll('right')} className="hidden md:flex h-10 w-10 rounded-full border-border">
              <ChevronRight className="h-5 w-5" />
            </Button>
            <Link href="/olaylar" className="hidden lg:flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium ml-2">
              Tümünü Gör
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="relative">
            <div className="absolute top-[60px] left-0 right-0 h-0.5 bg-border hidden md:block" />

            <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {sortedEvents.map((event, index) => (
                <Link key={event.id} href={`/olaylar/${event.slug}`} className="group snap-start shrink-0 w-[280px] md:w-[300px]">
                  <div className="flex flex-col items-center mb-4">
                    <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{event.year}</div>
                    <div className="hidden md:block h-4 w-0.5 bg-primary" />
                    <div className="hidden md:block h-3 w-3 rounded-full bg-primary ring-4 ring-background" />
                  </div>

                  <div className="relative overflow-hidden rounded-lg border border-border bg-card hover:border-primary/30 transition-all hover:shadow-lg">
                    <div className="aspect-video relative overflow-hidden">
                      <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: `url(${event.imageUrl || '/placeholder.svg'})`, filter: 'sepia(0.24) saturate(0.9)' }} />
                      <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />

                      <div className="absolute top-3 right-3 h-8 w-8 rounded-full bg-background/80 backdrop-blur flex items-center justify-center text-sm font-bold text-foreground">
                        {index + 1}
                      </div>

                      <div className="absolute left-4 top-4 text-4xl font-serif font-bold text-primary-foreground drop-shadow-sm">
                        {event.year}
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="font-serif text-2xl font-bold text-foreground group-hover:text-primary transition-colors mb-1">{event.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
                      <div className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-primary text-sm font-medium mt-3 group-hover:gap-3 transition-all">
                        <span>Devamını Oku</span>
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 text-center lg:hidden">
          <Link href="/olaylar" className="inline-flex items-center gap-2 text-primary font-medium">
            Tüm Olayları Gör
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
