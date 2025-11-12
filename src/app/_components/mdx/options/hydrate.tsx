import type { MdxHydrateOptions } from '../types';

import { cn } from '../../shadcn/utils';
import { Admonition } from '../components/admonition';
import $styles from '../hydrate.module.css';

export const defaultMdxHydrateOptions: MdxHydrateOptions = {
  components: {
    wrapper: ({ children }) => {
      return <div className={cn('mdx-preview', $styles.content)}>{children}</div>;
    },
    Admonition,
  },
};
