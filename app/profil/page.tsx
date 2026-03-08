'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Heart, FileText, Settings, Edit, Trash2, Plus, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useAuth } from '@/contexts/auth-context';
import { favoritesService } from '@/services/api';

// Mock data for user notes and favorites
const mockNotes = [
  { id: '1', sahabeId: 'hz-ali', sahabeName: 'Hz. Ali', content: 'Hz. Ali hakkında önemli notlarım...', updatedAt: '2024-01-15' },
  { id: '2', sahabeId: 'hz-ebubekir', sahabeName: 'Hz. Ebubekir', content: 'Sıddık lakabının anlamı ve önemi...', updatedAt: '2024-01-10' },
];

type Tab = 'overview' | 'notes' | 'favorites' | 'settings';

export default function ProfilePage() {
  const { user, isAuthenticated, logout, updateUser } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [notes, setNotes] = useState(mockNotes);
  const [savedItems, setSavedItems] = useState<Array<{
    id: string;
    name: string;
    slug: string;
    imageUrl?: string;
    description?: string;
  }>>([]);
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [noteContent, setNoteContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const data = await favoritesService.list();
        const mapped = (data.favorites || []).map((item) => ({
          id: String(item._id || item.id || ''),
          name: String(item.name || ''),
          slug: String(item.slug || ''),
          imageUrl: item.image ? String(item.image) : undefined,
          description: item.shortBio ? String(item.shortBio) : undefined,
        }));
        setSavedItems(mapped);
      } catch (error) {
        console.error('Kaydedilenler yüklenemedi:', error);
      }
    };
    fetchFavorites();
  }, []);

  if (!isAuthenticated) {
    router.push('/giris');
    return null;
  }

  const handleSaveNote = (noteId: string) => {
    setNotes(notes.map(n => n.id === noteId ? { ...n, content: noteContent, updatedAt: new Date().toISOString().split('T')[0] } : n));
    setEditingNote(null);
    setNoteContent('');
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes(notes.filter(n => n.id !== noteId));
  };

  const handleUpdateProfile = () => {
    updateUser({ name: editName });
    setIsEditing(false);
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 rounded-full">Admin</span>;
      case 'editor':
        return <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">Editör</span>;
      default:
        return <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">Kullanıcı</span>;
    }
  };

  const tabs = [
    { id: 'overview' as Tab, label: 'Genel Bakış', icon: User },
    { id: 'notes' as Tab, label: 'Notlarım', icon: FileText },
    { id: 'favorites' as Tab, label: 'Kaydedilenler', icon: Heart },
    { id: 'settings' as Tab, label: 'Ayarlar', icon: Settings },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-secondary/20">
        <div className="container mx-auto px-4 py-8">
          {/* Profile Header */}
          <div className="bg-card rounded-2xl border border-border p-6 mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <User className="h-10 w-10 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-bold text-foreground">{user?.name}</h1>
                  {user?.role && getRoleBadge(user.role)}
                </div>
                <p className="text-muted-foreground">{user?.email}</p>
              </div>
              {user?.role === 'admin' && (
                <Button asChild variant="outline" className="gap-2">
                  <Link href="/admin">
                    <Settings className="h-4 w-4" />
                    Admin Panel
                  </Link>
                </Button>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'default' : 'outline'}
                onClick={() => setActiveTab(tab.id)}
                className="gap-2 shrink-0"
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </Button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-card rounded-2xl border border-border p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-foreground">Hoş Geldiniz!</h2>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="bg-primary/5 rounded-xl p-4 text-center">
                    <FileText className="h-8 w-8 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold text-foreground">{notes.length}</div>
                    <div className="text-sm text-muted-foreground">Notlarınız</div>
                  </div>
                  <div className="bg-accent/10 rounded-xl p-4 text-center">
                    <Heart className="h-8 w-8 text-accent-foreground mx-auto mb-2" />
                    <div className="text-2xl font-bold text-foreground">{savedItems.length}</div>
                    <div className="text-sm text-muted-foreground">Kaydedilenler</div>
                  </div>
                  <div className="bg-primary/5 rounded-xl p-4 text-center">
                    <Star className="h-8 w-8 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold text-foreground">12</div>
                    <div className="text-sm text-muted-foreground">Okunan Sahabe</div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-3">Son Notlarınız</h3>
                  {notes.slice(0, 2).map((note) => (
                    <Link
                      key={note.id}
                      href={`/sahabe/${note.sahabeId}`}
                      className="block p-4 bg-muted/50 rounded-lg mb-2 hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-foreground">{note.sahabeName}</span>
                        <span className="text-xs text-muted-foreground">{note.updatedAt}</span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1 mt-1">{note.content}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Notes Tab */}
            {activeTab === 'notes' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-foreground">Notlarım</h2>
                  <Button size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Yeni Not
                  </Button>
                </div>
                
                {notes.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                    <p className="text-muted-foreground">Henüz not eklemediniz.</p>
                    <p className="text-sm text-muted-foreground mt-1">Sahabe sayfalarında not ekleyebilirsiniz.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {notes.map((note) => (
                      <div key={note.id} className="bg-muted/50 rounded-xl p-4">
                        <div className="flex items-start justify-between mb-2">
                          <Link href={`/sahabe/${note.sahabeId}`} className="font-semibold text-foreground hover:text-primary">
                            {note.sahabeName}
                          </Link>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">{note.updatedAt}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => {
                                setEditingNote(note.id);
                                setNoteContent(note.content);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive"
                              onClick={() => handleDeleteNote(note.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        {editingNote === note.id ? (
                          <div className="space-y-2">
                            <Textarea
                              value={noteContent}
                              onChange={(e) => setNoteContent(e.target.value)}
                              rows={4}
                            />
                            <div className="flex gap-2">
                              <Button size="sm" onClick={() => handleSaveNote(note.id)}>Kaydet</Button>
                              <Button size="sm" variant="outline" onClick={() => setEditingNote(null)}>İptal</Button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-muted-foreground">{note.content}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Favorites Tab */}
            {activeTab === 'favorites' && (
              <div>
                <h2 className="text-xl font-bold text-foreground mb-6">Kaydedilenler</h2>
                
                {savedItems.length === 0 ? (
                  <div className="text-center py-12">
                    <Heart className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                    <p className="text-muted-foreground">Henüz kaydettiğiniz sahabe yok.</p>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {savedItems.map((sahabe) => (
                      <Link
                        key={sahabe.id}
                        href={`/sahabe/${sahabe.slug}`}
                        className="group bg-muted/50 rounded-xl overflow-hidden hover:shadow-md transition-all"
                      >
                        <div className="aspect-video relative overflow-hidden bg-muted">
                          <div 
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                            style={{ backgroundImage: `url(${sahabe.imageUrl || ''})` }}
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {sahabe.name}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{sahabe.description}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="max-w-lg">
                <h2 className="text-xl font-bold text-foreground mb-6">Hesap Ayarları</h2>
                
                <div className="space-y-6">
                  {/* Profile Info */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-foreground">Profil Bilgileri</h3>
                    
                    <div>
                      <label className="text-sm font-medium text-foreground">Ad Soyad</label>
                      {isEditing ? (
                        <div className="flex gap-2 mt-1">
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="flex-1 px-3 py-2 border border-border rounded-lg bg-background"
                          />
                          <Button onClick={handleUpdateProfile}>Kaydet</Button>
                          <Button variant="outline" onClick={() => setIsEditing(false)}>İptal</Button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between mt-1 p-3 bg-muted/50 rounded-lg">
                          <span>{user?.name}</span>
                          <Button variant="ghost" size="sm" onClick={() => { setIsEditing(true); setEditName(user?.name || ''); }}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground">E-posta</label>
                      <div className="mt-1 p-3 bg-muted/50 rounded-lg text-muted-foreground">
                        {user?.email}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground">Hesap Türü</label>
                      <div className="mt-1 p-3 bg-muted/50 rounded-lg flex items-center gap-2">
                        {getRoleBadge(user?.role || 'user')}
                        <span className="text-sm text-muted-foreground">
                          {user?.role === 'admin' ? 'Tam yetki' : user?.role === 'editor' ? 'Düzenleme yetkisi' : 'Okuma yetkisi'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Danger Zone */}
                  <div className="pt-6 border-t border-border">
                    <h3 className="font-semibold text-foreground mb-4">Tehlikeli Bölge</h3>
                    <Button variant="outline" className="text-destructive border-destructive hover:bg-destructive/10" onClick={logout}>
                      Çıkış Yap
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
