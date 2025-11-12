'use client';

import type { ErrorBoundaryProps } from '../_components/error';

import { ErrorBoundary } from '../_components/error';

export default function ErrorPage(props: ErrorBoundaryProps) {
  return <ErrorBoundary {...props} />;
}
