'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Loader2, Trash2, Edit2, FileEdit, Shield, Users, Settings } from 'lucide-react';
import { adminService } from '@/services/api';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'viewer' | 'editor' | 'moderator' | 'admin';
  createdAt: string;
}

export default function AdminPage() {
  const { user, isAdmin, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [newRole, setNewRole] = useState<'viewer' | 'editor' | 'moderator' | 'admin'>('viewer');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      router.push('/');
      return;
    }

    if (isAdmin) {
      fetchUsers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, isAdmin, router, page]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await adminService.getUsers(page, 20);
      setUsers(data.users);
      setTotal(data.pagination.total);
    } catch (error) {
      console.error('Fetch users error:', error);
      alert('Kullanıcılar yükleme başarısız');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (userId: string) => {
    try {
      await adminService.updateUserRole(userId, newRole);

      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
      setEditingUser(null);
      alert('Rol güncellendi');
    } catch (error) {
      console.error('Update role error:', error);
      alert('Rol güncelleme başarısız');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Bu kullanıcıyı silmek istediğinize emin misiniz?')) return;

    try {
      await adminService.deleteUser(userId);

      setUsers(users.filter(u => u.id !== userId));
      alert('Kullanıcı silindi');
    } catch (error) {
      console.error('Delete user error:', error);
      alert('Kullanıcı silme başarısız');
    }
  };

  if (authLoading || !isAdmin) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground">Admin Paneli</h1>
            <p className="mt-2 text-muted-foreground">Tüm kullanıcılar ve sistem yönetimi</p>
          </div>

          <div className="mb-8 grid gap-4 sm:grid-cols-4">
            <Link href="/admin">
              <div className="cursor-pointer rounded-lg border-2 border-primary bg-primary/10 p-6 transition-colors hover:bg-primary/20">
                <Users className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-semibold text-lg">Kullanıcı Yönetimi</h3>
                <p className="text-sm text-muted-foreground mt-1">Kullanıcıları görüntüle ve yönet</p>
              </div>
            </Link>
            <Link href="/admin/editor">
              <div className="cursor-pointer rounded-lg border-2 border-border bg-card p-6 transition-colors hover:bg-muted">
                <FileEdit className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-semibold text-lg">İçerik Yönetimi</h3>
                <p className="text-sm text-muted-foreground mt-1">Sahabe ekle ve düzenle</p>
              </div>
            </Link>
            <Link href="/admin/moderasyon">
              <div className="cursor-pointer rounded-lg border-2 border-border bg-card p-6 transition-colors hover:bg-muted">
                <Shield className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-semibold text-lg">Moderasyon</h3>
                <p className="text-sm text-muted-foreground mt-1">İçerikleri onayla veya reddet</p>
              </div>
            </Link>
            <Link href="/admin/ayarlar">
              <div className="cursor-pointer rounded-lg border-2 border-border bg-card p-6 transition-colors hover:bg-muted">
                <Settings className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-semibold text-lg">Site Ayarları</h3>
                <p className="text-sm text-muted-foreground mt-1">Hakkımızda içeriğini güncelle</p>
              </div>
            </Link>
          </div>

          {/* Statistics */}
          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-border bg-card p-6">
              <div className="text-sm text-muted-foreground">Toplam Kullanıcı</div>
              <div className="mt-2 text-3xl font-bold text-foreground">{total}</div>
            </div>
            <div className="rounded-lg border border-border bg-card p-6">
              <div className="text-sm text-muted-foreground">Admin Sayısı</div>
              <div className="mt-2 text-3xl font-bold text-primary">
                {users.filter(u => u.role === 'admin').length}
              </div>
            </div>
            <div className="rounded-lg border border-border bg-card p-6">
              <div className="text-sm text-muted-foreground">Editör Sayısı</div>
              <div className="mt-2 text-3xl font-bold text-accent">
                {users.filter(u => u.role === 'editor').length}
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="overflow-hidden rounded-lg border border-border bg-card">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-secondary/50">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Ad Soyad</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">E-posta</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Rol</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Kayıt Tarihi</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center">
                        <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
                      </td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                        Kullanıcı bulunamadı
                      </td>
                    </tr>
                  ) : (
                    users.map(userData => (
                      <tr key={userData.id} className="border-b border-border hover:bg-secondary/30">
                        <td className="px-6 py-4 font-medium text-foreground">{userData.name}</td>
                        <td className="px-6 py-4 text-foreground">{userData.email}</td>
                        <td className="px-6 py-4">
                          {editingUser === userData.id ? (
                            <select
                              value={newRole}
                              onChange={(e) => setNewRole(e.target.value as 'viewer' | 'editor' | 'moderator' | 'admin')}
                              className="rounded border border-border bg-background px-2 py-1"
                            >
                              <option value="viewer">Ziyaretçi</option>
                              <option value="editor">Editör</option>
                              <option value="moderator">Moderatör</option>
                              <option value="admin">Admin</option>
                            </select>
                          ) : (
                            <span className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${userData.role === 'admin' ? 'bg-primary/20 text-primary' :
                                userData.role === 'editor' ? 'bg-accent/20 text-accent' :
                                  userData.role === 'moderator' ? 'bg-orange-100 text-orange-600' :
                                  'bg-secondary/50 text-foreground'
                              }`}>
                              {userData.role === 'admin' ? 'Admin' : userData.role === 'editor' ? 'Editör' : userData.role === 'moderator' ? 'Moderatör' : 'Ziyaretçi'}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-foreground">
                          {new Date(userData.createdAt).toLocaleDateString('tr-TR')}
                        </td>
                        <td className="px-6 py-4">
                          {editingUser === userData.id ? (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleUpdateRole(userData.id)}
                                className="bg-primary text-primary-foreground"
                              >
                                Kaydet
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingUser(null)}
                              >
                                İptal
                              </Button>
                            </div>
                          ) : (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setEditingUser(userData.id);
                                  setNewRole(userData.role);
                                }}
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              {user?.id !== userData.id && (
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleDeleteUser(userData.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Toplam: {total} kullanıcı
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
              >
                Önceki
              </Button>
              <Button
                variant="outline"
                disabled={page * 20 >= total}
                onClick={() => setPage(p => p + 1)}
              >
                Sonraki
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
