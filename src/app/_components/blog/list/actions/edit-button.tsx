'use client';

import DocumentEdit24Regular from '@ricons/fluent/DocumentEdit24Regular';
import { UserPen } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

import type { PostItem } from '@/server/post/type';

import { Button } from '@/app/_components/shadcn/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/app/_components/shadcn/ui/tooltip';
import { cn } from '@/app/_components/shadcn/utils';
import { useUrlQuery } from '@/libs/url';

function EditBtn({ id, iconBtn }: { id: string; iconBtn?: boolean }) {
  const getUrlQuery = useUrlQuery();

  return (
    <Button
      asChild
      className={cn({
        'mr-3': !iconBtn,
        'btn-icon-transparent ': iconBtn,
      })}
      variant={iconBtn ? 'outline' : 'default'}
      size={iconBtn ? 'icon' : 'default'}
    >
      <Link href={`/blog/edit/${id}${getUrlQuery}`}>
        {iconBtn ? (
          <span className="xicon text-2xl" title="编辑文章">
            <DocumentEdit24Regular />
          </span>
        ) : (
          <UserPen />
        )}
        {!iconBtn && ' 编辑'}
      </Link>
    </Button>
  );
}

export default function PostEditButton({ item, iconBtn }: { item: PostItem; iconBtn?: boolean }) {
  return (
    <Suspense>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <EditBtn id={item.id} iconBtn={iconBtn} />
          </TooltipTrigger>
          <TooltipContent>
            <p>编辑文章</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </Suspense>
  );
}
