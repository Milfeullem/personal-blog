'use server';

import type { Compatible } from 'vfile';

import { serialize } from 'next-mdx-remote-client/serialize';

import { deepMerge } from '@/libs/utils';

import type { MdxSerializeOption } from './types';

import { defaultMdxSerializeOptions } from './options/serialize';

export async function serializeMdx(source: Compatible, options: MdxSerializeOption = {}) {
  const result = await serialize({
    source,
    ...deepMerge(defaultMdxSerializeOptions, options, 'merge'),
  });

  return result;
}
