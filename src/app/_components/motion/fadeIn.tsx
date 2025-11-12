'use client';

import type { MotionProps } from 'motion/react';
import type { CSSProperties, ReactNode } from 'react';

import { isNil } from 'lodash';
import { motion, useInView } from 'motion/react';
import { useMemo, useRef, useState } from 'react';

import { cn } from '../shadcn/utils';

interface BaseProps {
  className?: string;
  viewTriggerOffset?: boolean;
  noBlur?: boolean;
  delay?: number;
  style?: CSSProperties;
  side?:
    | 'left'
    | 'right'
    | 'top'
    | 'bottom'
    | 'top-left'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-right'
    | 'none';
}

export interface FadeInMotionProps extends BaseProps {
  otherProps?: (props: BaseProps, inited?: boolean) => MotionProps;
}

const offsetSide = {
  left: { x: -24, y: 0 },
  right: { x: 24, y: 0 },
  top: { x: 0, y: -24 },
  bottom: { x: 0, y: 24 },
  'top-left': { x: -24, y: -24 },
  'top-right': { x: 24, y: -24 },
  'bottom-left': { x: -24, y: 24 },
  'bottom-right': { x: 24, y: 24 },
  none: { x: 0, y: 0 },
};

export function FadeInMotion(props: FadeInMotionProps & { children: ReactNode }) {
  const {
    className,
    style,
    viewTriggerOffset,
    side = 'bottom-left',
    noBlur,
    children,
    delay,
    otherProps,
  } = props;
  const [inited, setIsInited] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, {
    once: true,
    margin: viewTriggerOffset ? '-128px' : '0px',
  });
  const offest = useMemo<{ x: number; y: number }>(() => {
    return offsetSide[side] || offsetSide.none;
  }, [side]);

  const fadeUpVariants: MotionProps['variants'] = {
    initial: {
      opacity: 0,
      ...offest,
      filter: noBlur ? 'blur(0px)' : 'blur(10px)',
    },
    animate: {
      opacity: 1,
      x: 0,
      y: 0,
      filter: 'blur(0px)',
    },
  };

  const rest = useMemo(() => {
    if (!isNil(otherProps)) {
      const { otherProps: _, ...rest } = props;

      return otherProps(rest, inited);
    }
    return {};
  }, [otherProps, inited]);

  return (
    <motion.div
      ref={ref}
      animate={inView ? 'animate' : 'initial'}
      variants={fadeUpVariants}
      className={cn(className)}
      style={style ?? {}}
      initial={false}
      onAnimationComplete={() => setIsInited(true)}
      transition={{
        duration: 1,
        delay: delay || 0,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
