import type { IBlogMetadata } from '@/app/_components/blog/metadata';
import type { IPaginateQueryProps } from '@/app/_components/paginate/types';

import { BlogIndex } from '@/app/_components/blog/list';
import { getBlogMetadata } from '@/app/_components/blog/metadata';

export async function generateMetadata(
  metadata: Omit<IBlogMetadata, 'parent'>,
  parent: IBlogMetadata['parent'],
) {
  return getBlogMetadata({ ...metadata, parent });
}

export default async function BlogIndexPage({
  searchParams,
  params,
}: {
  searchParams: Promise<IPaginateQueryProps & { tag?: string }>;
  params: Promise<{ categories?: string[] }>;
}) {
  const { categories } = await params;
  const rest = { ...(await searchParams), categories };

  return <BlogIndex {...rest} />;
}
