import Link from 'next/link';
import { ChevronRight, Users } from 'lucide-react';

interface SahabeCardProps {
  sahabe: {
    id: string;
    name: string;
    arabicName?: string;
    slug: string;
    title?: string;
    shortBio?: string;
    image?: string;
  };
}

export function SahabeCard({ sahabe }: SahabeCardProps) {
  return (
    <div className="group overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-all hover:shadow-md">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {sahabe.image ? (
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
            style={{ backgroundImage: `url(${sahabe.image})` }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-primary/5">
            <Users className="h-12 w-12 text-primary/30" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="mb-1 text-lg font-semibold text-foreground">{sahabe.name}</h3>
        {sahabe.arabicName && (
          <p className="text-xs text-muted-foreground font-arabic mb-2">{sahabe.arabicName}</p>
        )}
        <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">{sahabe.shortBio}</p>
        
        <Link
          href={`/sahabe/${sahabe.slug}`}
          className="inline-flex items-center text-sm font-medium text-primary transition-colors hover:text-primary/80"
        >
          Detayları Gor
          <ChevronRight className="ml-1 h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
