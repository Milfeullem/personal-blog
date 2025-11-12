import chalk from 'chalk';
import { isNil } from 'lodash';
import { randomBytes } from 'node:crypto';
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { loadFileEnvs } from '@/libs/env';

/**
 * 生成秘钥
 */
function generateFormattedSecret(): string {
  const bytes = randomBytes(32);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  // 生成32个随机字符
  let result = '';

  for (let i = 0; i < 32; i++) {
    const randomIndex = bytes[i] % chars.length;

    result += chars[randomIndex];
  }

  return result.match(/.{4}/g)!.join('-');
}

const { file, envs = {} } = loadFileEnvs();
let envPath = file;

if (isNil(envPath)) {
  envPath = resolve(__dirname, '../../..', 'env');
}

if (!isNil(envs?.AUTH_JWT_SECRET)) {
  console.log(chalk.green('The app key already exists and does not need to be generated!'));
} else {
  envs.AUTH_JWT_SECRET = generateFormattedSecret();

  const newEnvContent = Object.entries(envs)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

  writeFileSync(envPath, newEnvContent);
  console.log(chalk.green('App key generated successfully!'));
}

process.exit();
