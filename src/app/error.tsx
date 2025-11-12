'use client';

import type { ErrorBoundaryProps } from './_components/error';

import $styles from './(pages)/layout.module.css';
import { ErrorBoundary } from './_components/error';
import { Header } from './_components/layout/header';
import Theme from './_components/theme';

export default function AppError(props: ErrorBoundaryProps) {
  return (
    <Theme>
      <div className={$styles.layout}>
        <Header />
        <ErrorBoundary {...props} />
      </div>
    </Theme>
  );
}
