import { PrismaClient } from '@prisma/client';
import { withBark } from 'prisma-extension-bark';

import { truncateExt } from './extensions/truncate';

const prisma = new PrismaClient()
  .$extends(truncateExt('postgres', {}))
  .$extends(withBark({ modelNames: ['category'] }));

export { prisma };
