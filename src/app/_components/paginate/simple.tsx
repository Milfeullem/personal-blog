'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useEffect } from 'react';

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '../shadcn/ui/pagination';
import { cn } from '../shadcn/utils';

function PaginationComp({ totalPages, currentPage }: { totalPages: number; currentPage: number }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const getPageUrl = useCallback(
    (value: number) => {
      const params = new URLSearchParams(searchParams);

      value <= 1 ? params.delete('page') : params.set('page', value.toString());

      return pathname + (params.size ? `?${params.toString()}` : '');
    },
    [searchParams],
  );

  useEffect(() => {
    // 在当前页面小于等于1时，删除URL中的页面查询参数
    const params = new URLSearchParams(searchParams);

    if (currentPage <= 1) params.delete('page');

    router.replace(pathname + (params.size ? `?${params.toString()}` : ''));
  }, [currentPage]);

  if (totalPages <= 1) {
    return null;
  }

  return (
    <Pagination className="justify-start">
      <PaginationContent className="w-full justify-between">
        <PaginationItem>
          <PaginationPrevious
            className={cn(
              'rounded-sm',
              currentPage <= 1
                ? 'bg-slate-50/70 shadow-gray-50  dark:bg-slate-800/70 dark:shadow-gray-800'
                : ' bg-white/90 hover:shadow-nylg hover:shadow-white dark:bg-black/90 dark:hover:shadow-black',
            )}
            href={getPageUrl(currentPage - 1)}
            disabled={currentPage <= 1}
            aria-label="访问上一页"
            text="上一页"
          />
        </PaginationItem>

        <PaginationItem>
          <PaginationNext
            className={cn(
              'rounded-sm',
              currentPage >= totalPages
                ? 'bg-slate-50/70 shadow-gray-50  dark:bg-slate-800/70 dark:shadow-gray-800'
                : ' bg-white/90 hover:shadow-nylg hover:shadow-white dark:bg-black/90 dark:hover:shadow-black',
            )}
            href={getPageUrl(currentPage + 1)}
            disabled={currentPage >= totalPages}
            aria-label="访问下一页"
            text="下一页"
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

export const SimplePaginate = ({
  totalPages,
  currentPage,
}: {
  totalPages: number;
  currentPage: number;
}) => (
  <Suspense>
    <PaginationComp totalPages={totalPages} currentPage={currentPage} />
  </Suspense>
);
