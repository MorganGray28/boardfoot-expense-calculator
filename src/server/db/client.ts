import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { env } from '../../env/server.mjs';

declare global {
	// eslint-disable-next-line no-var
	var prisma: PrismaClient | undefined;
}

import { Pool } from 'pg';

const connectionString = env.DATABASE_URL;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

export const prisma =
	global.prisma ||
	new PrismaClient({
		adapter: adapter,
		log: env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
	});

if (env.NODE_ENV !== 'production') {
	global.prisma = prisma;
}
