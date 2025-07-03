import { defineConfig } from 'drizzle-kit';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set. Please check your .env file.');
}

export default defineConfig({
  schema: './src/models/schema.js',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL,
  },
  verbose: true,
  strict: true,
});
