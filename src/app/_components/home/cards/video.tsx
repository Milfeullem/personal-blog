'use client';

import { Play } from 'lucide-react';
import { useCallback, useState } from 'react';

import { VideoModal } from '../../modal/video';
import { cn } from '../../shadcn/utils';
import { StackCard } from './stack';
import $styles from './video.module.css';

export interface HomeVideoCardType {
  image: string;
  video: string;
}

export function HomeVideoCard({ image, video }: HomeVideoCardType) {
  const [open, setOpen] = useState(false);
  const openModal = useCallback(() => setOpen(true), []);

  return (
    <>
      <StackCard shine={{ open: true, always: true }} className="h-auto">
        <div className={cn(`relative flex h-80 w-full items-center justify-center`)}>
          <div
            className={$styles.main}
            style={{
              backgroundImage: image,
            }}
          >
            <button onClick={openModal} type="button" className={$styles.openBtn}>
              <Play className="size-8! text-white" />
            </button>
          </div>
        </div>
      </StackCard>
      <VideoModal video={{ url: video }} open={open} setOpen={setOpen} />
    </>
  );
}
