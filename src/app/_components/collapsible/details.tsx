'use client';

import type { MouseEventHandler, ReactNode } from 'react';

import clsx from 'clsx';
import React, { useCallback, useRef, useState } from 'react';
import { useMount } from 'react-use';

import $styles from './details.module.css';

export default function Details({
  defaultOpen = false,
  summary,
  children,
}: {
  defaultOpen?: boolean;
  summary: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const openDetails = useCallback((isInit = false) => {
    if (detailsRef.current && contentRef.current) {
      detailsRef.current.setAttribute('open', '');
      contentRef.current.style.maxHeight = `${contentRef.current.scrollHeight}px`;
      if (isInit) setOpen(true);
      else {
        contentRef.current.addEventListener(
          'transitionend',
          () => {
            setOpen(true);
          },
          { once: true },
        );
      }
    }
  }, []);

  const closeDetails = useCallback((isInit = false) => {
    if (detailsRef.current && contentRef.current) {
      contentRef.current.style.maxHeight = '0px';
      setOpen(false);
      if (isInit) detailsRef.current.removeAttribute('open');
      else {
        contentRef.current.addEventListener(
          'transitionend',
          () => {
            detailsRef.current?.removeAttribute('open');
          },
          { once: true },
        );
      }
    }
  }, []);

  const handleToggle: MouseEventHandler<HTMLElement> = useCallback(
    (e) => {
      e.preventDefault();
      open ? closeDetails() : openDetails();
    },
    [closeDetails, open, openDetails],
  );

  useMount(() => {
    open ? openDetails(true) : closeDetails(true);
    if (contentRef.current) contentRef.current.style.transition = 'max-height 0.3s ease-out';
  });

  return (
    <details className={$styles.details} ref={detailsRef}>
      <summary className="cursor-pointer" onClick={handleToggle}>
        {summary}
      </summary>
      <div ref={contentRef} className={clsx($styles.content)}>
        {children}
      </div>
    </details>
  );
}
