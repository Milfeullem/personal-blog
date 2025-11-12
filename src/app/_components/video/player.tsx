'use client';

import type { Option } from 'artplayer';

import Artplayer from 'artplayer';
import { isNil } from 'lodash';
import { useEffect, useRef } from 'react';

import { cn } from '../shadcn/utils';
import $styles from './player.module.css';

export function Player({
  option,
  getInstance,
  className,
  ...rest
}: {
  option: Omit<Option, 'container'>;
  getInstance?: any;
  className?: string;
}) {
  const artRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let art: Artplayer;
    if (!isNil(artRef.current)) {
      art = new Artplayer({
        fullscreen: true,
        fullscreenWeb: true,
        playsInline: true,
        fastForward: true,
        airplay: true,
        autoplay: false,
        autoSize: true,
        // isLive: true,
        // loop: true,
        // autoPlayback: true,
        // muted: true,
        ...option,
        container: artRef.current!,
      });
      art.on('ready', () => {
        art.autoSize();
        art.autoHeight();
      });
      art.on('resize', () => {
        art.autoSize();
        art.autoHeight();
      });
      art.on('video:ended', () => {
        art.currentTime = 0;

        if (!isNil(option.poster)) {
          art.poster = option.poster;
        }

        const posterEl = artRef.current?.getElementsByClassName(
          'art-poster',
        ) as HTMLCollectionOf<HTMLElement>;

        if (posterEl && posterEl.length > 0) {
          posterEl[0].style.display = 'block';
        }
      });

      if (getInstance && typeof getInstance === 'function') {
        getInstance(art);
      }
    }

    return () => {
      if (art && art.destroy) {
        art.destroy(false);
      }
    };
  }, [getInstance, option.poster]);

  return <div className={cn($styles.container, className)} ref={artRef} {...rest} />;
}
