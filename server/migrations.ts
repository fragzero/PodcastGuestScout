import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { db } from './db';
import { log } from './vite';

export async function runMigrations() {
  log('Running migrations...');
  
  try {
    // First, we generate the SQL needed to create our schema
    const { drizzle } = await import('drizzle-orm/node-postgres');
    const { migrate } = await import('drizzle-orm/node-postgres/migrator');
    
    // This will create the tables from our schema
    await migrate(db, { migrationsFolder: './migrations' });
    log('Migrations completed successfully');
  } catch (error) {
    log(`Migration error: ${error}`);
    // Don't exit the process as we want the server to start anyway
  }
}