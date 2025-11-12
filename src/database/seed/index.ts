import { prisma } from '../client';
import { createCategoryData } from './category';
import { createPostData } from './post';
import { createUserData } from './user';

async function truncate() {
  await prisma.post.$truncate();
  await prisma.category.$truncate();
  await prisma.tag.$truncate();
}
async function seed() {
  try {
    await truncate();
    await createUserData();
    await createCategoryData();
    await createPostData();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
  await prisma.$disconnect();
  process.exit();
}

seed();
