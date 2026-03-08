'use client';

import Link from 'next/link';
import { SearchInput } from '@/components/search/search-input';

const popularSearches = [
  { name: 'Hz. Ebubekir', slug: 'hz-ebubekir' },
  { name: 'Hz. Ömer', slug: 'hz-omer' },
  { name: 'Hz. Osman', slug: 'hz-osman' },
  { name: 'Hz. Ali', slug: 'hz-ali' },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("/hero.png")',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b_xxxxxx from-background/60 via-background/40 to-background" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-2xl mx-auto text-center">
          {/* Headline */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-4 text-balance">
            Sahabelerin hayatını ve{' '}
            <span className="text-primary">İslam tarihini</span> keşfedin
          </h1>
          
          <p className="text-lg text-muted-foreground mb-8 text-pretty">
            Peygamber Efendimizin kutlu ashabını tanıyın, onların hayatlarından ibretler alın.
          </p>

          {/* Search */}
          <div className="mb-6">
            <SearchInput variant="hero" placeholder="Sahabe veya olay ara..." />
          </div>

          {/* Popular Searches */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {popularSearches.map((item, index) => (
              <span key={item.slug} className="flex items-center">
                <Link
                  href={`/sahabe/${item.slug}`}
                  className="text-sm text-primary hover:text-primary/80 transition-colors hover:underline"
                >
                  {item.name}
                </Link>
                {index < popularSearches.length - 1 && (
                  <span className="mx-1 text-muted-foreground/50">•</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Decorative Border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </section>
  );
}
