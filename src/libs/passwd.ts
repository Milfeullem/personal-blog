import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

const scryptParam = {
  N: 16384,
  r: 8,
  p: 1,
};

/**
 * 生成密码哈希
 * @param password 原始密码
 * @returns 格式: salt.hash
 */
export const hashPassword = (password: string): string => {
  try {
    // 生成16字节的随机盐值
    const salt = randomBytes(16).toString('hex');
    const hash = scryptSync(password, salt, 64, scryptParam).toString('hex');

    return `${salt}.${hash}`;
  } catch (error) {
    throw new Error(error as any);
  }
};

/**
 * 验证密码
 * @param password 待验证的密码
 * @param storedHash 存储的哈希值（格式：salt.hash）
 * @returns 密码是否正确
 */
export const verifyPassword = (password: string, storedHash: string): boolean => {
  try {
    const [salt, hash] = storedHash.split('.');

    if (!salt || !hash) {
      return false;
    }

    // 使用相同的参数
    const hashVerify = scryptSync(password, salt, 64, scryptParam).toString('hex');

    return timingSafeEqual(Buffer.from(hash), Buffer.from(hashVerify));
  } catch {
    return false;
  }
};
