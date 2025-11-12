'use client';

import { createContext } from 'react';

import type { DateToString } from '@/libs/types';
import type { AuthItem } from '@/server/auth/types';

import type { AuthContextType } from './types';

/**
 * 用户认证的全局状态Context
 */
export const AuthContext = createContext<AuthContextType>({
  auth: null,
  setAuth: (_: DateToString<AuthItem> | null) => {},
});
