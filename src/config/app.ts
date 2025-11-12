import type { AppConfig } from '@/libs/types';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export const appConfig: AppConfig = {
  baseUrl,
  apiPath: process.env.NEXT_PUBLIC_API_PATH || '/api',
  locale: 'zh-cn',
  timezone: 'Asia/Shanghai',
};
