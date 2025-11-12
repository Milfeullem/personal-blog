import type { MouseEventHandler } from 'react';

import Link from 'next/link';
import { useCallback } from 'react';

export interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  const resetPage = useCallback<MouseEventHandler<HTMLAnchorElement>>(
    (e) => {
      e.preventDefault();
      reset();
    },
    [reset],
  );

  return (
    <div className="page-item">
      <div className="page-container page-blank flex-col space-y-4 px-4">
        <h2>糟糕!服务器挂了...</h2>
        <p>
          错误信息: {error.message} |
          <b className="ml-3">
            <Link className="animate-decoration" passHref href="#" onClick={resetPage}>
              点此重试
            </Link>
          </b>
        </p>
        <small className="px-3">
          如果是你自己的网络问题,修复后可.如果不是,请尽快联系管理员处理,十分感谢！
        </small>
      </div>
    </div>
  );
}
