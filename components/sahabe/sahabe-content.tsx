'use client';

import { useState } from 'react';
import type { Sahabe } from '@/types';
import { SahabeTabs } from './sahabe-tabs';
import { BiographySection } from './biography-section';
import { EventsSection } from './events-section';
import { RelationsSection } from './relations-section';
import { HadithsSection } from './hadiths-section';
import { SidebarRelations } from './sidebar-relations';

interface SahabeContentProps {
  sahabe: Sahabe;
}

export function SahabeContent({ sahabe }: SahabeContentProps) {
  const [activeTab, setActiveTab] = useState('hayati');
  const primaryRelation = sahabe.relations[0] ?? {
    name: 'Bilgi yok',
    relationship: 'İlişki bilgisi bulunamadı',
    imageUrl: '',
  };

  return (
    <>
      <SahabeTabs activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="container mx-auto px-4 py-8">
        {activeTab === 'hayati' && (
          <div className="grid gap-8 lg:grid-cols-4">
            <div className="lg:col-span-3">
              <BiographySection sahabe={sahabe} />
            </div>
            
            <div className="space-y-6 lg:col-span-1">
              <SidebarRelations relatedPerson={primaryRelation} />
              <HadithsSection hadiths={sahabe.hadiths} compact />
            </div>
          </div>
        )}
        
        {activeTab === 'olaylar' && (
          <EventsSection events={sahabe.events} />
        )}
        
        {activeTab === 'iliskiler' && (
          <RelationsSection relations={sahabe.relations} mainPersonName={sahabe.name} />
        )}
        
        {activeTab === 'hadisler' && (
          <div className="mx-auto max-w-4xl">
            <HadithsSection 
              hadiths={sahabe.hadiths} 
              itemsPerPage={10} 
              showSearch 
            />
          </div>
        )}
      </div>
    </>
  );
}
