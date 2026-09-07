import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getPrismaClient(): PrismaClient {
  let dbUrl = process.env.DATABASE_URL;

  // In Vercel serverless environment:
  // AWS Lambda filesystem at /var/task is read-only. SQLite requires write access
  // for locks and journals, so we copy the seeded dev.db to /tmp/dev.db.
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    try {
      const tmpDbPath = path.join('/tmp', 'dev.db');

      if (!fs.existsSync(tmpDbPath) || fs.statSync(tmpDbPath).size === 0) {
        const potentialSources = [
          path.join(process.cwd(), 'prisma', 'dev.db'),
          path.join(__dirname, '..', '..', 'prisma', 'dev.db'),
          path.join(__dirname, '..', 'prisma', 'dev.db'),
          path.resolve('./prisma/dev.db'),
        ];

        for (const src of potentialSources) {
          if (fs.existsSync(src) && fs.statSync(src).size > 0) {
            fs.copyFileSync(src, tmpDbPath);
            break;
          }
        }
      }

      if (fs.existsSync(tmpDbPath)) {
        dbUrl = `file:${tmpDbPath}`;
      }
    } catch (e) {
      console.error('Error preparing SQLite database in /tmp:', e);
    }
  }

  const client = new PrismaClient({
    datasources: dbUrl
      ? {
          db: {
            url: dbUrl,
          },
        }
      : undefined,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

  return client;
}

export const prisma = globalForPrisma.prisma ?? getPrismaClient();

if (process.env.NODE_ENV !== 'production' || !globalForPrisma.prisma) {
  globalForPrisma.prisma = prisma;
}

