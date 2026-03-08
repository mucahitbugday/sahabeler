import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import type { Event } from '@/types';

interface EventsSectionProps {
  events: Event[];
}

export function EventsSection({ events }: EventsSectionProps) {
  return (
    <div>
      <div className="mb-6">
        <span className="text-xs font-medium uppercase tracking-wider text-primary/60">
          KATILDIGI OLAYLAR
        </span>
      </div>
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <div 
            key={event.id}
            className="group overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-all hover:shadow-md"
          >
            {/* Image */}
            <div className="relative aspect-[4/3] overflow-hidden bg-muted">
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                style={{
                  backgroundImage: `url(${event.imageUrl || '/placeholder.svg'})`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card/90 to-transparent" />
              
              {/* Title Overlay */}
              <div className="absolute inset-x-0 bottom-0 p-4">
                <h3 className="text-lg font-bold text-foreground">{event.title}</h3>
              </div>
            </div>
            
            {/* Link */}
            <div className="p-4">
              <Link
                href={`/olaylar/${event.slug}`}
                className="inline-flex items-center text-sm font-medium text-primary transition-colors hover:text-primary/80"
              >
                Detayları Oku
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
