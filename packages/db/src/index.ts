import path from 'path';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../prisma/generated/client';

const isDist = __dirname.includes('dist');

const envPath = isDist
  ? path.resolve(__dirname, '../../../../.env')
  : path.resolve(__dirname, '../../../.env');

dotenv.config({ path: envPath });

const connectionString = process.env.DATABASE_URL;

export const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

export const db = new PrismaClient({ adapter });

export * from '../prisma/generated/client';
