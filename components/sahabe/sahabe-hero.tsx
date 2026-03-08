'use client';

import Link from 'next/link';
import type { Sahabe } from '@/types';
import { Calendar, Star, Users } from 'lucide-react';

interface SahabeHeroProps {
  sahabe: Sahabe;
}

export function SahabeHero({ sahabe }: SahabeHeroProps) {
  return (
    <section className="relative overflow-hidden">
      {/* Background with Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary to-accent/10">
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231a4d3c' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="container relative mx-auto px-4 py-16 md:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-5">
          {/* Left Content */}
          <div className="lg:col-span-3">
            {/* Breadcrumb */}
            <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-primary transition-colors">Ana Sayfa</Link>
              <span>/</span>
              <Link href="/sahabeler" className="hover:text-primary transition-colors">Sahabeler</Link>
              <span>/</span>
              <span className="text-primary font-medium">{sahabe.name}</span>
            </div>

            {/* Name */}
            <div className="mb-6">
              <h1 className="mb-3 text-5xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl">
                {sahabe.name.toUpperCase()}
              </h1>
              <p className="text-3xl font-medium text-primary/80 md:text-4xl" dir="rtl" style={{ fontFamily: 'Amiri, serif' }}>
                {sahabe.arabicName}
              </p>
            </div>

            {/* Info Grid */}
            <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex items-center gap-3 rounded-xl bg-card/80 backdrop-blur-sm px-4 py-3 shadow-sm border border-border/50 hover:border-primary/50 transition-colors">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Doğum</p>
                  <p className="font-semibold text-foreground">{sahabe.birthYear} yılında</p>
                  <p className="text-xs text-muted-foreground">{sahabe.birthPlace}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 rounded-xl bg-card/80 backdrop-blur-sm px-4 py-3 shadow-sm border border-border/50 hover:border-destructive/50 transition-colors">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
                  <Calendar className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Vefat</p>
                  <p className="font-semibold text-foreground">{sahabe.deathYear} yılında</p>
                  <p className="text-xs text-muted-foreground">{sahabe.deathPlace}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 rounded-xl bg-card/80 backdrop-blur-sm px-4 py-3 shadow-sm border border-border/50 hover:border-accent/50 transition-colors">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20">
                  <Star className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Unvan</p>
                  <p className="font-semibold text-foreground">{sahabe.title}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 rounded-xl bg-card/80 backdrop-blur-sm px-4 py-3 shadow-sm border border-border/50 hover:border-primary/50 transition-colors">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Dönem</p>
                  <p className="font-semibold text-foreground">{sahabe.generation}</p>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground">
                {sahabe.generation}
              </span>
              <span className="rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
                {sahabe.title}
              </span>
              {sahabe.nickname && (
                <span className="rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent-foreground">
                  {sahabe.nickname}
                </span>
              )}
            </div>

            {/* Short Description */}
            <p className="mt-6 text-lg leading-relaxed text-foreground/80 max-w-2xl">
              {sahabe.description}
            </p>
          </div>

          {/* Right Content - Decorative Card */}
          <div className="hidden lg:col-span-2 lg:flex lg:items-center lg:justify-center">
            <div className="relative">
              {/* Decorative Circle Background */}
              <div className="absolute -inset-4 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 blur-2xl" />
              
              {/* Main Card */}
              <div className="relative rounded-2xl border-2 border-primary/20 bg-card/90 backdrop-blur-sm p-8 shadow-2xl">
                <div className="text-center">
                  {/* Placeholder for Portrait */}
                  <div className="mx-auto mb-6 h-48 w-48 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border-4 border-primary/30">
                    <span className="text-6xl font-bold text-primary/40">
                      {sahabe.name.charAt(0)}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-foreground">{sahabe.name}</h3>
                  <p className="mt-1 text-primary" dir="rtl">{sahabe.arabicName}</p>
                  
                  <div className="mt-6 grid grid-cols-3 gap-4 border-t border-border/50 pt-6">
                    <div>
                      <p className="text-2xl font-bold text-primary">{sahabe.hadiths.length}</p>
                      <p className="text-xs text-muted-foreground">Hadis</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-primary">{sahabe.events.length}</p>
                      <p className="text-xs text-muted-foreground">Olay</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-primary">{sahabe.relations.length}</p>
                      <p className="text-xs text-muted-foreground">Iliski</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
    </section>
  );
}
