import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { HeroSection } from '@/components/home/hero-section';
import { FourCaliphs } from '@/components/home/four-caliphs';
import { TimelineEvents } from '@/components/home/timeline-events';
import { GenerationsSection } from '@/components/home/generations-section';
import { StartupNoticeModal } from '@/components/home/startup-notice-modal';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <StartupNoticeModal />
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FourCaliphs />
        <TimelineEvents />
        <GenerationsSection />
      </main>
      <Footer />
    </div>
  );
}
