import type { ReactNode } from 'react';

import { ShineBorder } from '../../magicui/shine-border';
import { Card } from '../../shadcn/ui/card';
import { cn } from '../../shadcn/utils';

export function ShineCard({
  children,
  className,
  always,
  borderRadius = '0.25rem',
}: {
  always?: boolean;
  className?: string;
  borderRadius?: string;
  children: ReactNode;
}) {
  return (
    <Card
      className={cn(
        'bg-card/40 backdrop-blur-sm py-0 border-0',
        `rounded-[${borderRadius}]!`,
        className,
      )}
    >
      <ShineBorder
        className="h-full w-full"
        color={['#A07CFE', '#FE8FB5', '#FFBE7B']}
        always={always}
        borderRadius={borderRadius}
      >
        {children}
      </ShineBorder>
    </Card>
  );
}
