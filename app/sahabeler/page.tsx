'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Filter, ArrowRight, Users, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { sahabeService } from '@/services/api';

const filters = [
  { id: 'all', label: 'Tümü' },
  { id: 'dort-halife', label: 'Dört Halife' },
];

interface Sahabe {
  id: string;
  name: string;
  arabicName?: string;
  slug: string;
  title?: string;
  shortBio?: string;
  image?: string;
  isFourCaliph?: boolean;
  caliphOrder?: number;
}

export default function SahabelerPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [sahabeler, setSahabeler] = useState<Sahabe[]>([]);
  const [fourCaliphs, setFourCaliphs] = useState<Sahabe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSahabeler();
    fetchFourCaliphs();
  }, []);

  const fetchSahabeler = async () => {
    try {
      setLoading(true);
      const data = await sahabeService.list({ limit: 100 });
      setSahabeler((data.sahabeler as unknown as Sahabe[]) || []);
    } catch (error) {
      console.error('Sahabe yükleme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFourCaliphs = async () => {
    try {
      const data = await sahabeService.list({ fourCaliphs: true, limit: 4 });
      setFourCaliphs((data.sahabeler as unknown as Sahabe[]) || []);
    } catch (error) {
      console.error('Halife yükleme hatası:', error);
    }
  };

  const filteredSahabeler = sahabeler.filter((sahabe) => {
    const matchesSearch = sahabe.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = 
      activeFilter === 'all' ? true :
      activeFilter === 'dort-halife' ? sahabe.isFourCaliph :
      true;
    
    return matchesSearch && matchesFilter;
  });

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
        {/* Hero */}
        <section className="bg-gradient-to-b from-primary/10 to-background py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">Sahabeler</h1>
              </div>
              <p className="text-muted-foreground text-lg mb-6">
                Peygamber Efendimizi gören, O&apos;na iman eden ve İslam üzere vefat eden mübarek şahsiyetler.
              </p>
              
              {/* Search */}
              <div className="relative max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Sahabe ara..."
                  className="pl-12 h-12 rounded-full border-border"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Filters & Content */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            {/* Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
              <Filter className="h-5 w-5 text-muted-foreground shrink-0" />
              {filters.map((filter) => (
                <Button
                  key={filter.id}
                  variant={activeFilter === filter.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveFilter(filter.id)}
                  className="shrink-0 rounded-full"
                >
                  {filter.label}
                </Button>
              ))}
            </div>

            {/* Dört Halife Section */}
            {(activeFilter === 'all' || activeFilter === 'dort-halife') && (
              <div className="mb-12">
                <h2 className="text-xl font-bold text-foreground mb-6">Dört Halife (Hulefa-i Raşidin)</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {fourCaliphs.map((caliph, index) => (
                    <Link
                      key={caliph.id}
                      href={`/sahabe/${caliph.slug}`}
                      className="group relative bg-card rounded-xl overflow-hidden border border-border hover:border-primary/30 transition-all hover:shadow-lg"
                    >
                      <div className="absolute top-3 left-3 z-10 h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                        {caliph.caliphOrder || index + 1}
                      </div>
                      <div className="aspect-[4/3] relative overflow-hidden bg-muted">
                        {caliph.image ? (
                          <div 
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                            style={{ backgroundImage: `url(${caliph.image})` }}
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-primary/5">
                            <Users className="h-16 w-16 text-primary/30" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                      </div>
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">
                            {caliph.name}
                          </h3>
                          {caliph.title && (
                            <span className="text-xs font-medium text-accent">{caliph.title}</span>
                          )}
                        </div>
                        {caliph.arabicName && (
                          <p className="text-sm text-muted-foreground font-arabic mb-1">{caliph.arabicName}</p>
                        )}
                        <p className="text-sm text-muted-foreground line-clamp-2">{caliph.shortBio}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* All Sahabeler Grid */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground">
                  {activeFilter === 'all' ? 'Tüm Sahabeler' : filters.find(f => f.id === activeFilter)?.label}
                </h2>
                <span className="text-sm text-muted-foreground">{filteredSahabeler.length} sonuç</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredSahabeler.map((sahabe) => (
                  <Link
                    key={sahabe.id}
                    href={`/sahabe/${sahabe.slug}`}
                    className="group bg-card rounded-xl border border-border hover:border-primary/30 transition-all hover:shadow-md overflow-hidden"
                  >
                    <div className="aspect-video relative overflow-hidden bg-muted">
                      {sahabe.image ? (
                        <div 
                          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                          style={{ backgroundImage: `url(${sahabe.image})` }}
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-primary/5">
                          <Users className="h-12 w-12 text-primary/30" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
                        {sahabe.name}
                      </h3>
                      {sahabe.arabicName && (
                        <p className="text-xs text-muted-foreground font-arabic mb-1">{sahabe.arabicName}</p>
                      )}
                      <p className="text-sm text-muted-foreground line-clamp-2">{sahabe.shortBio}</p>
                      <div className="flex items-center gap-1 text-primary text-sm font-medium mt-3 group-hover:gap-2 transition-all">
                        <span>Detaylar</span>
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
