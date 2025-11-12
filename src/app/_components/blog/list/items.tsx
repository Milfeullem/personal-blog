import { isNil } from 'lodash';
import { Book, Calendar, Tag } from 'lucide-react';
import Link from 'next/link';

import type { PostItem } from '@/server/post/type';

import { formatTime } from '@/libs/dayjsUtil';
import { randomIntFrom } from '@/libs/random';

import { cn } from '../../shadcn/utils';
import { TagLink } from '../form/tag';
import { getBreadcrumbsLinks } from '../utils';
import { PostActions } from './actions';
import BlogIcons from './actions/blog-icons.png';
import { PostListItemMotion } from './item-motion';
import $styles from './style.module.css';

export function PostList({ items, activeTag }: { items: PostItem[]; activeTag?: string }) {
  return (
    <div className={cn($styles.list)}>
      {items.map((item) => (
        <PostListItemMotion key={item.id}>
          <div className={cn($styles.content, 'page-block hover:page-block-hover')}>
            <Link
              href={`/blog/posts/${item.slug || item.id}`}
              className="absolute inset-0 z-[1]"
            ></Link>
            <header className={$styles.header}>
              <div
                className={$styles.icon}
                style={{
                  backgroundImage: `url(${BlogIcons.src})`,
                  backgroundPositionY: `${randomIntFrom(0, 6) * -40}px`,
                }}
              />
              <div className={cn($styles.headerRight, 'relative z-[2]')}>
                <Link href={`/blog/posts/${item.slug || item.id}`} className={$styles.title}>
                  <h2 className="ellips animate-decoration animate-decoration-lg">{item.title}</h2>
                </Link>
                {item.categories.length > 0 && (
                  <div className={$styles.categories}>
                    <span className="xicon mr-2 text-lg">
                      <Book />
                    </span>
                    {getBreadcrumbsLinks(item.categories, 'post').map((category) => (
                      <Link
                        key={category.id}
                        href={category.link!}
                        className="ellips animate-decoration animate-decoration-sm"
                      >
                        #{category.text}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </header>

            {!isNil(item.summary) && <div className={$styles.summary}>{item.summary}</div>}
            <div className={$styles.footer}>
              <div className={$styles.meta}>
                {item.tags.length > 0 && (
                  <div className={cn($styles.tags, 'relative z-[2]')}>
                    <span className="mr-2">
                      <Tag />
                    </span>
                    {item.tags.map((tagItem) => (
                      <TagLink
                        key={tagItem.id}
                        tag={tagItem}
                        className={cn({
                          [$styles.tagActived]: activeTag === tagItem.text,
                        })}
                      />
                    ))}
                  </div>
                )}
                <div className={$styles.info}>
                  <span>
                    <Calendar className="mr-2" />
                    <time className="ellips">
                      {formatTime(!isNil(item.updatedAt) ? item.updatedAt : item.createdAt)}
                    </time>
                  </span>
                </div>
              </div>
              <PostActions item={item} className="relative z-[2]" />
            </div>
          </div>
        </PostListItemMotion>
      ))}
    </div>
  );
}
