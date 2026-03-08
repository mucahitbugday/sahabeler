'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const NOTICE_KEY = 'startup_notice_acknowledged_v1';

export function StartupNoticeModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const acknowledged = window.localStorage.getItem(NOTICE_KEY) === 'true';
    if (!acknowledged) {
      setOpen(true);
    }
  }, []);

  const handleAcknowledge = () => {
    window.localStorage.setItem(NOTICE_KEY, 'true');
    setOpen(false);
  };

  return (
    <Dialog open={open}>
      <DialogContent
        showCloseButton={false}
        onEscapeKeyDown={(event) => event.preventDefault()}
        onInteractOutside={(event) => event.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Önemli Bilgilendirme</DialogTitle>
          <DialogDescription>
            Bu site yeni kurulmuştur ve içerikler geliştirme aşamasındadır. Yer alan bazı bilgiler henüz
            kesin/doğrulanmış nihai içerik niteliğinde olmayabilir.
          </DialogDescription>
        </DialogHeader>

        <div className="text-sm text-muted-foreground space-y-3">
          <p>
            İçerikleri kullanırken lütfen bunu dikkate alınız. Site çok yakında aktif kullanıma açılacak ve
            içerikler düzenli olarak gözden geçirilip güncellenecektir.
          </p>
          <p>
            Devam edebilmek için bu bilgilendirmeyi okuduğunuzu ve anladığınızı onaylamanız gerekir.
          </p>
        </div>

        <DialogFooter>
          <Button className="w-full" onClick={handleAcknowledge}>
            Okudum, anladım
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
