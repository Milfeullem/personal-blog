import type { Metadata } from 'next';

import type { IPostMetadata } from '@/app/_components/blog/metadata';

import { PostItemIndex } from '@/app/_components/blog/item';
import { getPostItemMetadata } from '@/app/_components/blog/metadata';

export const generateMetadata = async (
  { params }: Omit<IPostMetadata, 'parent'>,
  parent: IPostMetadata['parent'],
): Promise<Metadata> => getPostItemMetadata({ params, parent });

export default async function PostItemPage({ params }: { params: Promise<{ item: string }> }) {
  const { item } = await params;

  return <PostItemIndex item={item} />;
}
