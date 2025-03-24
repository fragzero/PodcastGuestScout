import { sql } from 'drizzle-orm';
import pg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '../shared/schema';
import { log } from './vite';

export async function pushSchema() {
  log('Pushing schema to database...');
  
  try {
    // Create a PostgreSQL connection
    const pool = new pg.Pool({
      connectionString: process.env.DATABASE_URL,
    });
    
    const db = drizzle(pool, { schema });
    
    // Create users table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      )
    `);
    
    // Create candidates table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS candidates (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        social_handle TEXT NOT NULL,
        platform TEXT NOT NULL,
        additional_platforms TEXT[] DEFAULT '{}',
        follower_count INTEGER NOT NULL,
        region TEXT NOT NULL,
        topics TEXT[] DEFAULT '{}',
        description TEXT NOT NULL,
        image_url TEXT,
        is_recommended BOOLEAN DEFAULT FALSE,
        is_favorite BOOLEAN DEFAULT FALSE,
        created_at TEXT NOT NULL
      )
    `);
    
    log('Schema pushed successfully');
    
    // Close the pool
    await pool.end();
  } catch (error) {
    log(`Error pushing schema: ${error}`);
  }
}