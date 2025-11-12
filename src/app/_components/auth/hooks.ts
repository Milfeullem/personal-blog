'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { isNil } from 'lodash';
import { useRouter } from 'next/navigation';
import { use, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import type { DateToString } from '@/libs/types';
import type { AuthItem, AuthLoginRequest, AuthLoginResponse } from '@/server/auth/types';
import type { createErrorResult } from '@/server/common/error';

import { authApi } from '@/api/auth';
import { deleteCookie } from '@/libs/coolkies';
import { ACCESS_TOKEN_COOKIE_NAME, setAccessToken } from '@/libs/token';
import { authLoginRequestSchema } from '@/server/auth/schema';

import { AuthContext } from './context';

/**
 * 创建登录表单
 */
export const useAuthLoginForm = () => {
  const defaultValues = {
    credential: '',
    password: '',
  } as NonNullable<AuthLoginRequest>;
  return useForm<AuthLoginRequest>({
    mode: 'all',
    resolver: zodResolver(authLoginRequestSchema),
    defaultValues,
  });
};

/**
 * 创建登录提交处理器
 * @param setAuthError
 */
export const useAuthLoginSubmitHandler = (setAuthError: (error: string | null) => void) => {
  const router = useRouter();

  return useCallback(
    async (data: NonNullable<AuthLoginRequest>) => {
      let status: number = 200;

      setAuthError(null);

      try {
        const res = await authApi.login(data);
        status = res.status;

        if (!res.ok) {
          throw new Error(((await res.json()) as ReturnType<typeof createErrorResult>).message);
        }

        const result = (await res.json()) as AuthLoginResponse;

        if (isNil(result.token)) {
          deleteCookie(ACCESS_TOKEN_COOKIE_NAME);
          setAuthError('获取token失败，请稍后再试');

          return false;
        }

        setAccessToken(result.token);
        router.replace(`/`);

        return true;
      } catch (error) {
        if (status === 401) {
          setAuthError((error as Error).message);

          return false;
        }

        toast.error('服务器错误', {
          id: 'auth-login-error',
          description: (error as Error).message,
        });

        return false;
      }
    },
    [router, setAuthError],
  );
};

/**
 * 获取认证状态
 */
export const useAuth = () => {
  const { auth } = use(AuthContext);

  return auth;
};

/**
 * 设置认证状态
 */
export const useSetAuth = () => {
  const { setAuth } = use(AuthContext);

  return useCallback((auth: DateToString<AuthItem> | null) => setAuth(auth), []);
};
