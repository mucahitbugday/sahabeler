'use client';

import { useEffect, useState } from 'react';
import type { Sahabe } from '@/types';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { favoritesService } from '@/services/api';
import { 
  Calendar, 
  MapPin, 
  Crown, 
  Users, 
  Heart,
  BookmarkPlus,
  BookmarkCheck,
  Share2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface BiographySectionProps {
  sahabe: Sahabe;
}

export function BiographySection({ sahabe }: BiographySectionProps) {
  const { isAuthenticated } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [savedCount, setSavedCount] = useState(0);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  
  const biographyParagraphs = sahabe.biography.split('\n\n').filter(Boolean);
  const shortBiography = biographyParagraphs.slice(0, 2);
  const hasMoreContent = biographyParagraphs.length > 2;

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!isAuthenticated || !sahabe.id) {
        setIsFavorite(false);
        setSavedCount(0);
        return;
      }

      try {
        const data = await favoritesService.list();
        const favorites = data.favorites || [];
        setSavedCount(favorites.length);
        const exists = favorites.some((item) => String(item._id || item.id) === sahabe.id);
        setIsFavorite(exists);
      } catch {
        setSavedCount(0);
      }
    };

    fetchFavorites();
  }, [isAuthenticated, sahabe.id]);

  const handleFavoriteToggle = async () => {
    if (!isAuthenticated) {
      alert('Favorilere eklemek icin giris yapin');
      return;
    }

    if (!sahabe.id) return;

    try {
      setFavoriteLoading(true);
      if (isFavorite) {
        const data = await favoritesService.remove(sahabe.id);
        const favorites = data.favorites || [];
        setSavedCount(favorites.length);
        setIsFavorite(false);
      } else {
        const data = await favoritesService.add(sahabe.id);
        const favorites = data.favorites || [];
        setSavedCount(favorites.length);
        setIsFavorite(true);
      }
    } catch {
      alert('Kaydetme islemi basarisiz oldu');
    } finally {
      setFavoriteLoading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: sahabe.name,
        text: `${sahabe.name} - ${sahabe.title}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link panoya kopyalandi!');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header with Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            Biyografi
          </span>
          <h2 className="mt-3 text-3xl font-bold text-foreground">Hayati</h2>
        </div>
        
        <div className="flex flex-col items-start gap-2 sm:items-end">
          <span className="text-sm text-muted-foreground">Kaydedilenler: {savedCount}</span>
          <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleFavoriteToggle}
            disabled={favoriteLoading}
            className={`gap-2 ${isFavorite ? 'bg-primary/10 text-primary' : ''}`}
          >
            {isFavorite ? (
              <BookmarkCheck className="h-4 w-4" />
            ) : (
              <BookmarkPlus className="h-4 w-4" />
            )}
            {isFavorite ? 'Kaydedildi' : 'Kaydet'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="gap-2"
          >
            <Share2 className="h-4 w-4" />
            Paylas
          </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Biography */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-border/50 bg-gradient-to-br from-card to-secondary/20 p-6 shadow-lg">
            <div className="prose prose-lg max-w-none">
              {(isExpanded ? biographyParagraphs : shortBiography).map((paragraph, index) => (
                <p 
                  key={index} 
                  className="mb-4 leading-relaxed text-foreground/85 first-letter:float-left first-letter:mr-2 first-letter:text-4xl first-letter:font-bold first-letter:text-primary"
                >
                  {paragraph}
                </p>
              ))}
            </div>
            
            {hasMoreContent && (
              <Button
                variant="ghost"
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-4 w-full gap-2 text-primary hover:bg-primary/10"
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="h-4 w-4" />
                    Daha az goster
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4" />
                    Devamini oku
                  </>
                )}
              </Button>
            )}
          </div>
          
          {/* Life Timeline */}
          <div className="mt-8 rounded-xl border border-border/50 bg-card p-6 shadow-lg">
            <h3 className="mb-6 text-xl font-bold text-foreground">Hayat Cizgisi</h3>
            <div className="relative space-y-6 pl-8 before:absolute before:left-3 before:top-2 before:h-[calc(100%-16px)] before:w-0.5 before:bg-primary/30">
              <div className="relative">
                <div className="absolute -left-5 flex h-4 w-4 items-center justify-center rounded-full bg-primary">
                  <div className="h-2 w-2 rounded-full bg-primary-foreground" />
                </div>
                <div className="rounded-lg bg-secondary/50 p-4">
                  <span className="text-sm font-semibold text-primary">{sahabe.birthYear}</span>
                  <p className="mt-1 text-foreground">Dogum - {sahabe.birthPlace}</p>
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute -left-5 flex h-4 w-4 items-center justify-center rounded-full bg-accent">
                  <div className="h-2 w-2 rounded-full bg-accent-foreground" />
                </div>
                <div className="rounded-lg bg-secondary/50 p-4">
                  <span className="text-sm font-semibold text-accent">Islamiyet</span>
                  <p className="mt-1 text-foreground">Musluman oldu</p>
                </div>
              </div>
              
              {sahabe.events.slice(0, 2).map((event) => (
                <div key={event.id} className="relative">
                  <div className="absolute -left-5 flex h-4 w-4 items-center justify-center rounded-full bg-primary/60">
                    <div className="h-2 w-2 rounded-full bg-primary-foreground" />
                  </div>
                  <div className="rounded-lg bg-secondary/50 p-4">
                    <span className="text-sm font-semibold text-primary">{event.year}</span>
                    <p className="mt-1 text-foreground">{event.title}</p>
                  </div>
                </div>
              ))}
              
              <div className="relative">
                <div className="absolute -left-5 flex h-4 w-4 items-center justify-center rounded-full bg-muted-foreground">
                  <div className="h-2 w-2 rounded-full bg-background" />
                </div>
                <div className="rounded-lg bg-secondary/50 p-4">
                  <span className="text-sm font-semibold text-muted-foreground">{sahabe.deathYear}</span>
                  <p className="mt-1 text-foreground">Vefat - {sahabe.deathPlace}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Card Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            {/* Quick Info Card */}
            <div className="overflow-hidden rounded-xl border-2 border-primary/20 bg-gradient-to-b from-card to-secondary/30 shadow-lg">
              <div className="bg-primary/10 px-6 py-3">
                <h3 className="font-bold text-primary">Hizli Bilgiler</h3>
              </div>
              <div className="p-6">
                <dl className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Calendar className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <dt className="text-sm text-muted-foreground">Dogum</dt>
                      <dd className="font-semibold text-foreground">{sahabe.birthYear}, {sahabe.birthPlace}</dd>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Calendar className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <dt className="text-sm text-muted-foreground">Vefat</dt>
                      <dd className="font-semibold text-foreground">{sahabe.deathYear}, {sahabe.deathPlace}</dd>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <MapPin className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <dt className="text-sm text-muted-foreground">Kabir</dt>
                      <dd className="font-semibold text-foreground">{sahabe.burialPlace}</dd>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <dt className="text-sm text-muted-foreground">Nesil</dt>
                      <dd className="font-semibold text-foreground">{sahabe.generation}</dd>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/20">
                      <Crown className="h-4 w-4 text-accent" />
                    </div>
                    <div>
                      <dt className="text-sm text-muted-foreground">Lakap</dt>
                      <dd className="font-semibold text-foreground">{sahabe.title}</dd>
                    </div>
                  </div>
                </dl>
              </div>
            </div>

            {/* Stats Card */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-border/50 bg-card p-4 text-center shadow-sm">
                <div className="text-2xl font-bold text-primary">{sahabe.events.length}</div>
                <div className="text-sm text-muted-foreground">Olay</div>
              </div>
              <div className="rounded-xl border border-border/50 bg-card p-4 text-center shadow-sm">
                <div className="text-2xl font-bold text-primary">{sahabe.hadiths.length}</div>
                <div className="text-sm text-muted-foreground">Hadis</div>
              </div>
              <div className="rounded-xl border border-border/50 bg-card p-4 text-center shadow-sm">
                <div className="text-2xl font-bold text-primary">{sahabe.relations.length}</div>
                <div className="text-sm text-muted-foreground">Iliski</div>
              </div>
              <div className="rounded-xl border border-border/50 bg-card p-4 text-center shadow-sm">
                <div className="flex items-center justify-center gap-1 text-2xl font-bold text-red-500">
                  <Heart className="h-5 w-5 fill-current" />
                  <span>{savedCount}</span>
                </div>
                <div className="text-sm text-muted-foreground">Kaydedilenler</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
