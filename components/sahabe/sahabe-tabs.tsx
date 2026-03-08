'use client';
import { cn } from '@/lib/utils';

interface SahabeTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'hayati', label: 'Hayatı' },
  { id: 'olaylar', label: 'Katıldığı Olaylar' },
  { id: 'iliskiler', label: 'İlişkiler' },
  { id: 'hadisler', label: 'Rivayet Ettiği Hadisler' },
];

export function SahabeTabs({ activeTab, onTabChange }: SahabeTabsProps) {
  return (
    <div className="border-b border-border">
      <div className="container mx-auto px-4">
        <nav className="flex gap-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'whitespace-nowrap px-4 py-3 text-sm font-medium transition-colors',
                activeTab === tab.id
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-foreground/60 hover:text-foreground'
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
