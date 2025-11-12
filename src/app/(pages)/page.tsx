import type { Metadata, ResolvingMetadata } from 'next';

import { Home } from '../_components/home';

export async function generateMetadata(
  _metadata: Record<string, any>,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return {
    title: `首页 | ${(await parent).title?.absolute}`,
  };
}

export default function HomePage() {
  return <Home />;
}
