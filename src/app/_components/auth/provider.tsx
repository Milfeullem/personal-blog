'use client';

import type { ReactNode } from 'react';

import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import type { DateToString } from '@/libs/types';
import type { AuthItem } from '@/server/auth/types';

import { checkAccessToken } from '@/libs/token';

import type { AuthContextType } from './types';

import { Spinner } from '../loading/spinner';
import { AuthContext } from './context';

/**
 *  全局认证状态包装器
 */
export function Auth({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<DateToString<AuthItem> | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setChecked(false);

        const data = await checkAccessToken();

        setAuth(data);
      } catch (error) {
        toast.error('网络连接错误', {
          description: `${(error as Error).message}, 请尝试刷新页面`,
        });
      }
      setChecked(true);
    })();
  }, []);

  const value: AuthContextType = useMemo(() => ({ auth, setAuth }), [auth]);
  return (
    <AuthContext value={value}>
      {checked ? (
        children
      ) : (
        <Spinner
          className="rounded-sm bg-white/80 transition-opacity duration-300 dark:bg-black/50"
          icon={false}
        />
      )}
    </AuthContext>
  );
}
