'use server';

import { isNil } from 'lodash';

import db from '@/libs/db/client';
import { verifyPassword } from '@/libs/passwd';

/**
 * 验证用户名和密码
 * @param credential 用户名或邮箱
 * @param password 密码
 */
export const validateUser = async (credential: string, password: string) => {
  const user = await db.user.findFirst({
    where: {
      OR: [{ username: credential }, { email: credential }],
    },
    select: {
      id: true,
      username: true,
      email: true,
      password: true,
    },
  });

  if (isNil(user)) {
    return null;
  }

  const isPasswordValid = verifyPassword(password, user.password);

  if (!isPasswordValid) {
    return false;
  }

  const { password: _, ...userWithoutPassword } = user;

  return userWithoutPassword;
};

/**
 * 获取用户
 * @param id 用户ID
 */
export const getUser = async (id: string) => {
  return db.user.findUnique({ where: { id } });
};
