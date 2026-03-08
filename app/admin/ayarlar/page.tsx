'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { siteSettingsService } from '@/services/api';

type AboutData = {
  heroTitle: string;
  heroDescription: string;
  missionTitle: string;
  missionParagraph1: string;
  missionParagraph2: string;
  stats: {
    sahabeCount: string;
    hadithCount: string;
    monthlyVisitors: string;
  };
  values: { title: string; description: string }[];
  team: { name: string; role: string; specialty: string }[];
  contact: {
    email: string;
    phone: string;
    address: string;
  };
};

const emptyAbout: AboutData = {
  heroTitle: '',
  heroDescription: '',
  missionTitle: '',
  missionParagraph1: '',
  missionParagraph2: '',
  stats: { sahabeCount: '', hadithCount: '', monthlyVisitors: '' },
  values: [
    { title: '', description: '' },
    { title: '', description: '' },
    { title: '', description: '' },
    { title: '', description: '' },
  ],
  team: [
    { name: '', role: '', specialty: '' },
    { name: '', role: '', specialty: '' },
    { name: '', role: '', specialty: '' },
  ],
  contact: { email: '', phone: '', address: '' },
};

export default function AdminSettingsPage() {
  const [about, setAbout] = useState<AboutData>(emptyAbout);
  const [valuesJson, setValuesJson] = useState('[]');
  const [teamJson, setTeamJson] = useState('[]');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const toAboutData = (input: Record<string, unknown> | undefined): AboutData => {
    const source = input || {};
    return {
      heroTitle: (source.heroTitle as string) || '',
      heroDescription: (source.heroDescription as string) || '',
      missionTitle: (source.missionTitle as string) || '',
      missionParagraph1: (source.missionParagraph1 as string) || '',
      missionParagraph2: (source.missionParagraph2 as string) || '',
      stats: {
        sahabeCount: ((source.stats as Record<string, unknown>)?.sahabeCount as string) || '',
        hadithCount: ((source.stats as Record<string, unknown>)?.hadithCount as string) || '',
        monthlyVisitors: ((source.stats as Record<string, unknown>)?.monthlyVisitors as string) || '',
      },
      values: Array.isArray(source.values)
        ? (source.values as Array<Record<string, unknown>>).map((item) => ({
          title: (item.title as string) || '',
          description: (item.description as string) || '',
        }))
        : [],
      team: Array.isArray(source.team)
        ? (source.team as Array<Record<string, unknown>>).map((item) => ({
          name: (item.name as string) || '',
          role: (item.role as string) || '',
          specialty: (item.specialty as string) || '',
        }))
        : [],
      contact: {
        email: ((source.contact as Record<string, unknown>)?.email as string) || '',
        phone: ((source.contact as Record<string, unknown>)?.phone as string) || '',
        address: ((source.contact as Record<string, unknown>)?.address as string) || '',
      },
    };
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const data = await siteSettingsService.get();
        const nextAbout = toAboutData(data.settings?.about);
        setAbout(nextAbout);
        setValuesJson(JSON.stringify(nextAbout.values || [], null, 2));
        setTeamJson(JSON.stringify(nextAbout.team || [], null, 2));
      } catch (error) {
        console.error('Settings fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const saveSettings = async () => {
    try {
      setSaving(true);

      const parsedValues = JSON.parse(valuesJson) as { title: string; description: string }[];
      const parsedTeam = JSON.parse(teamJson) as { name: string; role: string; specialty: string }[];

      await siteSettingsService.update({
        ...about,
        values: parsedValues,
        team: parsedTeam,
      });
      alert('Site ayarları güncellendi');
    } catch (error) {
      console.error('Settings save error:', error);
      alert('Ayarlar kaydedilemedi');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Site Ayarları</h1>
          <p className="text-muted-foreground mt-2">Hakkımızda sayfası içeriklerini buradan güncelleyebilirsiniz.</p>
        </div>

        <div className="space-y-8">
          <section className="space-y-4 rounded-lg border border-border p-6 bg-card">
            <h2 className="text-xl font-semibold">Hero</h2>
            <Input value={about.heroTitle} onChange={(e) => setAbout({ ...about, heroTitle: e.target.value })} placeholder="Hero başlık" />
            <Textarea value={about.heroDescription} onChange={(e) => setAbout({ ...about, heroDescription: e.target.value })} placeholder="Hero açıklama" rows={4} />
          </section>

          <section className="space-y-4 rounded-lg border border-border p-6 bg-card">
            <h2 className="text-xl font-semibold">Misyon</h2>
            <Input value={about.missionTitle} onChange={(e) => setAbout({ ...about, missionTitle: e.target.value })} placeholder="Misyon başlık" />
            <Textarea value={about.missionParagraph1} onChange={(e) => setAbout({ ...about, missionParagraph1: e.target.value })} placeholder="Misyon paragraf 1" rows={4} />
            <Textarea value={about.missionParagraph2} onChange={(e) => setAbout({ ...about, missionParagraph2: e.target.value })} placeholder="Misyon paragraf 2" rows={4} />
          </section>

          <section className="space-y-4 rounded-lg border border-border p-6 bg-card">
            <h2 className="text-xl font-semibold">İstatistikler</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <Input value={about.stats.sahabeCount} onChange={(e) => setAbout({ ...about, stats: { ...about.stats, sahabeCount: e.target.value } })} placeholder="Sahabe sayısı" />
              <Input value={about.stats.hadithCount} onChange={(e) => setAbout({ ...about, stats: { ...about.stats, hadithCount: e.target.value } })} placeholder="Hadis sayısı" />
              <Input value={about.stats.monthlyVisitors} onChange={(e) => setAbout({ ...about, stats: { ...about.stats, monthlyVisitors: e.target.value } })} placeholder="Aylık ziyaretçi" />
            </div>
          </section>

          <section className="space-y-4 rounded-lg border border-border p-6 bg-card">
            <h2 className="text-xl font-semibold">İletişim</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <Input value={about.contact.email} onChange={(e) => setAbout({ ...about, contact: { ...about.contact, email: e.target.value } })} placeholder="E-posta" />
              <Input value={about.contact.phone} onChange={(e) => setAbout({ ...about, contact: { ...about.contact, phone: e.target.value } })} placeholder="Telefon" />
              <Input value={about.contact.address} onChange={(e) => setAbout({ ...about, contact: { ...about.contact, address: e.target.value } })} placeholder="Adres" />
            </div>
          </section>

          <section className="space-y-4 rounded-lg border border-border p-6 bg-card">
            <h2 className="text-xl font-semibold">Değerler (JSON)</h2>
            <p className="text-sm text-muted-foreground">Format: {`[{"title":"...","description":"..."}]`}</p>
            <Textarea value={valuesJson} onChange={(e) => setValuesJson(e.target.value)} rows={10} />
          </section>

          <section className="space-y-4 rounded-lg border border-border p-6 bg-card">
            <h2 className="text-xl font-semibold">Ekip (JSON)</h2>
            <p className="text-sm text-muted-foreground">Format: {`[{"name":"...","role":"...","specialty":"..."}]`}</p>
            <Textarea value={teamJson} onChange={(e) => setTeamJson(e.target.value)} rows={10} />
          </section>
        </div>

        <div className="mt-8">
          <Button onClick={saveSettings} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Kaydet
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
