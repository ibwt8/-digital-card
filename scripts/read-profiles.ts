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
  const profiles = await prisma.profile.findMany({
    include: {
      skills: true,
      links: true,
      experience: true,
      projects: true,
    },
  });
  console.dir(profiles, { depth: null });
} finally {
  await prisma.$disconnect();
}
