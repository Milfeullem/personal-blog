'use client';

import type { PostItem } from '@/server/post/type';

import { useAuth } from '@/app/_components/auth/hooks';

import { cn } from '../../../shadcn/utils';
import PostDelete from './delete';
import PostEditButton from './edit-button';

export function Buttons({ item, className }: { item: PostItem; className?: string }) {
  return (
    <div className={cn('flex items-center [&>time]:ml-2', className)}>
      <PostEditButton item={item} />
      <PostDelete item={item} />
    </div>
  );
}

export function PostActions({ item, className }: { item: PostItem; className?: string }) {
  const auth = useAuth();

  return auth && <Buttons item={item} className={className} />;
}
