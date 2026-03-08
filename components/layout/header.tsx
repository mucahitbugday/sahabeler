'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, User, LogOut, Settings, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/search/search-input';
import { useAuth } from '@/contexts/auth-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const navLinks = [
  { href: '/sahabeler', label: 'Sahabeler' },
  { href: '/olaylar', label: 'Olaylar' },
  { href: '/nesiller', label: 'Nesiller' },
  { href: '/hakkimizda', label: 'Hakkında' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="flex items-center">
            <div className="relative h-10 w-10">
              <svg viewBox="0 0 40 40" className="h-10 w-10" fill="none">
                {/* Outer circle with Islamic geometric pattern */}
                <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1.5" className="text-primary" />
                <circle cx="20" cy="20" r="14" stroke="currentColor" strokeWidth="1" className="text-primary/50" />
                {/* Central crescent and star inspired design */}
                <path
                  d="M20 6 L22 12 L28 12 L23 16 L25 22 L20 18 L15 22 L17 16 L12 12 L18 12 Z"
                  fill="currentColor"
                  className="text-accent"
                />
                {/* Decorative dots */}
                <circle cx="20" cy="32" r="1.5" fill="currentColor" className="text-accent" />
                <circle cx="8" cy="20" r="1.5" fill="currentColor" className="text-accent" />
                <circle cx="32" cy="20" r="1.5" fill="currentColor" className="text-accent" />
              </svg>
            </div>
            <span className="ml-2 font-serif text-3xl font-semibold text-primary tracking-tight">sahabeler.net</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-2 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-2 text-sm font-medium text-foreground/75 transition-colors hover:text-primary rounded-md hover:bg-primary/5"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Search - Desktop */}
        {/* <div className="hidden md:block flex-1 max-w-xs">
          <SearchInput variant="header" placeholder="Ara..." />
        </div> */}

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-2">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 px-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <span className="max-w-24 truncate text-sm">{user?.name}</span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/profil" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Profilim
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profil/ayarlar" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Ayarlar
                  </Link>
                </DropdownMenuItem>
                {(user?.role === 'admin' || user?.role === 'moderator' || user?.role === 'editor') && (
                  <>
                    <DropdownMenuSeparator />
                    {user?.role === 'admin' && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="cursor-pointer text-primary">
                          <Settings className="mr-2 h-4 w-4" />
                          Admin Panel
                        </Link>
                      </DropdownMenuItem>
                    )}
                    {user?.role === 'admin' && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin/ayarlar" className="cursor-pointer text-primary">
                          <Settings className="mr-2 h-4 w-4" />
                          Site Ayarları
                        </Link>
                      </DropdownMenuItem>
                    )}
                    {(user?.role === 'admin' || user?.role === 'editor') && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin/editor" className="cursor-pointer text-blue-600">
                          <Settings className="mr-2 h-4 w-4" />
                          İçerik Yönetimi
                        </Link>
                      </DropdownMenuItem>
                    )}
                    {(user?.role === 'admin' || user?.role === 'moderator') && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin/moderasyon" className="cursor-pointer text-orange-600">
                          <Settings className="mr-2 h-4 w-4" />
                          Moderasyon
                        </Link>
                      </DropdownMenuItem>
                    )}
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-destructive cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Cikis Yap
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" asChild className="text-foreground/70">
                <Link href="/giris">Giris Yap</Link>
              </Button>
              <Button asChild className="h-10 rounded-md bg-primary px-6 text-primary-foreground hover:bg-primary/90">
                <Link href="/kayit">Kayit Ol</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6 text-foreground" />
          ) : (
            <Menu className="h-6 w-6 text-foreground" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-border bg-background lg:hidden">
          <div className="container mx-auto px-4 py-4 space-y-4">
            {/* Mobile Search */}
            <SearchInput variant="header" placeholder="Ara..." />
            
            {/* Mobile Nav Links */}
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-3 text-sm font-medium text-foreground/80 transition-colors hover:text-primary hover:bg-primary/5 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            
            {/* Mobile Auth */}
            <div className="flex flex-col gap-2 pt-2 border-t border-border">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/profil"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                  </Link>
                  {(user?.role === 'admin' || user?.role === 'moderator' || user?.role === 'editor') && (
                    <div className="space-y-1 pb-2 border-b border-border mb-2">
                      {user?.role === 'admin' && (
                        <Link
                          href="/admin"
                          className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg hover:bg-primary/5 text-primary"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Settings className="h-4 w-4" />
                          Admin Panel
                        </Link>
                      )}
                      {user?.role === 'admin' && (
                        <Link
                          href="/admin/ayarlar"
                          className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg hover:bg-primary/5 text-primary"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Settings className="h-4 w-4" />
                          Site Ayarları
                        </Link>
                      )}
                      {(user?.role === 'admin' || user?.role === 'editor') && (
                        <Link
                          href="/admin/editor"
                          className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg hover:bg-primary/5 text-blue-600"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Settings className="h-4 w-4" />
                          İçerik Yönetimi
                        </Link>
                      )}
                      {(user?.role === 'admin' || user?.role === 'moderator') && (
                        <Link
                          href="/admin/moderasyon"
                          className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg hover:bg-primary/5 text-orange-600"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Settings className="h-4 w-4" />
                          Moderasyon
                        </Link>
                      )}
                    </div>
                  )}
                  <Button variant="outline" onClick={logout} className="w-full justify-start gap-2">
                    <LogOut className="h-4 w-4" />
                    Cikis Yap
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/giris">Giris Yap</Link>
                  </Button>
                  <Button asChild className="w-full bg-primary text-primary-foreground">
                    <Link href="/kayit">Kayit Ol</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
