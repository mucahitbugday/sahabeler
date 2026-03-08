'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, User, Calendar, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { sahabeService } from '@/services/api';

interface SearchSuggestion {
  id: string;
  name: string;
  arabicName?: string;
  slug: string;
  type: 'sahabe' | 'event' | 'generation';
}

interface SearchInputProps {
  variant?: 'hero' | 'header';
  placeholder?: string;
}

export function SearchInput({ variant = 'hero', placeholder = 'Sahabe Ara...' }: SearchInputProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const searchSahabeler = async (searchQuery: string) => {
    if (searchQuery.length <= 1) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    try {
      const data = await sahabeService.search(searchQuery, 6);
      const results: SearchSuggestion[] = (data.sahabeler as Array<{ id: string; name: string; arabicName?: string; slug: string }> || []).map((s) => ({
        id: s.id,
        name: s.name,
        arabicName: s.arabicName,
        slug: s.slug,
        type: 'sahabe' as const,
      }));
      
      setSuggestions(results);
      setIsOpen(results.length > 0);
      setSelectedIndex(-1);
    } catch (error) {
      console.error('Arama hatası:', error);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchSahabeler(query);
    }, 300); // Debounce 300ms

    return () => clearTimeout(timeoutId);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          navigateToResult(suggestions[selectedIndex]);
        } else if (query) {
          router.push(`/ara?q=${encodeURIComponent(query)}`);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };

  const navigateToResult = (suggestion: SearchSuggestion) => {
    setIsOpen(false);
    setQuery('');
    switch (suggestion.type) {
      case 'sahabe':
        router.push(`/sahabe/${suggestion.slug}`);
        break;
      case 'event':
        router.push(`/olaylar/${suggestion.slug}`);
        break;
      case 'generation':
        router.push(`/nesiller/${suggestion.slug}`);
        break;
    }
  };

  const getIcon = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'sahabe':
        return <User className="h-4 w-4 text-primary" />;
      case 'event':
        return <Calendar className="h-4 w-4 text-accent" />;
      case 'generation':
        return <Users className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getTypeLabel = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'sahabe':
        return 'Sahabe';
      case 'event':
        return 'Olay';
      case 'generation':
        return 'Nesil';
    }
  };

  const isHero = variant === 'hero';

  return (
    <div ref={containerRef} className="relative w-full">
      <div className={`relative flex items-center ${isHero ? 'max-w-xl mx-auto' : ''}`}>
        <div className="relative flex-1">
          <Search className={`absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground ${isHero ? 'h-5 w-5' : 'h-4 w-4'}`} />
          <Input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => query.length > 0 && setIsOpen(true)}
            placeholder={placeholder}
            className={`
              ${isHero 
                ? 'h-14 pl-12 pr-28 text-lg rounded-xl border border-border bg-background/95 backdrop-blur focus:border-primary shadow-md' 
                : 'h-10 pl-10 pr-4 rounded-full border border-border bg-muted/50'
              }
            `}
          />
          {isHero && (
            <button
              onClick={() => query && router.push(`/ara?q=${encodeURIComponent(query)}`)}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-10 px-7 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
            >
              ARA
            </button>
          )}
        </div>
      </div>

      {/* Suggestions Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div className={`
          absolute z-50 mt-2 w-full bg-card border border-border rounded-xl shadow-xl overflow-hidden
          ${isHero ? 'max-w-xl left-1/2 -translate-x-1/2' : ''}
        `}>
          <div className="p-2">
            <p className="px-3 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Sonuçlar
            </p>
            {suggestions.map((suggestion, index) => (
              <button
                key={suggestion.id}
                onClick={() => navigateToResult(suggestion)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors
                  ${index === selectedIndex ? 'bg-primary/10' : 'hover:bg-muted'}
                `}
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                  {getIcon(suggestion.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{suggestion.name}</p>
                  <p className="text-xs text-muted-foreground">{getTypeLabel(suggestion.type)}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
