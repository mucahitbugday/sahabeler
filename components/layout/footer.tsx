import Link from 'next/link';
import { Facebook, Twitter, Instagram, Mail, Youtube, BookOpen, Users, Calendar, Info } from 'lucide-react';

const footerSections = [
  {
    title: 'Keşfet',
    icon: BookOpen,
    links: [
      { label: 'Sahabeler', href: '/sahabeler' },
      { label: 'Dört Halife', href: '/sahabeler?filter=dort-halife' },
      { label: 'Aşere-i Mübeşşere', href: '/sahabeler?filter=asere-i-mubesere' },
      { label: 'Ehli Beyt', href: '/sahabeler?filter=ehli-beyt' },
    ],
  },
  {
    title: 'Tarih',
    icon: Calendar,
    links: [
      { label: 'Tarihi Olaylar', href: '/olaylar' },
      { label: 'Savaşlar', href: '/olaylar?category=savaslar' },
      { label: 'Önemli Günler', href: '/olaylar?category=onemli-gunler' },
      { label: 'Kronoloji', href: '/olaylar/kronoloji' },
    ],
  },
  {
    title: 'Nesiller',
    icon: Users,
    links: [
      { label: 'Sahabeler', href: '/nesiller/sahabeler' },
      { label: 'Tabiin', href: '/nesiller/tabiin' },
      { label: 'Tebe-i Tabiin', href: '/nesiller/tebe-i-tabiin' },
    ],
  },
  {
    title: 'Hakkımızda',
    icon: Info,
    links: [
      { label: 'Biz Kimiz', href: '/hakkimizda' },
      { label: 'Misyonumuz', href: '/hakkimizda#misyon' },
      { label: 'Kaynaklar', href: '/kaynaklar' },
      { label: 'İletişim', href: '/iletisim' },
    ],
  },
];

const socialLinks = [
  { icon: Facebook, href: 'https://facebook.com', label: 'Facebook', color: 'hover:bg-blue-600' },
  { icon: Twitter, href: 'https://twitter.com', label: 'Twitter', color: 'hover:bg-sky-500' },
  { icon: Instagram, href: 'https://instagram.com', label: 'Instagram', color: 'hover:bg-pink-600' },
  { icon: Youtube, href: 'https://youtube.com', label: 'Youtube', color: 'hover:bg-red-600' },
  { icon: Mail, href: 'mailto:info@sahabeler.net', label: 'Email', color: 'hover:bg-primary' },
];

export function Footer() {
  return (
    <footer className="bg-gradient-to-b from-secondary/30 to-secondary/60 border-t border-border">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 mb-4 lg:mb-0">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <div className="relative h-10 w-10">
                <svg viewBox="0 0 40 40" className="h-10 w-10" fill="none">
                  <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1.5" className="text-primary" />
                  <circle cx="20" cy="20" r="14" stroke="currentColor" strokeWidth="1" className="text-primary/50" />
                  <path
                    d="M20 6 L22 12 L28 12 L23 16 L25 22 L20 18 L15 22 L17 16 L12 12 L18 12 Z"
                    fill="currentColor"
                    className="text-primary"
                  />
                  <circle cx="20" cy="32" r="1.5" fill="currentColor" className="text-accent" />
                  <circle cx="8" cy="20" r="1.5" fill="currentColor" className="text-accent" />
                  <circle cx="32" cy="20" r="1.5" fill="currentColor" className="text-accent" />
                </svg>
              </div>
              <span className="text-xl font-semibold text-primary">sahabeler.net</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Sahabelerin hayatını ve İslam tarihini keşfedin. Güvenilir kaynaklardan derlenen bilgilerle, İslam&apos;ın ilk nesillerini tanıyın.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex h-10 w-10 items-center justify-center rounded-full bg-foreground/5 text-foreground/60 transition-all hover:text-white ${social.color}`}
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <div className="flex items-center gap-2 mb-4">
                <section.icon className="h-4 w-4 text-primary" />
                <h3 className="font-semibold text-foreground">{section.title}</h3>
              </div>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border/50 bg-secondary/40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>
              &copy; {new Date().getFullYear()} <span className="font-semibold text-foreground">sahabeler.net</span> | Tüm Hakları Saklıdır.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/gizlilik" className="hover:text-primary transition-colors">
                Gizlilik Politikası
              </Link>
              <span className="text-border">|</span>
              <Link href="/kullanim-sartlari" className="hover:text-primary transition-colors">
                Kullanım Şartları
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
