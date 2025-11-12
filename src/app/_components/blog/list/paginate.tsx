import { postApi } from '@/api/post';

import { SimplePaginate } from '../../paginate/simple';

export const PostListPaginate = async ({
  limit,
  page,
  tag,
}: {
  limit: number;
  page: number;
  tag?: string;
}) => {
  const result = await postApi.pageNumbers({ limit, tag });

  if (!result.ok) {
    return null;
  }

  const { result: totalPages } = await result.json();

  return (
    <div className="mb-5 w-full flex-none">
      <SimplePaginate totalPages={totalPages} currentPage={page} />
    </div>
  );
};
