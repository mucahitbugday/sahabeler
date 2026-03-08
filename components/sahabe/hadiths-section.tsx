'use client';

import { useState, useMemo } from 'react';
import type { Hadith } from '@/types';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Quote, BookOpen, Search } from 'lucide-react';

interface HadithsSectionProps {
  hadiths: Hadith[];
  itemsPerPage?: number;
  showSearch?: boolean;
  compact?: boolean;
}

export function HadithsSection({ 
  hadiths, 
  itemsPerPage = 10, 
  showSearch = false,
  compact = false 
}: HadithsSectionProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredHadiths = useMemo(() => {
    if (!searchQuery.trim()) return hadiths;
    const query = searchQuery.toLowerCase();
    return hadiths.filter(
      hadith => 
        hadith.text.toLowerCase().includes(query) ||
        hadith.source.toLowerCase().includes(query)
    );
  }, [hadiths, searchQuery]);

  const totalPages = Math.ceil(filteredHadiths.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentHadiths = filteredHadiths.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  if (compact) {
    return (
      <div className="rounded-xl border-2 border-primary/20 bg-gradient-to-b from-card to-secondary/30 p-6 shadow-lg">
        <div className="mb-4 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-bold text-foreground">Rivayet Ettigi Hadisler</h3>
        </div>
        
        <div className="space-y-4">
          {hadiths.slice(0, 3).map((hadith) => (
            <blockquote 
              key={hadith.id}
              className="relative rounded-lg bg-background/60 p-4 shadow-sm"
            >
              <Quote className="absolute -top-2 left-2 h-6 w-6 text-primary/20" />
              <p className="mb-2 pl-4 text-sm leading-relaxed text-foreground/80 italic line-clamp-3">
                {hadith.text}
              </p>
              <footer className="pl-4 text-xs text-primary">
                <cite className="not-italic font-medium">- {hadith.source}</cite>
              </footer>
            </blockquote>
          ))}
        </div>
        
        {hadiths.length > 3 && (
          <p className="mt-4 text-center text-sm text-muted-foreground">
            ve {hadiths.length - 3} hadis daha...
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-xl border-2 border-primary/20 bg-gradient-to-b from-card to-secondary/30 p-6 shadow-lg">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">Rivayet Ettigi Hadisler</h3>
            <p className="text-sm text-muted-foreground">
              Toplam {filteredHadiths.length} hadis
              {searchQuery && ` (${hadiths.length} icinden)`}
            </p>
          </div>
        </div>
        
        {showSearch && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Hadis ara..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-lg border border-border bg-background py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 sm:w-64"
            />
          </div>
        )}
      </div>
      
      <div className="space-y-6">
        {currentHadiths.map((hadith, index) => (
          <blockquote 
            key={hadith.id}
            className="group relative rounded-xl border border-border/50 bg-background/80 p-6 shadow-sm transition-all hover:border-primary/30 hover:shadow-md"
          >
            <div className="absolute -left-3 top-6 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              {startIndex + index + 1}
            </div>
            <Quote className="absolute right-4 top-4 h-8 w-8 text-primary/10 transition-colors group-hover:text-primary/20" />
            
            <p className="mb-4 pr-8 text-base leading-relaxed text-foreground/90 italic">
              &ldquo;{hadith.text}&rdquo;
            </p>
            
            <footer className="flex items-center gap-2 border-t border-border/50 pt-3">
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              <cite className="text-sm font-semibold not-italic text-primary">
                {hadith.source}
              </cite>
            </footer>
          </blockquote>
        ))}
      </div>
      
      {totalPages > 1 && (
        <div className="mt-8 flex flex-col items-center gap-4 border-t border-border/50 pt-6">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="h-9 w-9 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center gap-1">
              {getPageNumbers().map((page, index) => (
                page === '...' ? (
                  <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground">
                    ...
                  </span>
                ) : (
                  <Button
                    key={page}
                    variant={currentPage === page ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => goToPage(page as number)}
                    className="h-9 w-9 p-0"
                  >
                    {page}
                  </Button>
                )
              ))}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="h-9 w-9 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground">
            Sayfa {currentPage} / {totalPages}
          </p>
        </div>
      )}
    </div>
  );
}
