import type { CategoryItem } from '@/server/category/types';

import { CategoryTreeWidget } from './category-tree';
import $styles from './style.module.css';
import { TagListWidget } from './tag-list';

export function Sidebar({
  activedCategories,
  activedTag,
}: {
  activedCategories: false | CategoryItem[];
  activedTag?: string;
}) {
  return (
    <div className={$styles.sidebar}>
      <div className="space-y-4">
        <CategoryTreeWidget actives={activedCategories} />
        <TagListWidget actived={activedTag} />
      </div>
    </div>
  );
}
