import type { TagItem } from '@/server/tag/type';

import { cn } from '@/app/_components/shadcn/utils';

import { TagLink } from '../../../form/tag/tag-link';
import $styles from './list.module.css';

export function TagListComponent({ items, actived }: { items: TagItem[]; actived?: string }) {
  return (
    <div className={$styles.container}>
      {items.map((tagItem) => (
        <TagLink
          key={tagItem.id}
          tag={tagItem}
          className={cn({
            [$styles.tagActived]: actived === tagItem.id,
          })}
        />
      ))}
    </div>
  );
}
