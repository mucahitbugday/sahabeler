'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { BookOpen, Heart, Users, Shield, Mail, MapPin, Phone } from 'lucide-react';
import { siteSettingsService } from '@/services/api';

const iconMap = [BookOpen, Heart, Users, Shield];

const DEFAULT_ABOUT = {
  heroTitle: 'Sahabeleri Tanıtmak, Sevdirmek',
  heroDescription:
    'sahabeler.net olarak misyonumuz, Hz. Peygamber\'in (sav) kutlu ashabını günümüz insanına tanıtmak ve onların örnek hayatlarından ilham almamızı sağlamaktır.',
  missionTitle: 'Misyonumuz',
  missionParagraph1:
    'Sahabeler.net, İslam\'ın ilk nesillerini tanıtan kapsamlı bir dijital ansiklopedi olarak kurulmuştur. Amacımız, sahabelerin hayatlarını, onların yaşadığı olayları ve rivayet ettikleri hadisleri herkesin erişebileceği bir platformda sunmaktır.',
  missionParagraph2:
    'Her içeriğimiz, alanında uzman akademisyenler tarafından hazırlanmakta ve muteber kaynaklara dayanmaktadır. Bilginin doğru aktarılması bizim için en önemli önceliktir.',
  stats: {
    sahabeCount: '500+',
    hadithCount: '10,000+',
    monthlyVisitors: '50,000+',
  },
  values: [
    { title: 'Güvenilir Kaynaklar', description: 'Tüm içeriklerimiz muteber hadis kaynaklarından ve tarih kitaplarından derlenmektedir.' },
    { title: 'Sevgi ve Saygı', description: 'Sahabelere olan sevgi ve saygımızı, onların hayatlarını doğru aktararak gösteriyoruz.' },
    { title: 'Topluluk', description: 'İslam tarihini seven, öğrenmek isteyen herkes için açık bir platform oluşturuyoruz.' },
    { title: 'Doğruluk', description: 'Her bilgiyi titizlikle araştırıyor, kaynaklarıyla birlikte sunuyoruz.' },
  ],
  team: [
    { name: 'Dr. Ahmet Yılmaz', role: 'İçerik Editörü', specialty: 'İslam Tarihi' },
    { name: 'Fatma Kaya', role: 'Araştırmacı', specialty: 'Hadis İlimleri' },
    { name: 'Mehmet Demir', role: 'Geliştirici', specialty: 'Web Teknolojileri' },
  ],
  contact: {
    email: 'info@sahabeler.net',
    phone: '+90 212 XXX XX XX',
    address: 'İstanbul, Türkiye',
  },
};

export default function HakkimizaPage() {
  const [about, setAbout] = useState<typeof DEFAULT_ABOUT>(DEFAULT_ABOUT);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await siteSettingsService.get();
        if (data.settings?.about) {
          setAbout(data.settings.about as typeof DEFAULT_ABOUT);
        }
      } catch (error) {
        console.error('Site ayarları yüklenemedi:', error);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Yükleniyor...</p>
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
        <section className="relative bg-gradient-to-b from-primary/10 to-background py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6">{about.heroTitle}</h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">{about.heroDescription}</p>
            </div>
          </div>
        </section>

        <section id="misyon" className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">{about.missionTitle}</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">{about.missionParagraph1}</p>
                  <p className="text-muted-foreground leading-relaxed">{about.missionParagraph2}</p>
                </div>
                <div className="bg-card rounded-2xl border border-border p-8">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <BookOpen className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-foreground">{about.stats.sahabeCount}</div>
                        <div className="text-sm text-muted-foreground">Sahabe Biyografisi</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                        <Heart className="h-6 w-6 text-accent-foreground" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-foreground">{about.stats.hadithCount}</div>
                        <div className="text-sm text-muted-foreground">Hadis-i Şerif</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Users className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-foreground">{about.stats.monthlyVisitors}</div>
                        <div className="text-sm text-muted-foreground">Aylık Ziyaretçi</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Değerlerimiz</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">Her adımımızda bizi yönlendiren temel ilkelerimiz</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {about.values.map((value: { title: string; description: string }, index: number) => {
                const Icon = iconMap[index % iconMap.length];
                return (
                  <div key={value.title} className="bg-card rounded-xl border border-border p-6 text-center">
                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 mb-4">
                      <Icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="font-bold text-foreground mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Ekibimiz</h2>
              <p className="text-muted-foreground">İçeriklerimizi hazırlayan uzman kadromuz</p>
            </div>
            <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
              {about.team.map((member: { name: string; role: string; specialty: string }) => (
                <div key={member.name} className="bg-card rounded-xl border border-border p-6 text-center">
                  <div className="h-20 w-20 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-10 w-10 text-primary/50" />
                  </div>
                  <h3 className="font-bold text-foreground">{member.name}</h3>
                  <p className="text-sm text-primary mb-1">{member.role}</p>
                  <p className="text-xs text-muted-foreground">{member.specialty}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">İletişim</h2>
              <p className="text-muted-foreground mb-8">Sorularınız veya önerileriniz için bizimle iletişime geçebilirsiniz.</p>
              <div className="grid sm:grid-cols-3 gap-6">
                <div className="flex flex-col items-center gap-2">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">{about.contact.email}</p>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">{about.contact.phone}</p>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">{about.contact.address}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
