import type { ReactNode } from 'react';

import { cn } from '../../shadcn/utils';
import $styles from './style.module.css';

export function HomeContainer({
  children,
  className,
  containerClass,
}: {
  children: ReactNode;
  className?: string;
  containerClass?: string;
}) {
  return (
    <div className={cn($styles.container, containerClass)}>
      <div className={cn('page-container', $styles.main, className)}>{children}</div>
    </div>
  );
}

export function HomeBlock({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn($styles.block, className)}>{children}</div>;
}
