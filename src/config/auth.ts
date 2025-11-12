import type { AuthConfig } from '@/server/auth/types';

export const authConfig: AuthConfig = {
  jwtSecret: process.env.AUTH_JWT_SECRET || 'your-secret-key',
  tokenExpiry: { days: 5 },
};
