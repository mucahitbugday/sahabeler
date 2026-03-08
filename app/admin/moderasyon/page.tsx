'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, X, Clock, FileText, User, Calendar } from 'lucide-react';
import { moderationService } from '@/services/api';

interface ModerationItem {
  id: string;
  name: string;
  arabicName?: string;
  slug: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  createdBy: {
    name: string;
    email: string;
    role: string;
  };
  moderatedBy?: {
    name: string;
    email: string;
  };
  moderationNote?: string;
  createdAt: string;
  updatedAt: string;
}

interface Stats {
  draft: number;
  pending: number;
  approved: number;
  rejected: number;
}

export default function ModerationPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<ModerationItem[]>([]);
  const [stats, setStats] = useState<Stats>({ draft: 0, pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/giris');
      return;
    }

    if (user?.role !== 'moderator' && user?.role !== 'admin') {
      router.push('/');
      return;
    }

    fetchModerationList(activeTab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user, activeTab]);

  const fetchModerationList = async (status: string) => {
    setLoading(true);
    try {
      const data = await moderationService.list(status);
      setItems(data.items as unknown as ModerationItem[]);
      setStats(data.stats as unknown as Stats);
    } catch (error) {
      console.error('Moderasyon listesi hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleModerate = async (id: string, action: 'approve' | 'reject', note?: string) => {
    setProcessingId(id);
    try {
      const data = await moderationService.moderateSahabe(id, action, note);
      alert(data.message);
      fetchModerationList(activeTab);
    } catch (error) {
      console.error('Moderasyon hatası:', error);
      alert('İşlem sırasında hata oluştu');
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500';
      case 'rejected':
        return 'bg-red-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'draft':
        return 'bg-gray-500';
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Onaylandı';
      case 'rejected':
        return 'Reddedildi';
      case 'pending':
        return 'Bekliyor';
      case 'draft':
        return 'Taslak';
      default:
        return status;
    }
  };

  if (!isAuthenticated || (user?.role !== 'moderator' && user?.role !== 'admin')) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="container mx-auto flex-1 px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">Moderasyon Merkezi</h1>
          <p className="text-muted-foreground">İçerikleri onaylayın veya reddedin</p>
        </div>

        {/* İstatistikler */}
        <div className="mb-8 grid gap-4 md:grid-cols-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-gray-100 p-3">
                <FileText className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Taslak</p>
                <p className="text-2xl font-bold">{stats.draft}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-yellow-100 p-3">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Bekliyor</p>
                <p className="text-2xl font-bold">{stats.pending}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-green-100 p-3">
                <Check className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Onaylı</p>
                <p className="text-2xl font-bold">{stats.approved}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-red-100 p-3">
                <X className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Reddedildi</p>
                <p className="text-2xl font-bold">{stats.rejected}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="pending">Bekliyor ({stats.pending})</TabsTrigger>
            <TabsTrigger value="draft">Taslak ({stats.draft})</TabsTrigger>
            <TabsTrigger value="approved">Onaylı ({stats.approved})</TabsTrigger>
            <TabsTrigger value="rejected">Reddedildi ({stats.rejected})</TabsTrigger>
            <TabsTrigger value="all">Tümü</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            {loading ? (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">Yükleniyor...</p>
              </div>
            ) : items.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">Bu kategoride içerik bulunmuyor</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <Card key={item.id} className="p-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-3">
                          <h3 className="text-xl font-bold">{item.name}</h3>
                          {item.arabicName && (
                            <span className="text-lg text-muted-foreground" dir="rtl">
                              {item.arabicName}
                            </span>
                          )}
                          <Badge className={getStatusColor(item.status)}>
                            {getStatusText(item.status)}
                          </Badge>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            <span>
                              {item.createdBy.name} ({item.createdBy.role})
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(item.createdAt).toLocaleDateString('tr-TR')}</span>
                          </div>
                        </div>

                        {item.moderatedBy && (
                          <div className="mt-2 text-sm text-green-600">
                            Moderatör: {item.moderatedBy.name}
                          </div>
                        )}

                        {item.moderationNote && (
                          <div className="mt-2 rounded-md bg-gray-100 p-2 text-sm">
                            <strong>Not:</strong> {item.moderationNote}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        {(item.status === 'pending' || item.status === 'draft') && (
                          <>
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handleModerate(item.id, 'approve')}
                              disabled={processingId === item.id}
                            >
                              <Check className="mr-1 h-4 w-4" />
                              Onayla
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                const note = prompt('Reddetme nedenini yazın (opsiyonel):');
                                handleModerate(item.id, 'reject', note || undefined);
                              }}
                              disabled={processingId === item.id}
                            >
                              <X className="mr-1 h-4 w-4" />
                              Reddet
                            </Button>
                          </>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/sahabe/${item.slug}`)}
                        >
                          Görüntüle
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}
