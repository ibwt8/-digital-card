import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.js';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is required');
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

try {
  const data = {
    name: 'Александр',
    description: 'Fullstack разработчик',
  };

  const profile = await prisma.profile.upsert({
    where: { id: 'main' },
    update: data,
    create: {
      id: 'main',
      ...data,
    },
  });

  console.log(profile);
} finally {
  await prisma.$disconnect();
}
