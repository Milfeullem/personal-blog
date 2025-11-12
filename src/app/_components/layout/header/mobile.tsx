import type { KeyboardEventHandler, MouseEventHandler } from 'react';

import { X } from 'lucide-react';
import { useCallback } from 'react';
import { createPortal } from 'react-dom';

import { Button } from '../../shadcn/ui/button';
import { cn } from '../../shadcn/utils';
import { HeaderLogo } from './logo';
import $styles from './mobile.module.css';
import { MobileNav } from './nav';

export function Modal({
  close,
  open,
}: {
  close: MouseEventHandler<HTMLDivElement>;
  open: boolean;
}) {
  const noAction = useCallback<KeyboardEventHandler<HTMLDivElement>>((e) => {
    e.preventDefault();
  }, []);

  return (
    <div
      className={cn($styles.modal, { [$styles.open]: open })}
      role="button"
      tabIndex={0}
      onClick={close}
      onKeyDown={noAction}
    ></div>
  );
}

export function MobileHeader({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
}) {
  const close = useCallback<MouseEventHandler<HTMLDivElement | HTMLButtonElement>>(
    (e) => {
      e.preventDefault();
      setOpen(false);
    },
    [setOpen],
  );

  return (
    <>
      <div className={cn($styles.side, { [$styles.open]: open })}>
        <div className={$styles.top}>
          <HeaderLogo />
          <Button
            variant="outline"
            size="icon"
            className={cn('btn-icon-transparent')}
            onClick={close}
          >
            <X />
          </Button>
        </div>
        <div className={$styles.content}>
          <MobileNav />
        </div>
      </div>
      {createPortal(<Modal close={close} open={open} />, document.body)}
    </>
  );
}
