import type { Context } from 'hono';

import { describeRoute, validator } from 'hono-openapi';
import { isNil } from 'lodash';

import { generateAccessToken } from '@/libs/token';

import type { AuthItem } from './types';

import { createHonoApp } from '../common/app';
import { createErrorResult, defaultValidatorErrorHandler } from '../common/error';
import {
  createServerErrorResponse,
  createSuccessResponse,
  createUnauthorizedErrorResponse,
  createValidatorErrorResponse,
} from '../common/response';
import {
  authLoginRequestSchema,
  authLoginResponseSchema,
  authProfileResponseSchema,
} from './schema';
import { getUser } from './service';
import { addTokenToBlacklist, createAuthenticatedHandler, passport, verifyJWT } from './utils';

export const authTags = ['认证操作'];

const app = createHonoApp();

export type AuthApiType = typeof authRoutes;

export const authRoutes = app
  .get(
    '/profile',
    describeRoute({
      tags: authTags,
      summary: '用户登录',
      description: '用户登录',
      responses: {
        ...createValidatorErrorResponse(),
        ...createSuccessResponse(authProfileResponseSchema, '获取成功'),
        ...createServerErrorResponse(),
      },
    }),
    async (c) => {
      try {
        const isAuthenticate = await verifyJWT(c);
        const { id } = (c.req as any).user;

        if (!isAuthenticate) {
          return c.json({ result: false, data: null }, 200);
        }

        const user = await getUser(id);

        if (isNil(user)) {
          return c.json({ result: false, data: null }, 200);
        }

        return c.json({ result: true, data: user }, 200);
      } catch (error) {
        return c.json(createErrorResult('获取用户失败', error), 500);
      }
    },
  )
  .post(
    '/login',
    describeRoute({
      tags: authTags,
      summary: '用户登录',
      description: '用户登录',
      responses: {
        ...createValidatorErrorResponse(),
        ...createSuccessResponse(authLoginResponseSchema, '登录成功'),
        ...createUnauthorizedErrorResponse('认证失败'),
        ...createServerErrorResponse(),
      },
    }),
    validator('json', authLoginRequestSchema, defaultValidatorErrorHandler),
    async (c) => {
      const body = await c.req.json();
      // 手动构建认证请求
      const authReq = {
        ...c.req.raw,
        body,
      };

      return new Promise((resolve) => {
        passport.authenticate('local', (err: any, user: AuthItem, _info: any) => {
          if (err) {
            return err.code === 401
              ? resolve(c.json(createErrorResult('认证失败', err.message), 401))
              : resolve(c.json(createErrorResult('服务器错误', err), 500));
          }

          const token = generateAccessToken(user);
          return resolve(c.json({ token }, 200));
        })(authReq, (c.res as any).raw, (err: Error) => {
          resolve(c.json(createErrorResult('服务器错误', err), 500));
        });
      });
    },
  )
  .post(
    '/logout',
    describeRoute({
      tags: authTags,
      summary: '用户登出',
      description: '用户登出',
      responses: {
        ...createUnauthorizedErrorResponse(),
        ...createSuccessResponse(authLoginResponseSchema, '登出成功'),
        ...createServerErrorResponse(),
      },
    }),
    createAuthenticatedHandler(async (c: Context) => {
      try {
        const { id } = (c.req as any).user as AuthItem;
        const success = await addTokenToBlacklist(id);

        // 注意：这里直接返回200就行了。因为反正你是退出成功还是token失效，前端都是跳转到登录页，没有什么区别
        if (!success) {
          return c.json(createErrorResult('用户未登录'), 200);
        }

        return c.json({ message: '登出成功' }, 200);
      } catch (error) {
        return c.json(createErrorResult('登出失败', error), 500);
      }
    }),
  );
