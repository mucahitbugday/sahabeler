'use client';

import { useEffect, useState } from 'react';
import { SahabeCard } from './sahabe-card';
import { Loader2 } from 'lucide-react';
import { sahabeService } from '@/services/api';

interface Sahabe {
  id: string;
  name: string;
  arabicName?: string;
  slug: string;
  title?: string;
  shortBio?: string;
  image?: string;
}

export function PopularSahabeler() {
  const [sahabeler, setSahabeler] = useState<Sahabe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPopularSahabeler();
  }, []);

  const fetchPopularSahabeler = async () => {
    try {
      const data = await sahabeService.list({ limit: 8 });
      setSahabeler(data.sahabeler || []);
    } catch (error) {
      console.error('Popüler sahabeler yükleme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }
  
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <h2 className="mb-8 text-2xl font-bold text-foreground md:text-3xl">
          Populer Sahabeler
        </h2>
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {sahabeler.map((sahabe) => (
            <SahabeCard key={sahabe.id} sahabe={sahabe} />
          ))}
        </div>
      </div>
    </section>
  );
}
