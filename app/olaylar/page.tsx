'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Calendar, ArrowRight, Filter, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { eventService } from '@/services/api';

const categories = [
  { id: 'all', label: 'Tümü' },
  { id: 'vahiy', label: 'Vahiy' },
  { id: 'savas', label: 'Savaşlar' },
  { id: 'antlasma', label: 'Antlaşmalar' },
  { id: 'fetih', label: 'Fetihler' },
  { id: 'genel', label: 'Genel' },
];

interface EventItem {
  id: string;
  slug: string;
  title: string;
  year: number;
  description: string;
  imageUrl?: string;
  category?: string;
}

export default function OlaylarPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'timeline' | 'grid'>('timeline');
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const data = await eventService.list({ limit: 200 });
        const mapped = (data.events || []).map((event) => ({
          id: String(event.id || ''),
          slug: String(event.slug || ''),
          title: String(event.title || event.name || ''),
          year: Number(event.year || 0),
          description: String(event.description || ''),
          imageUrl: event.imageUrl ? String(event.imageUrl) : undefined,
          category: event.category ? String(event.category) : undefined,
        }));
        setEvents(mapped);
      } catch (error) {
        console.error('Olaylar yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    const base = [...events].sort((a, b) => a.year - b.year);
    if (activeCategory === 'all') return base;
    return base.filter((item) => item.category === activeCategory);
  }, [events, activeCategory]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-b from-accent/10 to-background py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-accent-foreground" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">Tarihi Olaylar</h1>
              </div>
              <p className="text-muted-foreground text-lg">İslam tarihinin önemli olaylarını kronolojik sırayla keşfedin.</p>
            </div>
          </div>
        </section>

        <section className="py-6 border-b border-border">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
                <Filter className="h-5 w-5 text-muted-foreground shrink-0" />
                {categories.map((cat) => (
                  <Button
                    key={cat.id}
                    variant={activeCategory === cat.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveCategory(cat.id)}
                    className="shrink-0 rounded-full"
                  >
                    {cat.label}
                  </Button>
                ))}
              </div>
              <div className="hidden md:flex items-center gap-2">
                <Button variant={viewMode === 'timeline' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('timeline')}>
                  Zaman Çizelgesi
                </Button>
                <Button variant={viewMode === 'grid' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('grid')}>
                  Grid
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : viewMode === 'timeline' ? (
              <div className="relative">
                <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-border md:-translate-x-px" />
                <div className="space-y-12">
                  {filteredEvents.map((event, index) => (
                    <div
                      key={event.id}
                      className={`relative flex items-start gap-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                    >
                      <div className="absolute left-8 md:left-1/2 -translate-x-1/2 z-10">
                        <div className="h-4 w-4 rounded-full bg-primary ring-4 ring-background" />
                      </div>

                      <div className="md:hidden ml-16 mb-2">
                        <span className="inline-block px-3 py-1 bg-primary text-primary-foreground text-sm font-bold rounded-full">
                          {event.year}
                        </span>
                      </div>

                      <div className={`flex-1 ml-16 md:ml-0 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                        <Link
                          href={`/olaylar/${event.slug}`}
                          className="group block bg-card rounded-xl border border-border hover:border-primary/30 transition-all hover:shadow-lg overflow-hidden"
                        >
                          <div className="aspect-video relative overflow-hidden">
                            <div
                              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                              style={{ backgroundImage: `url(${event.imageUrl || ''})` }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                            <div className="hidden md:block absolute top-4 right-4">
                              <span className="px-4 py-2 bg-primary text-primary-foreground font-bold rounded-lg text-lg">
                                {event.year}
                              </span>
                            </div>
                          </div>
                          <div className="p-5">
                            <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors mb-2">{event.title}</h3>
                            <p className="text-muted-foreground mb-4">{event.description}</p>
                            <div className="flex items-center gap-2 text-primary text-sm font-medium group-hover:gap-3 transition-all">
                              <span>Devamını Oku</span>
                              <ArrowRight className="h-4 w-4" />
                            </div>
                          </div>
                        </Link>
                      </div>

                      <div className="hidden md:block flex-1" />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event) => (
                  <Link
                    key={event.id}
                    href={`/olaylar/${event.slug}`}
                    className="group bg-card rounded-xl border border-border hover:border-primary/30 transition-all hover:shadow-lg overflow-hidden"
                  >
                    <div className="aspect-video relative overflow-hidden">
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                        style={{ backgroundImage: `url(${event.imageUrl || ''})` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 bg-primary text-primary-foreground font-bold rounded-lg">{event.year}</span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-foreground group-hover:text-primary transition-colors mb-1">{event.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
