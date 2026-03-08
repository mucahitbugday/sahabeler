'use client';

import { useState, useEffect, type ChangeEvent } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Plus, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { sahabeService } from '@/services/api';

interface SahabeData {
  _id?: string;
  id?: string;
  name: string;
  arabicName?: string;
  slug?: string;
  title?: string;
  shortBio?: string;
  biography?: string;
  birthYear?: string;
  deathYear?: string;
  birthPlace?: string;
  deathPlace?: string;
  tribe?: string;
  father?: string;
  mother?: string;
  image?: string;
  imageUrl?: string;
  isFourCaliph?: boolean;
  caliphOrder?: number;
  relations?: { name: string; relation: string; description: string }[];
  hadiths?: { text: string; source: string; narrator: string }[];
  events?: { title: string; year: string; description: string }[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
    ogImage?: string;
  };
}

interface SahabeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  sahabe?: SahabeData;
}

export function SahabeFormModal({ isOpen, onClose, sahabe }: SahabeFormModalProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    arabicName: '',
    slug: '',
    title: '',
    shortBio: '',
    biography: '',
    birthYear: '',
    deathYear: '',
    birthPlace: '',
    deathPlace: '',
    tribe: '',
    father: '',
    mother: '',
    imageUrl: '',
    isFourCaliph: false,
    caliphOrder: '',
    relations: [] as { name: string; relation: string; description: string }[],
    hadiths: [] as { text: string; source: string; narrator: string }[],
    events: [] as { title: string; year: string; description: string }[],
    seo: {
      metaTitle: '',
      metaDescription: '',
      keywords: [] as string[],
      ogImage: '',
    },
  });

  const [newKeyword, setNewKeyword] = useState('');
  const [newRelation, setNewRelation] = useState({ name: '', relation: '', description: '' });
  const [newHadith, setNewHadith] = useState({ text: '', source: '', narrator: '' });
  const [newEvent, setNewEvent] = useState({ title: '', year: '', description: '' });
  const [imageError, setImageError] = useState('');
  const [ogImageError, setOgImageError] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingOgImage, setUploadingOgImage] = useState(false);

  useEffect(() => {
    if (sahabe) {
      setFormData({
        name: sahabe.name || '',
        arabicName: sahabe.arabicName || '',
        slug: sahabe.slug || '',
        title: sahabe.title || '',
        shortBio: sahabe.shortBio || '',
        biography: sahabe.biography || '',
        birthYear: sahabe.birthYear || '',
        deathYear: sahabe.deathYear || '',
        birthPlace: sahabe.birthPlace || '',
        deathPlace: sahabe.deathPlace || '',
        tribe: sahabe.tribe || '',
        father: sahabe.father || '',
        mother: sahabe.mother || '',
        imageUrl: sahabe.imageUrl || sahabe.image || '',
        isFourCaliph: sahabe.isFourCaliph || false,
        caliphOrder: sahabe.caliphOrder ? String(sahabe.caliphOrder) : '',
        relations: sahabe.relations || [],
        hadiths: sahabe.hadiths || [],
        events: sahabe.events || [],
        seo: {
          metaTitle: sahabe.seo?.metaTitle || '',
          metaDescription: sahabe.seo?.metaDescription || '',
          keywords: sahabe.seo?.keywords || [],
          ogImage: sahabe.seo?.ogImage || '',
        },
      });
    } else {
      // Reset form
      setFormData({
        name: '',
        arabicName: '',
        slug: '',
        title: '',
        shortBio: '',
        biography: '',
        birthYear: '',
        deathYear: '',
        birthPlace: '',
        deathPlace: '',
        tribe: '',
        father: '',
        mother: '',
        imageUrl: '',
        isFourCaliph: false,
        caliphOrder: '',
        relations: [],
        hadiths: [],
        events: [],
        seo: {
          metaTitle: '',
          metaDescription: '',
          keywords: [],
          ogImage: '',
        },
      });
    }
  }, [sahabe, isOpen]);

  const handleSubmit = async (asDraft: boolean = false) => {
    try {
      setLoading(true);

      // Auto-generate slug from name if not provided
      const slug = formData.slug || formData.name
        .toLowerCase()
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ş/g, 's')
        .replace(/ı/g, 'i')
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      const payload = {
        ...formData,
        slug,
        image: formData.imageUrl,
        isFourCaliph: formData.isFourCaliph,
        caliphOrder: formData.isFourCaliph && formData.caliphOrder ? Number(formData.caliphOrder) : undefined,
        // Admin onaylar, moderator pending yapar, editor draft/pending seçebilir
        status: user?.role === 'admin' 
          ? 'approved' 
          : asDraft 
            ? 'draft' 
            : 'pending',
      };

      delete (payload as Record<string, unknown>).imageUrl;

      const sahabeId = sahabe?._id || sahabe?.id;
      if (sahabeId) {
        await sahabeService.update(sahabeId, payload);
      } else {
        await sahabeService.create(payload);
      }

      onClose();
    } catch (error) {
      console.error('Form gönderim hatası:', error);
      alert(error instanceof Error ? error.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const addKeyword = () => {
    if (newKeyword.trim()) {
      setFormData({
        ...formData,
        seo: {
          ...formData.seo,
          keywords: [...formData.seo.keywords, newKeyword.trim()],
        },
      });
      setNewKeyword('');
    }
  };

  const removeKeyword = (index: number) => {
    setFormData({
      ...formData,
      seo: {
        ...formData.seo,
        keywords: formData.seo.keywords.filter((_, i) => i !== index),
      },
    });
  };

  const addRelation = () => {
    if (newRelation.name && newRelation.relation) {
      setFormData({
        ...formData,
        relations: [...formData.relations, newRelation],
      });
      setNewRelation({ name: '', relation: '', description: '' });
    }
  };

  const removeRelation = (index: number) => {
    setFormData({
      ...formData,
      relations: formData.relations.filter((_, i) => i !== index),
    });
  };

  const addHadith = () => {
    if (newHadith.text && newHadith.source) {
      setFormData({
        ...formData,
        hadiths: [...formData.hadiths, newHadith],
      });
      setNewHadith({ text: '', source: '', narrator: '' });
    }
  };

  const removeHadith = (index: number) => {
    setFormData({
      ...formData,
      hadiths: formData.hadiths.filter((_, i) => i !== index),
    });
  };

  const addEvent = () => {
    if (newEvent.title && newEvent.year) {
      setFormData({
        ...formData,
        events: [...formData.events, newEvent],
      });
      setNewEvent({ title: '', year: '', description: '' });
    }
  };

  const removeEvent = (index: number) => {
    setFormData({
      ...formData,
      events: formData.events.filter((_, i) => i !== index),
    });
  };

  const uploadImageFile = async (file: File): Promise<string> => {
    const fd = new FormData();
    fd.append('file', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: fd,
      credentials: 'include',
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data?.error || 'Resim yüklenemedi');
    }

    return String(data?.url || '');
  };

  const handleMainImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setImageError('Lütfen sadece resim dosyası seçin.');
      event.target.value = '';
      return;
    }

    try {
      setUploadingImage(true);
      const uploadedUrl = await uploadImageFile(file);
      setFormData({ ...formData, imageUrl: uploadedUrl });
      setImageError('');
    } catch {
      setImageError('Resim yüklenirken bir hata oluştu.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleOgImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setOgImageError('Lütfen sadece resim dosyası seçin.');
      event.target.value = '';
      return;
    }

    try {
      setUploadingOgImage(true);
      const uploadedUrl = await uploadImageFile(file);
      setFormData({
        ...formData,
        seo: { ...formData.seo, ogImage: uploadedUrl },
      });
      setOgImageError('');
    } catch {
      setOgImageError('Resim yüklenirken bir hata oluştu.');
    } finally {
      setUploadingOgImage(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {sahabe ? 'Sahabe Düzenle' : 'Yeni Sahabe Ekle'}
          </DialogTitle>
          <DialogDescription>
            Sahabe bilgilerini eksiksiz doldurun. SEO ayarları otomatik oluşturulur.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="basic">Temel</TabsTrigger>
            <TabsTrigger value="bio">Biyografi</TabsTrigger>
            <TabsTrigger value="relations">İlişkiler</TabsTrigger>
            <TabsTrigger value="content">İçerik</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
          </TabsList>

          {/* Temel Bilgiler */}
          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">İsim *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Hz. Ömer"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="arabicName">Arapça İsim</Label>
                <Input
                  id="arabicName"
                  value={formData.arabicName}
                  onChange={(e) => setFormData({ ...formData, arabicName: e.target.value })}
                  placeholder="عمر بن الخطاب"
                  className="font-arabic"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">URL (Slug)</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="hz-omer (Boş bırakılırsa otomatik oluşturulur)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Unvan</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="İslam'ın İkinci Halifesi"
              />
            </div>

            <div className="rounded-lg border border-border p-4 space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="isFourCaliph" className="cursor-pointer">Dört Halife mi?</Label>
                <input
                  id="isFourCaliph"
                  type="checkbox"
                  checked={formData.isFourCaliph}
                  onChange={(e) => setFormData({
                    ...formData,
                    isFourCaliph: e.target.checked,
                    caliphOrder: e.target.checked ? formData.caliphOrder : '',
                  })}
                />
              </div>

              {formData.isFourCaliph && (
                <div className="space-y-2">
                  <Label htmlFor="caliphOrder">Halifelik Sırası (1-4)</Label>
                  <Input
                    id="caliphOrder"
                    type="number"
                    min={1}
                    max={4}
                    value={formData.caliphOrder}
                    onChange={(e) => setFormData({ ...formData, caliphOrder: e.target.value })}
                    placeholder="1: Ebubekir, 2: Ömer, 3: Osman, 4: Ali"
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageFile">Görsel Seç</Label>
              <Input
                id="imageFile"
                type="file"
                accept="image/*"
                onChange={handleMainImageChange}
                disabled={uploadingImage}
              />
              {uploadingImage ? <p className="text-sm text-muted-foreground">Resim yükleniyor...</p> : null}
              {imageError ? <p className="text-sm text-destructive">{imageError}</p> : null}
              {formData.imageUrl ? (
                <div className="rounded-md border p-2">
                  <img src={formData.imageUrl} alt="Seçilen görsel" className="max-h-48 w-auto rounded-md" />
                </div>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="shortBio">Kısa Biyografi *</Label>
              <Textarea
                id="shortBio"
                value={formData.shortBio}
                onChange={(e) => setFormData({ ...formData, shortBio: e.target.value })}
                placeholder="2-3 cümlelik özet..."
                rows={3}
                required
              />
            </div>
          </TabsContent>

          {/* Biyografi */}
          <TabsContent value="bio" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="biography">Detaylı Biyografi *</Label>
              <Textarea
                id="biography"
                value={formData.biography}
                onChange={(e) => setFormData({ ...formData, biography: e.target.value })}
                placeholder="Detaylı hayat hikayesi..."
                rows={18}
                className="min-h-[420px]"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="birthYear">Doğum Yılı</Label>
                <Input
                  id="birthYear"
                  value={formData.birthYear}
                  onChange={(e) => setFormData({ ...formData, birthYear: e.target.value })}
                  placeholder="584"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deathYear">Vefat Yılı</Label>
                <Input
                  id="deathYear"
                  value={formData.deathYear}
                  onChange={(e) => setFormData({ ...formData, deathYear: e.target.value })}
                  placeholder="644"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="birthPlace">Doğum Yeri</Label>
                <Input
                  id="birthPlace"
                  value={formData.birthPlace}
                  onChange={(e) => setFormData({ ...formData, birthPlace: e.target.value })}
                  placeholder="Mekke"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deathPlace">Vefat Yeri</Label>
                <Input
                  id="deathPlace"
                  value={formData.deathPlace}
                  onChange={(e) => setFormData({ ...formData, deathPlace: e.target.value })}
                  placeholder="Medine"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tribe">Kabile</Label>
                <Input
                  id="tribe"
                  value={formData.tribe}
                  onChange={(e) => setFormData({ ...formData, tribe: e.target.value })}
                  placeholder="Kureyş"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="father">Baba</Label>
                <Input
                  id="father"
                  value={formData.father}
                  onChange={(e) => setFormData({ ...formData, father: e.target.value })}
                  placeholder="Hattab"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mother">Anne</Label>
                <Input
                  id="mother"
                  value={formData.mother}
                  onChange={(e) => setFormData({ ...formData, mother: e.target.value })}
                  placeholder="Hanteme"
                />
              </div>
            </div>
          </TabsContent>

          {/* İlişkiler */}
          <TabsContent value="relations" className="space-y-4">
            <div className="space-y-4">
              <Label>İlişkiler</Label>
              <div className="grid grid-cols-3 gap-2">
                <Input
                  placeholder="İsim"
                  value={newRelation.name}
                  onChange={(e) => setNewRelation({ ...newRelation, name: e.target.value })}
                />
                <Input
                  placeholder="İlişki türü"
                  value={newRelation.relation}
                  onChange={(e) => setNewRelation({ ...newRelation, relation: e.target.value })}
                />
                <Input
                  placeholder="Açıklama"
                  value={newRelation.description}
                  onChange={(e) => setNewRelation({ ...newRelation, description: e.target.value })}
                />
              </div>
              <Button type="button" variant="outline" size="sm" onClick={addRelation}>
                <Plus className="h-4 w-4 mr-2" /> İlişki Ekle
              </Button>

              <div className="space-y-2">
                {formData.relations.map((rel, index) => (
                  <Card key={index}>
                    <CardContent className="py-3 flex justify-between items-start">
                      <div>
                        <p className="font-medium">{rel.name} - {rel.relation}</p>
                        {rel.description && <p className="text-sm text-muted-foreground">{rel.description}</p>}
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeRelation(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* İçerik (Hadisler ve Olaylar) */}
          <TabsContent value="content" className="space-y-6">
            {/* Hadisler */}
            <div className="space-y-4">
              <Label>Hadisler</Label>
              <div className="space-y-2">
                <Textarea
                  placeholder="Hadis metni"
                  value={newHadith.text}
                  onChange={(e) => setNewHadith({ ...newHadith, text: e.target.value })}
                  rows={3}
                />
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Kaynak (Buhari, Müslim vb.)"
                    value={newHadith.source}
                    onChange={(e) => setNewHadith({ ...newHadith, source: e.target.value })}
                  />
                  <Input
                    placeholder="Ravi (İsteğe bağlı)"
                    value={newHadith.narrator}
                    onChange={(e) => setNewHadith({ ...newHadith, narrator: e.target.value })}
                  />
                </div>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={addHadith}>
                <Plus className="h-4 w-4 mr-2" /> Hadis Ekle
              </Button>

              <div className="space-y-2">
                {formData.hadiths.map((hadith, index) => (
                  <Card key={index}>
                    <CardContent className="py-3">
                      <div className="flex justify-between items-start mb-2">
                        <p className="text-sm font-medium">Hadis {index + 1}</p>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeHadith(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-sm">{hadith.text}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {hadith.source} {hadith.narrator && `- ${hadith.narrator}`}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Olaylar */}
            <div className="space-y-4">
              <Label>Önemli Olaylar</Label>
              <div className="space-y-2">
                <Input
                  placeholder="Olay başlığı"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                />
                <Input
                  placeholder="Yıl"
                  value={newEvent.year}
                  onChange={(e) => setNewEvent({ ...newEvent, year: e.target.value })}
                />
                <Textarea
                  placeholder="Olay açıklaması"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  rows={2}
                />
              </div>
              <Button type="button" variant="outline" size="sm" onClick={addEvent}>
                <Plus className="h-4 w-4 mr-2" /> Olay Ekle
              </Button>

              <div className="space-y-2">
                {formData.events.map((event, index) => (
                  <Card key={index}>
                    <CardContent className="py-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{event.title} ({event.year})</p>
                          {event.description && <p className="text-sm text-muted-foreground mt-1">{event.description}</p>}
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeEvent(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* SEO */}
          <TabsContent value="seo" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="metaTitle">Meta Başlık</Label>
              <Input
                id="metaTitle"
                value={formData.seo.metaTitle}
                onChange={(e) => setFormData({
                  ...formData,
                  seo: { ...formData.seo, metaTitle: e.target.value }
                })}
                placeholder="Boş bırakılırsa otomatik oluşturulur"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="metaDescription">Meta Açıklama</Label>
              <Textarea
                id="metaDescription"
                value={formData.seo.metaDescription}
                onChange={(e) => setFormData({
                  ...formData,
                  seo: { ...formData.seo, metaDescription: e.target.value }
                })}
                placeholder="Boş bırakılırsa kısa biyografiden otomatik oluşturulur"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="keywords">Anahtar Kelimeler</Label>
              <div className="flex gap-2">
                <Input
                  id="keywords"
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  placeholder="Anahtar kelime ekle"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                />
                <Button type="button" variant="outline" onClick={addKeyword}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.seo.keywords.map((keyword, index) => (
                  <div
                    key={index}
                    className="bg-secondary px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {keyword}
                    <button
                      type="button"
                      onClick={() => removeKeyword(index)}
                      className="hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ogImageFile">Open Graph Görseli Seç</Label>
              <Input
                id="ogImageFile"
                type="file"
                accept="image/*"
                onChange={handleOgImageChange}
                disabled={uploadingOgImage}
              />
              {uploadingOgImage ? <p className="text-sm text-muted-foreground">OG resmi yükleniyor...</p> : null}
              {ogImageError ? <p className="text-sm text-destructive">{ogImageError}</p> : null}
              {formData.seo.ogImage ? (
                <div className="rounded-md border p-2">
                  <img src={formData.seo.ogImage} alt="Seçilen OG görsel" className="max-h-48 w-auto rounded-md" />
                </div>
              ) : null}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            İptal
          </Button>
          
          {user?.role === 'editor' && (
            <Button
              variant="secondary"
              onClick={() => handleSubmit(true)}
              disabled={loading || !formData.name || !formData.shortBio || !formData.biography}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Taslak Olarak Kaydet
            </Button>
          )}
          
          <Button
            onClick={() => handleSubmit(false)}
            disabled={loading || !formData.name || !formData.shortBio || !formData.biography}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            {user?.role === 'admin' ? 'Kaydet ve Yayınla' : 'Onaya Gönder'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
