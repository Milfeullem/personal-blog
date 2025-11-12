import type { MdxRenderProps } from './types';

import { MdxHydrate } from './hydrate';
import { serializeMdx } from './utils';

export async function MdxRender(props: MdxRenderProps) {
  const { source, options, hydrate, header } = props;
  const result = await serializeMdx(source, options ?? {});

  return <MdxHydrate {...(hydrate ?? {})} serialized={result} header={header} />;
}
