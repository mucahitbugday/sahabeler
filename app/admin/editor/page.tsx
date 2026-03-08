'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, Edit2, Eye, Trash2 } from 'lucide-react';
import { SahabeFormModal } from '@/components/sahabe/sahabe-form-modal';
import Link from 'next/link';
import { sahabeService } from '@/services/api';

interface SahabeItem {
  id: string;
  _id?: string;
  slug: string;
  name: string;
  arabicName?: string;
  title?: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  createdBy: {
    name: string;
    email: string;
    role: string;
  };
  moderatedBy?: {
    name: string;
  };
  moderationNote?: string;
  createdAt: string;
  updatedAt: string;
}

export default function EditorPage() {
  const { user } = useAuth();
  const [sahabeler, setSahabeler] = useState<SahabeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingLoadingId, setEditingLoadingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSahabe, setEditingSahabe] = useState<SahabeItem | null>(null);
  const [stats, setStats] = useState({
    draft: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  useEffect(() => {
    fetchSahabeler();
  }, []);

  const fetchSahabeler = async () => {
    try {
      setLoading(true);
      const data = await sahabeService.list();
      const list = ((data.sahabeler || []) as Array<Record<string, unknown>>).map((item) => ({
        ...(item as unknown as SahabeItem),
        id: (item.id as string) || (item._id as string),
      }));
      setSahabeler(list);
      
      // İstatistikleri hesapla
      const stats = {
        draft: list.filter((s: SahabeItem) => s.status === 'draft').length,
        pending: list.filter((s: SahabeItem) => s.status === 'pending').length,
        approved: list.filter((s: SahabeItem) => s.status === 'approved').length,
        rejected: list.filter((s: SahabeItem) => s.status === 'rejected').length,
      };
      setStats(stats);
    } catch (error) {
      console.error('Sahabeler yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu sahabeyi silmek istediğinizden emin misiniz?')) return;

    try {
      await sahabeService.remove(id);
      
      await fetchSahabeler();
    } catch (error) {
      console.error('Silme hatası:', error);
      alert('Sahabe silinirken bir hata oluştu');
    }
  };

  const handleEdit = async (sahabe: SahabeItem) => {
    try {
      setEditingLoadingId(sahabe.id);
      const detail = await sahabeService.getById(sahabe.id);
      const full = detail.sahabe as unknown as SahabeItem;
      setEditingSahabe({
        ...sahabe,
        ...full,
        id: (full.id as unknown as string) || (full._id as string) || sahabe.id,
      });
      setIsModalOpen(true);
    } catch (error) {
      console.error('Sahabe detayı yüklenirken hata:', error);
      alert('Sahabe detayları yüklenemedi. Lütfen tekrar deneyin.');
    } finally {
      setEditingLoadingId(null);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingSahabe(null);
    fetchSahabeler();
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      draft: 'secondary',
      pending: 'default',
      approved: 'default',
      rejected: 'destructive',
    } as const;

    const labels = {
      draft: 'Taslak',
      pending: 'Onay Bekliyor',
      approved: 'Yayında',
      rejected: 'Reddedildi',
    };

    return (
      <Badge variant={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">İçerik Yönetimi</h1>
              <p className="text-muted-foreground mt-2">
                Sahabe bilgilerini ekleyin ve düzenleyin
              </p>
            </div>
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Yeni Sahabe Ekle
            </Button>
          </div>

          {/* İstatistikler */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Taslak</CardDescription>
                <CardTitle className="text-3xl">{stats.draft}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Onay Bekliyor</CardDescription>
                <CardTitle className="text-3xl">{stats.pending}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Yayında</CardDescription>
                <CardTitle className="text-3xl">{stats.approved}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Reddedildi</CardDescription>
                <CardTitle className="text-3xl">{stats.rejected}</CardTitle>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* Sahabeler Listesi */}
        <div className="space-y-4">
          {sahabeler.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Henüz sahabe eklenmemiş. Yeni sahabe eklemek için yukarıdaki butona tıklayın.
              </CardContent>
            </Card>
          ) : (
            sahabeler.map((sahabe) => (
              <Card key={sahabe.id}>
                <CardContent className="py-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold">{sahabe.name}</h3>
                        {sahabe.arabicName && (
                          <span className="text-sm text-muted-foreground font-arabic">
                            {sahabe.arabicName}
                          </span>
                        )}
                        {getStatusBadge(sahabe.status)}
                      </div>
                      
                      {sahabe.title && (
                        <p className="text-sm text-muted-foreground">{sahabe.title}</p>
                      )}
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Ekleyen: {sahabe.createdBy.name}</span>
                        <span>•</span>
                        <span>
                          {new Date(sahabe.createdAt).toLocaleDateString('tr-TR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                      </div>

                      {sahabe.status === 'rejected' && sahabe.moderationNote && (
                        <div className="mt-2 p-3 bg-destructive/10 rounded-md">
                          <p className="text-sm text-destructive font-medium mb-1">
                            Ret Nedeni:
                          </p>
                          <p className="text-sm">{sahabe.moderationNote}</p>
                        </div>
                      )}

                      {sahabe.moderatedBy && (
                        <div className="text-xs text-muted-foreground">
                          Moderatör: {sahabe.moderatedBy.name}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(sahabe)}
                        disabled={editingLoadingId === sahabe.id}
                      >
                        {editingLoadingId === sahabe.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Edit2 className="h-4 w-4" />
                        )}
                      </Button>
                      
                      <Link href={`/sahabe/${sahabe.slug}`} passHref>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>

                      {/* Sadece kendi içeriğini silebilir */}
                      {user?.role === 'admin' || sahabe.createdBy.email === user?.email ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(sahabe.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      ) : null}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
      <Footer />

      {/* Sahabe Form Modal */}
      <SahabeFormModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        sahabe={editingSahabe || undefined}
      />
    </div>
  );
}
