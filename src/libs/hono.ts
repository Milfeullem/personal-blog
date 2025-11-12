import type { CookieValueTypes } from 'cookies-next';
import type { Hono } from 'hono';

import { hc } from 'hono/client';
import { isNil } from 'lodash';
import { redirect } from 'next/navigation';

import { appConfig } from '@/config/app';
import { getCookie } from '@/libs/coolkies';

import { deleteCookie } from './coolkies';
import { ACCESS_TOKEN_COOKIE_NAME } from './token';

/**
 * 获取通用请求头配置
 * 如果有传入getToken参数,则执行getToken函数获取jwt令牌,并在请求头中加上
 * @param getToken
 */
const getHeadersWithAccessToken = (
  getToken?: () => CookieValueTypes | Promise<CookieValueTypes>,
) => {
  return async () => {
    const headers: Record<string, string> = {};

    if (!isNil(getToken)) {
      const token = await getToken();

      if (!isNil(token) && token.length) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    return headers;
  };
};

/**
 * 在服务端组件中创建hono api客户端
 */
export function buildClient<T extends Hono<any, any, any>>(route?: string) {
  return hc<T>(`${appConfig.baseUrl}${appConfig.apiPath}${route}`, {
    headers: getHeadersWithAccessToken(async () => getCookie(ACCESS_TOKEN_COOKIE_NAME)),
  });
}

/**
 * 在服务端组件中请求hono api
 * @param client
 * @param run
 */
export async function fetchApi<
  T extends Hono<any, any, any>,
  F extends (c: C) => Promise<any>,
  C = ReturnType<typeof hc<T>>,
>(client: C, run: F): Promise<ReturnType<F>> {
  const result = await run(client);

  if (!result.ok && result.status === 401) {
    if (typeof window === 'undefined') {
      redirect('/auth/login');
    } else {
      await deleteCookie(ACCESS_TOKEN_COOKIE_NAME);
      window.location.href = '/auth/login';

      return new Promise(() => {}); // 防止后续代码执行
    }
  }

  return result;
}
