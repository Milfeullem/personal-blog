import { isNil } from 'lodash';
import { Calendar, Tag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import type { PostItem } from '@/server/post/type';

import { postApi } from '@/api/post';
import { formatChineseTime } from '@/libs/time';

import type { IBlogBreadcrumbItem } from '../breadcrumb';

import { MdxRender } from '../../mdx/render';
import { cn } from '../../shadcn/utils';
import { BlogBreadCrumb } from '../breadcrumb';
import PostEditButton from '../list/actions/edit-button';
import { PostItemSkeleton } from '../skeleton';
import { getBreadcrumbsLinks } from '../utils';
import $styles from './style.module.css';

export async function PostItemIndex({ item }: { item: string }) {
  const result = await postApi.detail(item);

  if (!result.ok) {
    if (result.status === 404) {
      return notFound();
    }

    throw new Error((await result.json()).message);
  }

  const post: PostItem = (await result.json()) as PostItem;
  const breadcrumbs: IBlogBreadcrumbItem[] = [...getBreadcrumbsLinks(post.categories, 'post')];

  breadcrumbs.push({
    id: post.id,
    text: post.title,
  });

  return (
    <div className="page-item">
      <Suspense fallback={<PostItemSkeleton />}>
        <div className={cn($styles.breadcrumbs, 'page-container')}>
          <BlogBreadCrumb items={breadcrumbs} basePath="/blog" />
        </div>
        <div className={cn('page-container', $styles.item)}>
          <div className={$styles.thumb}>
            <Image src={post.thumb} alt={post.title} fill priority sizes="100%" unoptimized />
          </div>
          <div className={$styles.content}>
            <div className={$styles.body}>
              <MdxRender
                source={post.body}
                header={
                  <>
                    <header className={$styles.title}>
                      <h1 className="text-lg lg:text-3xl">{post.title}</h1>
                      <div className="mt-[0.125rem]">
                        <PostEditButton item={post} iconBtn />
                      </div>
                    </header>
                    <div className={$styles.meta}>
                      <div className={$styles.info}>
                        <span>
                          <Calendar className="mr-2" />
                          <time className="ellips mt-1">
                            {!isNil(post.updatedAt)
                              ? formatChineseTime(new Date(post.updatedAt))
                              : formatChineseTime(new Date(post.createdAt))}
                          </time>
                        </span>
                      </div>
                      {post.tags.length > 0 && (
                        <div className={$styles.tags}>
                          <span className="mr-2">
                            <Tag />
                          </span>
                          {post.tags.map((tag) => (
                            <Link key={tag.id} href={`/blog?tag=${tag.text}`}>
                              {tag.text}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                }
              />
            </div>
          </div>
        </div>
      </Suspense>
    </div>
  );
}
