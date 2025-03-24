import { 
  Candidate, 
  InsertCandidate, 
  User, 
  InsertUser, 
  FilterCandidate,
  users,
  candidates
} from "@shared/schema";
import { IStorage } from "./storage";
import { db } from "./db";
import { eq, and, like, sql, desc, asc } from "drizzle-orm";

export class DbStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async getCandidates(filter?: FilterCandidate): Promise<Candidate[]> {
    let query = db.select().from(candidates);
    
    if (filter) {
      const conditions = [];
      
      if (filter.platform && filter.platform !== "") {
        conditions.push(eq(candidates.platform, filter.platform));
      }
      
      if (filter.region && filter.region !== "") {
        conditions.push(eq(candidates.region, filter.region));
      }
      
      if (filter.topic && filter.topic !== "") {
        // This checks if the topic array contains the filter topic
        conditions.push(sql`${filter.topic} = ANY(${candidates.topics})`);
      }
      
      if (filter.followerRange && filter.followerRange !== "") {
        switch (filter.followerRange) {
          case "0-5k":
            conditions.push(sql`${candidates.followerCount} >= 0 AND ${candidates.followerCount} < 5000`);
            break;
          case "5k-10k":
            conditions.push(sql`${candidates.followerCount} >= 5000 AND ${candidates.followerCount} < 10000`);
            break;
          case "10k-50k":
            conditions.push(sql`${candidates.followerCount} >= 10000 AND ${candidates.followerCount} < 50000`);
            break;
          case "50k-100k":
            conditions.push(sql`${candidates.followerCount} >= 50000 AND ${candidates.followerCount} < 100000`);
            break;
          case "100k+":
            conditions.push(sql`${candidates.followerCount} >= 100000`);
            break;
        }
      }
      
      if (filter.search && filter.search.trim() !== "") {
        const searchTerm = `%${filter.search.toLowerCase()}%`;
        conditions.push(
          sql`(LOWER(${candidates.name}) LIKE ${searchTerm} OR 
               LOWER(${candidates.socialHandle}) LIKE ${searchTerm} OR 
               LOWER(${candidates.description}) LIKE ${searchTerm})`
        );
      }
      
      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }
      
      // Apply sorting
      if (filter.sort) {
        switch (filter.sort) {
          case "followers-desc":
            query = query.orderBy(desc(candidates.followerCount));
            break;
          case "followers-asc":
            query = query.orderBy(asc(candidates.followerCount));
            break;
          case "name-asc":
            query = query.orderBy(asc(candidates.name));
            break;
          case "name-desc":
            query = query.orderBy(desc(candidates.name));
            break;
          case "date-added":
            query = query.orderBy(desc(candidates.createdAt));
            break;
        }
      }
    }
    
    return await query;
  }

  async getCandidateById(id: number): Promise<Candidate | undefined> {
    const result = await db.select().from(candidates).where(eq(candidates.id, id));
    return result[0];
  }

  async createCandidate(insertCandidate: InsertCandidate): Promise<Candidate> {
    const candidateData = {
      ...insertCandidate,
      createdAt: new Date().toISOString()
    };
    
    const result = await db.insert(candidates).values(candidateData).returning();
    return result[0];
  }

  async updateCandidate(id: number, candidateUpdate: Partial<InsertCandidate>): Promise<Candidate | undefined> {
    const result = await db
      .update(candidates)
      .set(candidateUpdate)
      .where(eq(candidates.id, id))
      .returning();
    
    return result[0];
  }

  async deleteCandidate(id: number): Promise<boolean> {
    const result = await db
      .delete(candidates)
      .where(eq(candidates.id, id))
      .returning({ id: candidates.id });
    
    return result.length > 0;
  }

  async toggleFavorite(id: number): Promise<Candidate | undefined> {
    // First get the current favorite status
    const candidate = await this.getCandidateById(id);
    if (!candidate) {
      return undefined;
    }
    
    // Toggle the favorite status
    const result = await db
      .update(candidates)
      .set({ isFavorite: !candidate.isFavorite })
      .where(eq(candidates.id, id))
      .returning();
    
    return result[0];
  }

  async getTotalCandidates(filter?: FilterCandidate): Promise<number> {
    const candidates = await this.getCandidates(filter);
    return candidates.length;
  }
}