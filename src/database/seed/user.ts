import { faker } from '@faker-js/faker';

import { hashPassword } from '@/libs/passwd';

import { prisma } from '../client';

export const createUserData = async () => {
  await prisma.user.$truncate();
  await prisma.user.create({
    select: { id: true },
    data: {
      username: 'yulia',
      password: hashPassword('12345678aA$'),
      email: 'yulia@example.com',
    },
  });
  for (let index = 0; index < 12; index++) {
    await prisma.user.create({
      select: { id: true },
      data: {
        username: faker.internet.username(),
        password: hashPassword(faker.internet.password()),
        email: faker.internet.email(),
      },
    });
  }
};
