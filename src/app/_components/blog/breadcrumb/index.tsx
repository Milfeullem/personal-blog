import { Home, Slash, Tag } from 'lucide-react';
import Link from 'next/link';
import { Fragment } from 'react';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '../../shadcn/ui/breadcrumb';
import { cn } from '../../shadcn/utils';
import $styles from './style.module.css';
export interface IBlogBreadcrumbItem {
  id: string;
  link?: string;
  text: string;
}

export function BlogBreadCrumb({
  items,
  className,
  tag,
  basePath = '',
}: {
  className?: string;
  items?: IBlogBreadcrumbItem[];
  tag?: string;
  basePath?: string;
}) {
  return (
    <Breadcrumb className={cn($styles.breadcrumb, className)}>
      <BreadcrumbList className="gap-0.5 sm:gap-1">
        <BreadcrumbItem>
          <BreadcrumbLink asChild className="flex items-center text-xs">
            <Link href="/">
              <span className="xicon mr-1">
                <Home />
              </span>
              首页
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {(items ?? []).map((item) => (
          <Fragment key={item.id}>
            <BreadcrumbSeparator className="[&>svg]:h-2 [&>svg]:w-2">
              <Slash />
            </BreadcrumbSeparator>
            <BreadcrumbItem className="flex items-center text-xs">
              {item.link ? (
                <BreadcrumbLink asChild>
                  <Link href={`${basePath}${item.link}`} passHref>
                    {item.text}
                  </Link>
                </BreadcrumbLink>
              ) : (
                <span className="text-foreground">{item.text}</span>
              )}
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
      {tag && (
        <div className="flex h-full items-center">
          <Tag className="h-3! w-3!" />
          <span className="ml-2">{tag}</span>
        </div>
      )}
    </Breadcrumb>
  );
}
