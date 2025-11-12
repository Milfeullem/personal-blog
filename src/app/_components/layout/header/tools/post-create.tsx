'use client';

import { Plus } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

import { Button as CNButton } from '@/app/_components/shadcn/ui/button';
import { cn } from '@/app/_components/shadcn/utils';
import { useUrlQuery } from '@/libs/url';

export function Button({ iconBtn = false }: { iconBtn?: boolean }) {
  const getUrlQuery = useUrlQuery();

  return (
    <CNButton
      asChild
      className={cn('ml-auto', {
        'focus-visible:!ring-0': !iconBtn,
        'rounded-sm': !iconBtn,
      })}
      variant="secondary"
      size={iconBtn ? 'icon' : 'default'}
    >
      <Link href={`/blog/create${getUrlQuery}`}>
        <Plus />
        {!iconBtn && '创建'}
      </Link>
    </CNButton>
  );
}

export function PostCreateButton({ iconBtn = false }: { iconBtn?: boolean }) {
  return (
    <Suspense>
      <Button iconBtn={iconBtn} />
    </Suspense>
  );
}
