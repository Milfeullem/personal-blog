import type { DurationUnitsObjectType } from 'dayjs/plugin/duration';
import type z from 'zod';

import type { authItemSchema, authLoginRequestSchema, authLoginResponseSchema } from './schema';

/**
 * Auth配置
 */
export interface AuthConfig {
  /**
   * jwt令牌加密秘钥
   */
  jwtSecret: string;
  /**
   * 令牌过期时间,如果是number格式则默认为毫秒
   */
  tokenExpiry: DurationUnitsObjectType | number;
}

export type AuthLoginRequest = z.infer<typeof authLoginRequestSchema>;
export type AuthLoginResponse = z.infer<typeof authLoginResponseSchema>;
export type AuthItem = z.infer<typeof authItemSchema>;
