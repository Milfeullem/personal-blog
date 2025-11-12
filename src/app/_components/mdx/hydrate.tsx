'use client';

import './styles/index.css';

import type { HydrateProps } from 'next-mdx-remote-client';
import type { JSX } from 'react';

import { isNil } from 'lodash';
import { hydrate } from 'next-mdx-remote-client';
import { useMemo, useRef, useState } from 'react';
import { useDeepCompareEffect, useMount } from 'react-use';

import { useIsMobile, useIsTablet } from '@/libs/broswer';
import { deepMerge } from '@/libs/utils';

import type { MdxHydrateProps } from './types';

import { PostContentSkeleton } from '../post/skeleton';
import { Toc } from './components/toc';
import { useCodeWindow } from './hooks/code-window';
import $styles from './hydrate.module.css';
import { defaultMdxHydrateOptions } from './options/hydrate';

export function MdxHydrate({ serialized, header, toc = true, ...rest }: MdxHydrateProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  const mobile = useIsMobile();
  const tablet = useIsTablet();
  const isMobile = useMemo(() => mobile || tablet, [mobile, tablet]);
  const [content, setContent] = useState<JSX.Element | null>(null);
  const options = useMemo(() => {
    return deepMerge(defaultMdxHydrateOptions, rest, 'merge');
  }, [rest]);
  const isInValidSerialized = isNil(serialized) || 'error' in serialized;

  useMount(() => {
    // 确保页面完全加载
    if (typeof window !== 'undefined') {
      // 获取当前URL的hash
      const hash = decodeURIComponent(window.location.hash);
      if (hash) {
        // 延迟执行以确保DOM已完全渲染
        setTimeout(() => {
          const element = document.querySelector(hash);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    }
  });

  useCodeWindow(contentRef, content);

  useDeepCompareEffect(() => {
    if (isInValidSerialized) {
      return;
    }
    const { content, error } = hydrate({ ...serialized, ...options } as HydrateProps);

    if (!error && !isNil(content)) {
      setContent(content);
    }
  }, [isInValidSerialized, serialized, options]);

  if (isInValidSerialized) {
    return null;
  }

  if (isNil(content)) {
    return <PostContentSkeleton />;
  }

  return (
    <div className={$styles.container}>
      <div ref={contentRef} className={$styles.article}>
        {header}
        {content}
      </div>
      {toc && <Toc serialized={serialized} isMobile={isMobile} />}
    </div>
  );
}
