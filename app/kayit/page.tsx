'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, User, Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/auth-context';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

const passwordRequirements = [
  { id: 'length', label: 'En az 8 karakter', test: (p: string) => p.length >= 8 },
  { id: 'uppercase', label: 'Bir büyük harf', test: (p: string) => /[A-Z]/.test(p) },
  { id: 'number', label: 'Bir rakam', test: (p: string) => /[0-9]/.test(p) },
];

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Şifreler eşleşmiyor.');
      return;
    }

    if (!acceptTerms) {
      setError('Kullanım şartlarını kabul etmelisiniz.');
      return;
    }

    const allRequirementsMet = passwordRequirements.every((req) => req.test(password));
    if (!allRequirementsMet) {
      setError('Şifre gereksinimlerini karşılamıyor.');
      return;
    }

    setIsLoading(true);

    try {
      await register(name, email, password);
      router.push('/');
    } catch {
      setError('Kayıt oluşturulurken bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialRegister = (provider: string) => {
    console.log(`Register with ${provider}`);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-card border border-border rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 px-8 py-8 text-center border-b border-border">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                <svg viewBox="0 0 40 40" className="h-10 w-10" fill="none">
                  <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1.5" className="text-primary" />
                  <path
                    d="M20 6 L22 12 L28 12 L23 16 L25 22 L20 18 L15 22 L17 16 L12 12 L18 12 Z"
                    fill="currentColor"
                    className="text-primary"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-foreground">Hesap Oluşturun</h1>
              <p className="text-muted-foreground mt-1">Sahabelerin dünyasını keşfedin</p>
            </div>

            {/* Form */}
            <div className="p-8">
              {error && (
                <div className="mb-6 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-foreground">
                    Ad Soyad
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Adınız Soyadınız"
                      required
                      className="pl-10 h-12"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-foreground">
                    E-posta Adresi
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ornek@email.com"
                      required
                      className="pl-10 h-12"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-foreground">
                    Şifre
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="pl-10 pr-10 h-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {/* Password Requirements */}
                  {password && (
                    <div className="mt-2 space-y-1">
                      {passwordRequirements.map((req) => (
                        <div
                          key={req.id}
                          className={`flex items-center gap-2 text-xs ${
                            req.test(password) ? 'text-green-600' : 'text-muted-foreground'
                          }`}
                        >
                          <Check className={`h-3 w-3 ${req.test(password) ? 'opacity-100' : 'opacity-30'}`} />
                          {req.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                    Şifre Tekrar
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="pl-10 h-12"
                    />
                  </div>
                  {confirmPassword && password !== confirmPassword && (
                    <p className="text-xs text-destructive mt-1">Şifreler eşleşmiyor</p>
                  )}
                </div>

                {/* Terms */}
                <div className="flex items-start gap-3 pt-2">
                  <input
                    id="terms"
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary"
                  />
                  <label htmlFor="terms" className="text-sm text-muted-foreground">
                    <Link href="/kullanim-sartlari" className="text-primary hover:underline">
                      Kullanım Şartları
                    </Link>{' '}
                    ve{' '}
                    <Link href="/gizlilik" className="text-primary hover:underline">
                      Gizlilik Politikası
                    </Link>
                    &apos;nı okudum ve kabul ediyorum.
                  </label>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 text-base font-medium mt-4"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Kayıt Yapılıyor...
                    </>
                  ) : (
                    'Kayıt Ol'
                  )}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-card text-muted-foreground">veya</span>
                </div>
              </div>

              {/* Social Register */}
              <div className="grid grid-cols-3 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleSocialRegister('google')}
                  className="h-12"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleSocialRegister('facebook')}
                  className="h-12"
                >
                  <svg className="h-5 w-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleSocialRegister('twitter')}
                  className="h-12"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </Button>
              </div>

              {/* Login Link */}
              <p className="mt-6 text-center text-sm text-muted-foreground">
                Zaten hesabınız var mı?{' '}
                <Link href="/giris" className="text-primary font-medium hover:underline">
                  Giriş Yapın
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
