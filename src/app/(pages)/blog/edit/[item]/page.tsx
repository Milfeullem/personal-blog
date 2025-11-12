import type { Metadata, ResolvingMetadata } from 'next';

import { isNil } from 'lodash';
import { notFound, redirect } from 'next/navigation';

import { postApi } from '@/api/post';
import { PostPageForm } from '@/app/_components/blog/form';
import { cn } from '@/app/_components/shadcn/utils';
import { checkAccessToken } from '@/libs/token';

import $styles from '../../create/style.module.css';

export const dynamic = 'force-dynamic';

export async function generateMetadata(_: any, parent: ResolvingMetadata): Promise<Metadata> {
  return {
    title: `编辑文章 - ${(await parent)?.title?.absolute}`,
    description: '文章编辑页面',
  };
}

export default async function PostEditPage({ params }: { params: Promise<{ item: string }> }) {
  const auth = await checkAccessToken();

  if (isNil(auth)) {
    return redirect('/auth/login');
  }

  const { item } = await params;
  const result = await postApi.detailById(item);

  if (!result.ok) {
    if (result.status === 404) {
      return notFound();
    }
    throw new Error((await result.json()).message);
  }
  const post = (await result.json()) as any;

  if (!post) {
    return notFound();
  }

  return (
    <div className="page-item">
      <div className={cn($styles.item, 'page-container')}>
        <PostPageForm post={post} />
      </div>
    </div>
  );
}
