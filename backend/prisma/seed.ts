import { Logger } from '@nestjs/common';
import { Sample, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const sampleData: Sample[] = [
  {
    id: 1,
    name: 'Foo',
    displayedId: 'ABC-DEF-GHI',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    name: 'Bar',
    displayedId: '123-456-789',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const doSeed = async () => {
  const samples = [];
  for (const sample of sampleData) {
    const createPosts = prisma.sample.create({
      data: sample,
    });
    samples.push(createPosts);
  }
  return await prisma.$transaction(samples);
};

const main = async () => {
  Logger.log(`Start seeding ...`);

  await doSeed();

  Logger.log(`Seeding finished.`);
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
