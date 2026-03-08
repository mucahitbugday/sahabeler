'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Loader2 } from 'lucide-react';
import { eventService } from '@/services/api';

interface EventItem {
  id: string;
  slug: string;
  title: string;
  year: number;
  description: string;
  imageUrl?: string;
}

export function EventsSection() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await eventService.list({ limit: 3 });
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
        console.error('Events section yüklenemedi:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <section className="bg-secondary/30 py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center gap-4">
          <h2 className="text-2xl font-bold text-foreground md:text-3xl">Tarihi Olaylar</h2>
          <div className="h-px flex-1 bg-border" />
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <div key={event.id} className="group relative overflow-hidden rounded-lg shadow-md">
                <div
                  className="aspect-[16/9] bg-cover bg-center"
                  style={{ backgroundImage: `url(${event.imageUrl || ''})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 to-foreground/40" />
                </div>

                <div className="absolute inset-0 flex flex-col justify-center p-6">
                  <span className="mb-1 text-4xl font-bold text-accent">{event.year}</span>
                  <h3 className="mb-2 text-xl font-bold uppercase tracking-wide text-card">{event.title}</h3>
                  <p className="mb-4 text-sm text-card/80">{event.description}</p>

                  <Link
                    href={`/olaylar/${event.slug}`}
                    className="inline-flex w-fit items-center rounded-md border border-card/50 bg-card/10 px-4 py-2 text-sm font-medium text-card backdrop-blur-sm transition-colors hover:bg-card/20"
                  >
                    Devamini Oku
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
