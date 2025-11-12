'use client';

import clsx from 'clsx';
import { trim } from 'lodash';
import glob from 'micromatch';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import type { PageModalProps } from './types';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../shadcn/ui/dialog';
import $styles from './page-modal.module.css';

export default function PageModal({ children, title, match, className }: PageModalProps) {
  const [show, setShow] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const close = useCallback(() => {
    router.back();
  }, [router]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
    setShow(
      glob.isMatch(
        trim(pathname, '/'),
        match.map((m) => trim(m, '/')),
      ),
    );
  }, [pathname, match]);

  return show ? (
    <Dialog open defaultOpen onOpenChange={close}>
      <DialogContent
        className={clsx('sm:max-w-[80%]', className)}
        onEscapeKeyDown={(event) => event.preventDefault()}
        onInteractOutside={(event) => event.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <div className={$styles.modalContent}>{children}</div>
      </DialogContent>
    </Dialog>
  ) : null;
}
