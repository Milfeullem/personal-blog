import type { AuthApiType } from '@/server/auth/routes';
import type { AuthLoginRequest } from '@/server/auth/types';

import { buildClient, fetchApi } from '@/libs/hono';
import { authPath } from '@/server/auth/constants';

export const authClient = buildClient<AuthApiType>(authPath);
export const authApi = {
  login: async (data: AuthLoginRequest) =>
    fetchApi(authClient, async (c) =>
      c.login.$post({
        json: data,
      }),
    ),
  profile: async () => fetchApi(authClient, async (c) => c.profile.$get()),
  logout: async () => fetchApi(authClient, async (c) => c.logout.$post()),
};
