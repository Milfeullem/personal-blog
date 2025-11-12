import type { Metadata, ResolvingMetadata } from 'next';

import { PostPageForm } from '@/app/_components/blog/form';
import { cn } from '@/app/_components/shadcn/utils';

import $styles from './style.module.css';

export const dynamic = 'force-dynamic';

export async function generateMetadata(_: any, parent: ResolvingMetadata): Promise<Metadata> {
  return {
    title: `创建文章 - ${(await parent)?.title?.absolute}`,
    description: '文章创建页面',
  };
}

export default async function PostCreatePage() {
  return (
    <div className="page-item">
      <div className={cn($styles.item, 'page-container')}>
        <PostPageForm />
      </div>
    </div>
  );
}
