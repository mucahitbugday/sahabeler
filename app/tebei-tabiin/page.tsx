'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, ArrowRight, Users, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { sahabeService } from '@/services/api';

interface PersonCard {
  id: string;
  slug: string;
  name: string;
  arabicName?: string;
  title?: string;
  shortBio?: string;
  image?: string;
  generation?: string;
}

function normalizeGeneration(value?: string) {
  return (value || '')
    .toLowerCase()
    .replace(/â/g, 'a')
    .replace(/î/g, 'i')
    .replace(/ı/g, 'i')
    .replace(/-/g, ' ')
    .trim();
}

function isTebeiTabiin(value?: string) {
  const normalized = normalizeGeneration(value).replace(/\s+/g, '');
  return normalized.includes('tebe') || normalized.includes('tebei') || normalized.includes('tebeitabiin');
}

export default function TebeiTabiinPage() {
  const [query, setQuery] = useState('');
  const [items, setItems] = useState<PersonCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await sahabeService.list({ limit: 500 });
        const all = (data.sahabeler as unknown as PersonCard[]) || [];
        setItems(all.filter((item) => isTebeiTabiin(item.generation)));
      } catch (error) {
        console.error('Tebei tabiin listesi yüklenemedi:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => item.name.toLowerCase().includes(q) || (item.arabicName || '').toLowerCase().includes(q));
  }, [items, query]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">Tebei Tabiin</h1>
              </div>
              <p className="text-muted-foreground text-lg mb-6">Tabiini gören ve onlardan ilim alan kutlu nesil.</p>
              <div className="relative max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Tebei tabiin ara..."
                  className="pl-12 h-12 rounded-full border-border"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Tüm Tebei Tabiin</h2>
              <span className="text-sm text-muted-foreground">{filtered.length} sonuç</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((item) => (
                <Link
                  key={item.id}
                  href={`/tebei-tabiin/${item.slug}`}
                  className="group bg-card rounded-xl border border-border hover:border-primary/30 transition-all hover:shadow-md overflow-hidden"
                >
                  <div className="aspect-video relative overflow-hidden bg-muted">
                    {item.image ? (
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                        style={{ backgroundImage: `url(${item.image})` }}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-primary/5">
                        <Users className="h-12 w-12 text-primary/30" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2 rounded-md bg-background/80 px-2 py-1 text-[11px] text-muted-foreground">
                      {item.slug}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-1">{item.name}</h3>
                    {item.arabicName && <p className="text-xs text-muted-foreground mb-1">{item.arabicName}</p>}
                    <p className="text-sm text-muted-foreground line-clamp-2">{item.shortBio}</p>
                    <div className="flex items-center gap-1 text-primary text-sm font-medium mt-3 group-hover:gap-2 transition-all">
                      <span>Detaylar</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
