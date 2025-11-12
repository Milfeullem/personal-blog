import { Box } from 'lucide-react';

import type { CategoryItem } from '@/server/category/types';

import { categoryApi } from '@/api/category';

import { SidebarWidget } from '../widget';
import { CategoryTreeComponent } from './tree';

export async function CategoryTreeWidget({ actives }: { actives?: false | CategoryItem[] }) {
  const result = await categoryApi.tree();

  if (!result.ok) {
    throw new Error((await result.json()).message);
  }

  const categories = await result.json();
  const activeIds = (actives || []).map((item) => item.id);

  return (
    <SidebarWidget
      title={
        <>
          <Box />
          <span>分类</span>
        </>
      }
    >
      <CategoryTreeComponent categories={categories} actives={activeIds} />
    </SidebarWidget>
  );
}
