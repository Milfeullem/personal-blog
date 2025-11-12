import type { DotenvParseOutput } from 'dotenv';

import dotenv from 'dotenv';
import { findUpSync } from 'find-up';
import { isNil } from 'lodash';
import { readFileSync } from 'node:fs';
/**
 * 加载.env.*文件中的自定义环境变量
 */
export const loadFileEnvs = (): { file?: string; envs?: DotenvParseOutput } => {
  const envName = process.env.NODE_ENV;
  const file = findUpSync(['.env', `.env.${envName}`]);

  if (!isNil(file)) {
    const envs = dotenv.parse(readFileSync(file));
    return { file, envs };
  }

  return {};
};
