import type { CSSProperties } from 'react';

import { cn } from '../shadcn/utils';
import styles from './spinner.module.css';

export function Spinner({
  className,
  style,
  icon,
}: {
  className?: string;
  style?: CSSProperties;
  icon?: boolean;
}) {
  return (
    <div className={cn('h-full w-full flex items-center justify-center', className)} style={style}>
      {icon && <div className={styles.container}></div>}
    </div>
  );
}
