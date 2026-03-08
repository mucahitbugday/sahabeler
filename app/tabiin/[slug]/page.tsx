'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { SahabeHero } from '@/components/sahabe/sahabe-hero';
import { SahabeContent } from '@/components/sahabe/sahabe-content';
import type { Sahabe as UISahabe } from '@/types';
import { sahabeService } from '@/services/api';
import { Loader2 } from 'lucide-react';

function normalizeGeneration(value?: string) {
  return (value || '')
    .toLowerCase()
    .replace(/â/g, 'a')
    .replace(/î/g, 'i')
    .replace(/ı/g, 'i')
    .replace(/-/g, ' ')
    .trim();
}

function isTabiin(value?: string) {
  const normalized = normalizeGeneration(value).replace(/\s+/g, '');
  return normalized.includes('tabiin') && !normalized.includes('tebe');
}

function toUISahabe(input: Record<string, unknown>): UISahabe {
  return {
    id: String(input._id || input.id || ''),
    slug: String(input.slug || ''),
    name: String(input.name || ''),
    arabicName: String(input.arabicName || ''),
    title: String(input.title || ''),
    description: String(input.shortBio || input.biography || ''),
    imageUrl: String(input.image || ''),
    birthYear: Number(input.birthYear || 0),
    birthPlace: String(input.birthPlace || ''),
    deathYear: Number(input.deathYear || 0),
    deathPlace: String(input.deathPlace || ''),
    burialPlace: String(input.grave || ''),
    generation: String(input.generation || ''),
    nickname: String(input.nickname || ''),
    biography: String(input.biography || ''),
    fullBiography: [],
    events: Array.isArray(input.events)
      ? (input.events as Array<Record<string, unknown>>).map((event, index) => ({
        id: String(event.id || index),
        slug: String(event.id || ''),
        title: String(event.name || ''),
        year: Number(event.year || 0),
        description: String(event.description || ''),
        imageUrl: String(event.image || ''),
      }))
      : [],
    relations: Array.isArray(input.relations)
      ? (input.relations as Array<Record<string, unknown>>).map((relation, index) => ({
        id: String(relation.sahabeId || index),
        name: String(relation.name || ''),
        relationship: String(relation.relationType || ''),
        imageUrl: String(relation.image || ''),
      }))
      : [],
    hadiths: Array.isArray(input.hadiths)
      ? (input.hadiths as Array<Record<string, unknown>>).map((hadith, index) => ({
        id: String(hadith.id || index),
        text: String(hadith.text || ''),
        source: String(hadith.source || ''),
        narrator: String(hadith.narrator || ''),
      }))
      : [],
  };
}

export default function TabiinDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [item, setItem] = useState<UISahabe | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFoundError, setNotFoundError] = useState(false);

  useEffect(() => {
    if (!slug) return;

    async function loadItem() {
      try {
        setLoading(true);
        const data = await sahabeService.getBySlug(slug);
        if (data.sahabe && isTabiin(String(data.sahabe.generation || ''))) {
          setItem(toUISahabe(data.sahabe));
        } else {
          setNotFoundError(true);
        }
      } catch {
        setNotFoundError(true);
      } finally {
        setLoading(false);
      }
    }

    loadItem();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (notFoundError || !item) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground mb-4">Tabiin Bulunamadı</h1>
            <p className="text-muted-foreground">Aradığınız kayıt bulunamadı.</p>
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
        <SahabeHero sahabe={item} />
        <SahabeContent sahabe={item} />
      </main>
      <Footer />
    </div>
  );
}
